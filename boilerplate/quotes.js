'use strict';

const express = require('express');
const router = express.Router();


// const quote = router.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
// console.log(quote)
// const ul = document.getElementsByTagName('body');
// const url = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes'

// fetch(url)
//     .then((resp) => resp.json()) // Transform the data into json
//     .then(function (data) {
//         console.log(data)
//     })
const request = require("request");
const cheerio = require("cheerio");



// const url = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
// request.get(url, (error, response, body) => {
//     let inQuote = JSON.parse(body);
//     console.log(inQuote);
// });



// const url1 = "https://icanhazdadjoke.com";
// request.get(url1, (error, response, body) => {
//     let $ = cheerio.load(body)
//     let inJoke = $("p.subtitle").text(); 
//     console.log(inJoke);

// })

const url2 = "https://quotes.rest/qod"
request.get(url2, (error, response, html) => {
    let $ = cheerio.load(html, {
        xmlMode: true
    });
    let quote2 = $('[xml\\:contents\\:quotes\\:quote]').text();

    console.log(quote2);

})