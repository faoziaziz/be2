/*
  author : Aziz Amerul faozi

*/
var express = require('express');
const axios = require('axios');
var lsdata = require("../model/lsdata");
var router = express.Router();
const redis = require("redis");
const {v4 : uuidv4} = require('uuid')

/* its time to add redis lol */
const {set, get, isExists}=require("../cont/redis_func");




const object_c = {
    id: "some id c",
    title: "Title c",
    shortdesc: "shotdesc c",
    longdesc: "longdesc c",
}



/* Get test router */

router.get('/itemhome', async (req, res, next)=>{
    //res.send('Just send with test');
//    console.log(JSON.stringify(lsdata));

    if (await isExists("lsdata")){
	const value = await get('lsdata')
	res.json(JSON.parse(value))

    } else {
	
	res.json(req.body);

    }
    
}); 


router.get('/add', function(req, res, next){
    lsdata.product.items.push(object_c);
    res.send("i love you")
    set("lsdata", JSON.stringify(lsdata))

});


router.get('/testjson', function(req, res, next){
    client.set("student", "Laylaa", function(err, reply) {
	console.log(reply);
    });

    client.get("student", function(err, reply){
	console.log(reply);

    });

    client.hmset("employees",
		 { HR: "Anthony", MIS: " Clint", Accounting: "Mark" });

    client.hgetall("employees", function(err, object) {
	console.log(object);
    });

    client.rpush(["vegetable", "carrot", "celery"], function(err, reply) {
	console.log(reply);
    });

    client.lrange("vegetable", 0, -1, function(err, reply) {
	console.log(reply);
    });

    
    
    res.json({
	username: 'Aziz Faozi'
    });

});


router.post('/itemhome', async (req, res, next)=>{

    
    object_c.id=uuidv4()
    object_c.title=req.body.title
    object_c.shortdesc=req.body.shortdesc
    object_c.longdesc=req.body.longdesc

    if(await isExists("lsdata")){
	//console.log("lsdata ada")
	lsdata = JSON.parse(await get("lsdata"))
    } else {
	console.log("not exist lsdata")
    }

    if (req.body.target=="product") {
	/* write to product */
	lsdata.product.items.push(object_c);

    } else if (req.body.target=="shop") {
	lsdata.shop.items.push(object_c);

    } else if(req.body.target=="project") {
	lsdata.project.items.push(object_c);

    } else if(req.body.target=="riset"){
	lsdata.riset.items.push(object_c);

    } else if(req.body.target=="konsultasi") {
	lsdata.konsultasi.items.push(object_c);
    }
    /* then just write to redis */
    set("lsdata", JSON.stringify(lsdata))
    
    res.json(req.body);
    
});





router.get('/testparam', async (req, res, next)=>{
    
    res.json({
	name: "akh"
	
    });

});
/* lets get some with api */

router.get("/jobs", async(req, res)=>{
    const searchTerm = req.query.search;
    console.log(searchTerm);
    try {
	client.get(searchTerm, async (err, jobs)=>{
	    if(jobs){
		req.status(200).send({
		    jobs: JSON.parse(jobs),
		    message: "data retrieved from cache"

		});

	    }
	    else {
		const jobs=await axios.get(`https://jobs.github.com/positions.json?search=${searchTerm}`);
		res.status(200).send({
		    jobs: jobs.data,
		});

	    }

	});
	
    } catch(err){
	res.status(500).send({message: err.message});
    }
});


module.exports=router;
