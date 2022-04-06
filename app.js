if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const flash = require('express-flash')
const methodOverride = require('method-override')
const html = require('./html');
const puppeteer = require('puppeteer');
const bodyParser = require( "body-parser");
const https = require('https')
const fs = require('fs')

var port = 3000;

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('index.ejs')
})


async function handlPdf (req, res)  {
  try {
   
    const data = req.body.html;
   
 
    const browser = await puppeteer.launch({
     'args' : [
       '--no-sandbox',
       '--disable-setuid-sandbox'
     ]
   });
       const page = await browser.newPage();
       
       const htmlcontent = html.content(data)
       await page.setContent(htmlcontent, { waitUntil: 'networkidle0' });
       const pdf = await page.pdf({
          // path: 'report.pdf',
           format: 'a4',
           printBackground: true,
           margin: {
            top: '20px',
            bottom: '8px',
            left: '30px',
            right: '20px',
          },
       });
 
       await browser.close();
       
       res.contentType("application/pdf");
          return res.send(pdf);
   } catch (error) {
       res.send(error);
   }
 }
 
 

app.post('/pdf',handlPdf)

app.listen(process.env.PORT || 3000)