const fs = require("fs");
const request = require("request")

const done = (data) => {
    process.stdout.write(data + "\n");
    process.stdout.write("MATE > ");
}

module.exports = {
    pwd: () => {
        done(process.env.PWD);
    },
    date: () => {
        done(Date());
    },
    ls: () => {
        fs.readdir('.', function(err, files) {
            if (err) throw err;
            files.forEach(function(file) {
             done(file.toString());
            })
          });
    },
    echo: (text) => {
        console.log(text)
    },
    cat: (file) => {
        fs.readFile("./" + file, "utf8", function(err, files) {
            if (err) throw err;
            done(files.toString());
          });
    },
    head: (file) => {
        fs.readFile("./" + file, "utf8", function(err, files) {
            if (err) throw err;
            const firstLines = files.split("\n").slice(0,5).join("\n")
            done(firstLines);
          });
    },
    tail: (file) => {
        fs.readFile("./" + file, "utf8", function(err, files) {
            if (err) throw err;
            const latestLines = files.split("\n").slice(-5).join("\n")
            done(latestLines);
          });
    },
    curl: (url) => {
        request("http://" + url, (err,response, body) => {
            if(err) throw err;
            done(body);
        })
    },
}
