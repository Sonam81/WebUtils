const puppeteer = require('puppeteer');
const express = require("express");
const app = express();
const bp = require("body-parser");

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(express.static(__dirname + '/public/'));

// Simple routing to the index.ejs file
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/process", (req, res) => {
    const type = req.body.type;
    let url = req.body.url;
    console.log(url.trim().substring(0,8));
    if (url.trim().substring(0,8) != 'https://') 
        url = 'https://' + url;

    if (type == 'pdf') {
        (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(url, {
            waitUntil: 'networkidle2',
          });
          await page.pdf({ path: 'public/pdfs/pdf1.pdf', format: 'a4' });
          await browser.close();
          res.render("process", { url, type });
          res.end();
        })();

    } else if (type == 'screenshot') {
        (async () => {
            console.log(url);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            await page.screenshot({ path: 'public/screenshots/screenshot1.png' });
            await browser.close();
            res.render("process", { url, type });
            res.end();
        })();
    }
})


// Setting up the port for listening requests
const port = 5000;
app.listen(port, () => console.log("Server at 5000"));

