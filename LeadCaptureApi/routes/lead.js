

'use strict'

const express = require('express');

const profileRepo = require('../repositories/profileRepo').profileRepo;
const router = express.Router();


router.route('/leads/:id')
.put((req,res) => {

    res.json(profileRepo.update(req.params.id,req.body));

});


router.route('/leads/stats')
.get((req,res) =>
{

  profileRepo.getStats().then((response)=>{res.json(response);});

});

router.route('/leads/search')
.post((req,res) =>
{

  profileRepo.search(req.body.rules).then((response)=>{res.json(response);});

});

router.route('/leads/:id')
.get((req,res) => {

  profileRepo.get(req.params.id).then((response)=>{res.json(response);});

});

router.route('/leads/:id')
.delete((req,res) =>
{
    res.json(profileRepo.delete(req.params.id));

});


router.route('/leads')
.get((req,res) =>
{
  profileRepo.getAll().then((response)=>{res.json(response);});

});



// insert new lead
router.route('/leads')
.post((req, res) => {


  res.json(profileRepo.insert(req.body));

});

module.exports = router;
