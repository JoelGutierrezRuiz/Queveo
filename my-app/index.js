//imports
const axios = require("axios")
const express = require("express")
const cheerio = require("cheerio")
//imports
const App = express();

const url = "https://www.tvguia.es/tv/programacion-la-1"//url de incio
const canales  =[]
let allChannels = []

//Hacemos primera busqueda de la página en si para sacar el Html
axios(url,{ 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
})

//Con el html sacado buscamos lo siguiente
.then(response =>{

    //guardamos la respuesta del callback anterior (el HTML)
    const html = response.data
    //Usamos cheerio para manipular el Html
    const $ = cheerio.load(html)

    //hacemos busqueda de los canales y sus links para acceder a la programación
    $(".block-channel-programs-div-title", html).each(function(){
        
        //buscamos los enlaces los canales para acceder a su programación
        const canalUrl=$(this).find("a").attr("href")
        //guardamos en la lista la url del canal incluyendo la url principal para se valida
        canales.push("https://www.tvguia.es"+canalUrl)
    })
})
//Una vez guarda la lista de de canales vamos a buscar su programación 
.then(()=>{
    //Hacemos un map de cada canal para sacar por cada canal su programación
    titulos = 
    canales.map(canal=>{
        
        //cada enlace de canal es analizado con axios para sacar el Html
        axios(canal,{ 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })

        //despues de sacar el Html vamos sacar el enlace de cada programa sacado para acceder a toda su info
        .then(response=>{
            
            // guardamos el html
            const html = response.data
            //y lo manipulamos con cheerio
            const $ = cheerio.load(html)
            
            //buscamos con cheerio los programas del canal y por cada programa sacamos el enlace para acceder a toda la info
            $(".channel-programs-title a",  html).each(function(){
                
                //sacamos el enlace del programa para acceder a su info completa
                const titulo = $(this).attr("href")
                //guardamos el enlace del programa con un enlace principal para que sea valido
                allChannels.push("https://www.tvguia.es"+titulo)
                
            })   
    
        })
    })
})




App.listen(8000, ()=>{console.log("Listening to port 8000")})