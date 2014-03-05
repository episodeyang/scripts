var child_process, delayTimeout, healthCheckInterval, _;

_ = require('underscore')._;

child_process = require('child_process');

healthCheckInterval = 60 * 1000;

delayTimeout = function(ms, func) {
  return setTimeout(func, ms);
};

exports.spawnMonitoredChild = function(script, port, healthCheck, environmentVariables) {
  var respawn;
  respawn = function() {
    var child, delayedHealthCheck, healthCheckTimeout;
    child = child_process.spawn(process.execPath, [script], {
      env: _.extend(environmentVariables, process.env)
    });
    console.log("Started child, port=" + port + ", pid=" + child.pid);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    healthCheckTimeout = null;
    delayedHealthCheck = function() {
      return healthCheckTimeout = delayTimeout(healthCheckInterval, function() {
        var start;
        start = new Date();
        return healthCheck(port, function(healthy) {
          if (healthy) {
            console.log("" + port + " is healthy - ping time " + (new Date() - start) + "ms");
            return delayedHealthCheck();
          } else {
            console.error("" + port + " did not respond in time - killing it");
            return child.kill();
          }
        });
      });
    };
    child.on('exit', function(code, signal) {
      clearTimeout(healthCheckTimeout);
      console.error("Child exited with code " + code + ", signal " + signal + ", respawning");
      return respawn();
    });
    return delayedHealthCheck();
  };
  return respawn();
};
