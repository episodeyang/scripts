/**
 * Created by geyang on 3/5/14.
 */

var MonitoredChild, async, bounceInterval, bounceWait, child_process, delayTimeout, healthCheckInterval, _;

_ = require('underscore')._;

child_process = require('child_process');

async = require('async');

healthCheckInterval = 60 * 1000;

bounceInterval = 60 * 1000;

bounceWait = bounceInterval + 30 * 1000;

delayTimeout = function(ms, func) {
    return setTimeout(func, ms);
};

MonitoredChild = (function() {
    function MonitoredChild(script, port, healthCheck, environmentVariables) {
        this.script = script;
        this.port = port;
        this.healthCheck = healthCheck;
        this.environmentVariables = environmentVariables;
        this.currentChild = null;
        this.healthCheckTimeout = null;
        this.bounceTimeout = null;
        this.expectedExit = false;
    }

    MonitoredChild.prototype.bounce = function() {
        if (this.currentChild == null) {
            return this.respawn();
        }
        console.log("Requested bounce of " + this.currentChild.pid + ", port " + this.port);
        clearTimeout(this.healthCheckTimeout);
        this.expectedExit = true;
        this.currentChild.kill();
        return this.bounceTimeout = delayTimeout(bounceInterval, (function(_this) {
            return function() {
                console.error("Child did not exit in time, forcefully killing it");
                return _this.currentChild.kill("SIGKILL");
            };
        })(this));
    };

    MonitoredChild.prototype.delayedHealthCheck = function() {
        return this.healthCheckTimeout = delayTimeout(config.healthCheckInterval, (function(_this) {
            return function() {
                var start;
                start = new Date();
                return _this.healthCheck(_this.port, function(healthy) {
                    if (healthy) {
                        console.log("" + _this.port + " is healthy - ping time " + (new Date() - start) + "ms");
                        return _this.delayedHealthCheck();
                    } else {
                        console.error("" + _this.port + " did not respond in time, killing it harshly");
                        return _this.currentChild.kill("SIGKILL");
                    }
                });
            };
        })(this));
    };

    MonitoredChild.prototype.respawn = function() {
        this.currentChild = child_process.spawn(process.execPath, [this.script], {
            env: _.extend(this.environmentVariables, process.env)
        });
        console.log("Started child", {
            port: this.port,
            pid: this.currentChild.pid
        });
        this.currentChild.stdout.pipe(process.stdout);
        this.currentChild.stderr.pipe(process.stderr);
        this.currentChild.on('exit', (function(_this) {
            return function(code, signal) {
                if (_this.healthCheckTimeout != null) {
                    clearTimeout(_this.healthCheckTimeout);
                }
                if (_this.bounceTimeout != null) {
                    clearTimeout(_this.bounceTimeout);
                }
                if (_this.expectedExit) {
                    _this.expectedExit = false;
                    console.info("Expected exit from child " + _this.currentChild.pid + ", port " + _this.port + " - respawning");
                } else {
                    console.error("Child " + _this.currentChild.pid + ", port " + _this.port + " exited with code " + code + ", signal " + signal + ", respawning");
                }
                return _this.respawn();
            };
        })(this));
        return this.delayedHealthCheck();
    };

    return MonitoredChild;

})();

exports.bounceChildren = function(monitoredChildren, callback) {
    return async.forEachSeries(monitoredChildren, function(monitoredChild, seriesCallback) {
        monitoredChild.bounce();
        return delayTimeout(bounceWait, seriesCallback);
    }, callback);
};

exports.spawnMonitoredChild = function(script, port, healthCheck, environmentVariables) {
    var ret;
    ret = new MonitoredChild(script, port, healthCheck, environmentVariables);
    ret.respawn();
    return ret;
};

