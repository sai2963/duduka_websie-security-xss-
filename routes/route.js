const express = require("express");
const router = express.Router();
const xss=require('xss');
const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");
const db = require("../data/database");
const ObjectId = mongodb.ObjectId;
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use((req, res, next) => {
    if (req.session.isAuthenticated) {
      res.locals.user = req.session.user;
    }
    next();
  });

  router.get('/discussion', async (req, res) => {
    try {
        const data = await db.getDb().collection('data').find().toArray();
        res.render('discussion', { data: data });
    } catch (error) {
        console.error("Error fetching discussion data:", error);
        res.status(500).send("Internal Server Error");
    }
});

  
  router.post('/comment',(req,res)=>{
    const data=req.body;
    const enteredtitle=data.title;
    const enteredcomment=data.comment;
    const discussdata={
        title:enteredtitle,
        comment:xss(enteredcomment)
    }   
    db.getDb().collection("data").insertOne(discussdata);
    res.redirect('/discussion')
  })
  module.exports=router;
