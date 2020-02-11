const express = require("express");
const exhbrs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");


const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

//HANDLEBARS CODE
app.engine(`handlebars`, exhbrs({ defaultLayout: `main`}));
app.set(`view engine`, `handlebars`);







mongoose.connect(`mongodb://localhost/ScrapeRepository`, { useNewUrlParser: true });

app.get(`/scrape`, function(req, res){
    axios.get(`https://www.reuters.com/news/us`).then(function(res){

        const $ = cheerio.load(res.data);


        $(`.FeedItemHeadline_headline`).each(function(i, element) {
            let resObject = {};


            resObject.title = $(this).children("a").text();
            resObject.link = $(this).children("a").attr(`href`);
            resObject.imgLink = $()


            db.Article.create(resObject).then(function(data){
                console.log(data);
            });

        });
        res.send(`index`, `SCRAPING COMPLETE`);
    });

});
// app.get(`/scrape`, function(req, res){
//     axios.get(`https://www.reuters.com/news/us`). then(function(res){
//         const $ = cheerio.load(response.data);



//         $(`.`)



//     })



// });

app.get(`/`, function(req, res){

    db.ArticleSchema.find({}).then(function(data){
        const fetch = {
            article: data
        }



        res.render(`index`, fetch);

    });
});











app.listen(PORT, function() {

    console.log(`APP RUNNING ON PORT: ${PORT}`);
});