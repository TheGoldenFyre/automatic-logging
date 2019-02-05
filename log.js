let date = require("date-and-time");
let fs = require("fs");
let path = require("path");
let request = require("request");
let util = require("util");

/*
//Syntax:
//log(msg: string), log(msg: string, outPath: string),
//log(msg: string, cb: function), log(msg: string, outPath: string, cb: function)
*/
exports.log = function log(msg, prefix) {
    let now = new Date();
    if (!prefix) prefix = "";
    let txt = `${date.format(now, 'DD MMM HH:mm:ss.SSS')}: ${prefix}${msg}`;

    console.log(txt); //Output log
    fs.appendFile(path.resolve(`./logs/${date.format(now, 'DD-MM-Y')}`), txt, (err) => { //Write log to disc
      if (err) throw err;
    });
}

/*
//Syntax:
//logIP(ip: string), logIP(ip: string, outPath: string),
//logIP(ip: string, cb: function), logIP(ip: string, outPath: string, cb: function)
*/
exports.logIP = function logIP(ip){
    let p = path.join(__dirname + `/ips/`);
    let base = "http://api.ipapi.com/api/"; //Base url for ip api
    let key = "";
    fs.readFile(path.join(__dirname + "/ipapi.key"), (key_err, data) => {
        if (key_err) throw key_err;
        key = data;
        let url = `${base}${ip}?access_key=${key}`
        fs.access(`${p}/processed/${ip}`, fs.F_OK, (pr_err) => {
            if (pr_err) {
                fs.access(`${p}/incoming/${ip}`, fs.F_OK, (in_err) => {
                    if (in_err) {
                        //IP was not yet logged
                        request(url, {json: true}, (req_err, res, body) => {
                            if (req_err){
                                console.log(req_err);
                            }
                            fs.writeFile(`${p}/incoming/${ip}`, util.inspect(res.body), () => {
                                return;
                            });
                        });
                    }
                })
            } 
            return;
        });
    }); 
}