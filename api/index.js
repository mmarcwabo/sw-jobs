const express = require('express')
const app = express()
//The client is running on 3000
//That why we set a different port number
const port = 3001

//redis in action here
const redis = require("redis");
const client = redis.createClient();
//use built-in node.js util.promisify
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

app.get('/jobs', async (req, res) => {

    const jobs = await getAsync('github');
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    //console.log(JSON.parse((jobs).length));
    return res.send(jobs)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})