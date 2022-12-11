//imports
const axios = require("axios")
const express = require("express")
const cheerio = require("cheerio")
//imports
const url = "https://www.tvguia.es/tv/programacion-la-1"

const App = express();

axios(url,{ 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
}).then(response =>{
    const html = response.data
    const $ = cheerio.load(html)
    const canales = []
    $(".block-channel-programs-div-title a", html).each(function(){
        const canal=$(this).text()
        canales.push(canal)
    })
    console.log(canales)
})


App.listen(8000, ()=>{console.log("Listening to port 8000")})