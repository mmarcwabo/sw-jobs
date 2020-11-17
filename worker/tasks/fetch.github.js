var fetch = require('node-fetch');
const { join } = require('path');
//redis in action here
const redis = require("redis");
const client = redis.createClient();
//use built-in node.js util.promisify
const { promisify } = require("util");
const setAsync = promisify(client.set).bind(client);
//Data  from rest api - with a customizable query string
const baseUrl = "https://jobs.github.com/positions.json";

async function fetchGithub() {

    let resultCount = 1, onPage = 0;
    //Push all jobs we get in an array
    allJobs = [];

    while (resultCount > 0) {
        const res = await fetch(`${baseUrl}?page=${onPage}`)
        const jobs = await res.json();
        allJobs.push(...jobs);
        //console.log({ jobs });
        resultCount = jobs.length;
        //log the number of jobs
        console.log('got ', resultCount, ' jobs');
        onPage++;
    }

    //filter algo
    const jrJobs = allJobs.filter(job=>{
        const jobTitle  = job.title.toLowerCase();
        let isJunior = true;

        //algo logic
        if(
            jobTitle.includes('senior') ||
            jobTitle.includes('sr.') ||
            jobTitle.includes('architect') ||
            jobTitle.includes('manager')
            
        ){
            return false;
        }

        return true;
    })
    console.log('Filtered down to', jrJobs.length);

    //Set in redis
    console.log('Total ', allJobs.length, ' jobs');
    //We stringify the alljobs array
    const success  = await setAsync('github', JSON.stringify(jrJobs));
    console.log({success});
}
fetchGithub();

module.exports = fetchGithub;
