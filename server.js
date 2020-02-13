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
app.engine("handlebars", exhbrs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");


mongoose.set('useFindAndModify', false);




mongoose.connect(`mongodb://localhost/ScrapeRepository`, { useNewUrlParser: true });

app.get(`/scrape`, function(req, res){
    axios.get(`https://www.reuters.com/news/us`).then(function(res){

        const $ = cheerio.load(res.data);

        let resObject = {};



        $(`.ImageStoryTemplate_image-story-container`).each( function(i, element){
            let link;
            let title;
            let imgLink;



            imgLink = $(element).children().children().children("img").attr("src");
            link = $(element).children().children().children(`a`).attr(`href`);
            title = $(element).children().children().children(`a`).text();




            resObject.title = title;
            resObject.link = link;
            resObject.imgLink = imgLink

            db.Article.create(resObject).then(function(data){});
            console.log(`INFORMATION SCRAPED`);

            if( i > 21){
                return false;
            }


        });








        // $(`.ImageStoryTemplate_image-story-container > span > a > img`).each(function(i, element) {
        //     let resObject = {};
        //     console.log(element.attribs.src);
        //     console.log(i);
        //     imgHolder.push(element.attribs.src);



            

        // });


        // $(`.FeedItemHeadline_headline`).each(function(i, element) {
        //     let resObject = {};


        //     resObject.title = $(this).children("a").text();
        //     resObject.link = $(this).children("a").attr(`href`);
        //     resObject.imgLink = imgHolder[i];


        //     db.Article.create(resObject).then(function(data){});
        //     if( i > 21){
        //         return false;
        //     }

        // });
        
           






        // res.send(`index`, `SCRAPING COMPLETE`);
    });

});









app.get(`/articles`, function(req, res){

    db.Article.find({}).then(function(data){
        


        
        res.json(data);
       
    }).catch(function(error){
        res.json(error);
    });
});

app.get(`/articles/:id`, function(req, res){

    db.Article.findOne({
        _id: req.params.id
    }).populate(`note`).then(function(articleNote){
        


        res.json(articleNote.note.body);
        
    })




});







app.post(`/articles/:id`, function(req, res){
    let noteSituation;

    db.Note.create(req.body).then(function(data){
        return db.Article.findOneAndUpdate(
            {_id: req.params.id},
            {note: data._id},
            {new: true}
        ).then(function(databasedArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(databasedArticle);
            console.log(databasedArticle)
          });

    }).catch(function(error){
        res.json(error);
    });




    //I GOT A ERROR: `Cast to string failed for value "{ body: 'BLAHBLAHBLAH' }" at path "body"`|| CAN'T FIX IT


    // db.Article.findOne({_id: req.params.id}).then(function(data){


    //     if( data.note === undefined || null){
    //         console.log(`NULL/UNDEFINED IDENTITY IDENTIFIED`);

    //         db.Note.create(req.body).then(function(response){
    //             return db.Article.findOneAndUpdate(
    //                 {_id: req.params.id},
    //                 {note: response._id},
    //                 {new: true}
    //             ).then(function(databasedArticle) {
    //                 // If we were able to successfully update an Article, send it back to the client
    //                 res.json(databasedArticle);
    //                 console.log(databasedArticle)
    //             });

    //         }).catch(function(error){
    //             res.json(error);
    //         });

            
    //     }
    //     else{
    //         db.Note.findOneAndUpdate({_id: req.params.id}, {body: req.body}).then(function(proof){
                

    //             console.log(`JKADSIOJEJK${proof}`);
                
    //             res.json(proof);
            
    //         }).catch(function(error){
    //             console.log(error);
    //         })
    //     }





    // });

    
});

    



app.get(`/`, function (req, res) {
    res.render(`index`, {});
  });










app.listen(PORT, function() {

    console.log(`APP RUNNING ON PORT: ${PORT}`);
});