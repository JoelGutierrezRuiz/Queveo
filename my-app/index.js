//imports
const axios = require("axios")
const express = require("express")
const cheerio = require("cheerio")
//imports
const url = "https://www.tvguia.es/tv/programacion-la-1"

const App = express();

const canales = {}

axios(url,{ 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
}).then(response =>{
    const html = response.data
    const $ = cheerio.load(html)
    $(".block-channel-programs-div-title", html).each(function(){
        const canal = $(this).text()
        const canalUrl=$(this).find("a").attr("href")
        console.log(canal)
        canales[canal] = url+canalUrl
        
    })
    console.log(canales)
}).then(()=>{
    
})


App.listen(8000, ()=>{console.log("Listening to port 8000")})