var express = require("express");
var fs = require('fs');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views")
app.listen(3000);

const cron = require("node-cron");
var request = require("request");
var cheerio = require("cheerio");
app.get("/", function(req, res) {
    cron.schedule("* * * * *", function() {
        console.log("running a task every minute");

        request("https://cacnuoc.vn/covid-19/", function(error, response, body) {
            if (error) {
                console.log(error);
            } else {
                $ = cheerio.load(body);
                const ds = $(body).find("tbody > tr ");
                // var ds = $(body).find("tbody > tr > td > a");
                const obj = {
                    'data': []
                }
                ds.each(function(i, e) {
                    obj.data.push({
                        "Country": $(this).find("td:nth-child(1)").text(),
                        "TotalCase": $(this).find("td:nth-child(2)").text(),
                        "NewCase": $(this).find("td:nth-child(3)").text(),
                        "TotalDeath": $(this).find("td:nth-child(4)").text(),
                        "NewDeath": $(this).find("td:nth-child(5)").text(),
                        "TotalRecovery": $(this).find("td:nth-child(6)").text(),
                        "Infected": $(this).find("td:nth-child(7)").text(),
                        "Critical": $(this).find("td:nth-child(8)").text(),
                        "InfectionRate": $(this).find("td:nth-child(9)").text(),
                        "DeathRate": $(this).find("td:nth-child(10)").text(),
                        "Tested": $(this).find("td:nth-child(11)").text(),
                        "Tested rate": $(this).find("td:nth-child(12)").text(),
                        "Area": $(this).find("td:nth-child(13)").text(),


                    })
                })

                const json = JSON.stringify(obj);
                fs.writeFile('datas.json', json, 'utf-8', (err) => {
                        if (err) throw err;
                    })
                    // ds.each(function(i, e) {
                    //     console.log($(this).text());
                    // }), res.render("trangchinh", { html: body });
            }
        })

    })
});