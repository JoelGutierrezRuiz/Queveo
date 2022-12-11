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
    
            $(".channel-row",  html).each(function(){
                const titulo = $(this).find(".channel-programs-title a b").text()
                const hora = $(this).find(".channel-programs-time a").text()
                const category = $(this).find(".channel-programs-title span").text()
                const sipnosis = $(this).find(".channel-programs-field_program_description_value a").text()
                
                allChannels.push({[titulo]:[hora,category,sipnosis]})
                
            })
            
    
            
            
    
        }).then(()=>{console.log(allChannels)})
        
    }

    )
})


App.listen(8000, ()=>{console.log("Listening to port 8000")})