'use strict'

var healthCheck, i, numWorkers, port, startPort, _i, _ref;

healthCheck = function (port, cb) {
    var c, gotAuth;
    c = net.connect(port, 'localhost');
    c.setEncoding("utf8");
    gotAuth = false;
    c.on('data', function (data) {
        var d, error;
        d = null;
        try {
            d = JSON.parse(data);
        } catch (_error) {
            error = _error;
            c.end();
            console.error("Health check failed: bad initial response, " + data);
            return cb(false);
        }
        if (!gotAuth) {
            if (d.cmd === "PLSAUTH") {
                gotAuth = true;
                return c.write(JSON.stringify({
                    cmd: "RING"
                }) + "\r\n");
            } else {
                c.end();
                console.error("Health check failed: bad initial response, " + data);
                return cb(false);
            }
        } else {
            c.end();
            console.info("Health check response", {
                res: d
            });
            return cb(true);
        }
    });
    c.on('error', function (e) {
        console.error("Health check failed: error connecting " + e);
        return cb(false);
    });
    return c.setTimeout(config.healthCheckTimeout, function () {
        return c.destroy();
    });
};

numWorkers = 2;

startPort = 31337;

for (i = _i = 0, _ref = numWorkers - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    port = startPort + i;
    child_monitor.spawnMonitoredChild('./lib/sfs_socket', port, healthCheck, {
        SFS_SOCKET_PORT: port,
        SFS_SOCKET_HOST: socketHost
    });
}

