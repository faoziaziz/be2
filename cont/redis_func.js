/*
  author : Aziz Amerul Faozi
  desc : this code use for controller 
*/

const redis=require("redis")
const redisPort =6379;
const client = require('redis').createClient();
const { promisify } = require("util");



client.on('connect', () => {
    console.log('Redis client connected');
});

client.on("error", (error) => {
    console.error(error);
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const isExists = promisify(client.exists).bind(client)



module.exports={
    get,
    set,
    isExists

};
