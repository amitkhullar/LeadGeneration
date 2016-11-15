

'use strict'

const express = require('express');
const router = express.Router();

const userRepo = require('../repositories/userRepo').userRepo;


router.route('/auth/signin')
.post((req,res) => {

    var credentials = req.body.credentials;

    userRepo.signin(credentials).then((response)=>{
      
        if(response.hasOwnProperty("userId"))
          res.json({"userId":response.userId,"name":response.name})
        res.status(500).json({ error: 'Invalid username or password.' })

    });



});

router.route('/auth/signup')
.post((req,res) => {

    var userDetails = req.body.userDetails;

    userRepo.ifExist(userDetails).then((response)=>{
      console.log("if exist : "+response);
      if(!response)
        {
        userRepo.signup(userDetails)
        .then((response)=>{

          console.log("last response : "+response.userId);
          res.json({"userId":response.userId,"name":response.name})

        });
      }
      else {
        res.status(500).json({ error: 'User already exist.' })
      }
    });




});



module.exports = router;
