//imports
const axios = require("axios")
const express = require("express")
const cheerio = require("cheerio")
//imports
const url = "https://www.tvguia.es/tv/programacion-la-1"

const App = express();

//const canales = {}
const canales  =[]
const allChannels = []
axios(url,{ 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
}).then(response =>{
    const html = response.data
    const $ = cheerio.load(html)
    $(".block-channel-programs-div-title", html).each(function(){
        const canal = $(this).text()
        const canalUrl=$(this).find("a").attr("href")
        //canales[canal] = url+canalUrl
        canales.push("https://www.tvguia.es"+canalUrl)
        
        
    })


}).then(()=>{
    titulos = canales.map(canal=>{
        
        axios(canal,{ 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        }).then(response=>{
            const html = response.data
            const $ = cheerio.load(html)
    
            $("h1",  html).each(function(){
                const titulo = $(this).text()
                allChannels.push(titulo)
                
            })
            
    
            console.log(allChannels.length)
    
        })
    }

    )
})


App.listen(8000, ()=>{console.log("Listening to port 8000")})