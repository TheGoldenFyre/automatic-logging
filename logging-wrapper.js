const cp = require("child_process");
const path = require("path");
const logging = require('./log');

var child = cp.fork(path.resolve("./index.js"), {stdio: "pipe"});

child.stdout.on("data", (data) => {
    logging.log(data.toString('utf8'));
});

child.stderr.on('data', (data) => {
    logging.log(data.toString('utf8'), "Error: ");
})

child.on("message", (data) => {
    data = JSON.parse(data);
    if (data.type == "IP"){
        logging.logIP(data.ip)
    }
})
