const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");

app.use(express.static("Public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXX All Articels XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
app.route("/articles")

  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new Article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully delted all articles");
      } else {
        res.send(err);
      }
    });
  }); //chained method easy to use



//XXXXXXXXXXXXXXXXXXXXXX  Specific ARTICLE  XXXXXXXXXXXXXXX//

app.route("/articles/:articleTitle")

  .get(function(req, res) {


    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      // }, {
      //   overwrite: true   // Not compulsory but use to overwrite
      // },                   // There are many things we have to learn from Documentation
      function(err) {
        if (!err) {
          res.send("Successfully updated Articles");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully patch the articles.");
        } else {
          res.send(err);
        }
      }
    );
  })


  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("deleted successfully.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function() {
  console.log("Server is started at 3000");
});
