//imports
const axios = require("axios")
const express = require("express")
const cheerio = require("cheerio");
const { response } = require("express");
const util = require("util")
const sleep = util.promisify(setTimeout)
//imports
const App = express();

const url = "https://www.tvguia.es/tv/programacion-la-1"//url de incio



async function  SacarCanales()
{
    const canales = []
    await axios(url,{ 
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
            const canalUrl="https://www.tvguia.es"+$(this).find("a").attr("href")
            canales.push(canalUrl)
        })
    })
    return canales
}



async function SacarProgramas(){

    const canales = await SacarCanales()
    const programas ={}

    canales.map(async canal=>{
        const response =await  axios(canal,{ 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })


        const html = response.data
        const $ = cheerio.load(html)
        let channel = null
        let programs = [] 
        $("#main",html).each(function(){
            channel= $(this).find("h1").text()
            
        })
        $(".channel-programs-title a",html).each(async function(){
            const programa = "https://www.tvguia.es"+$(this).attr("href")

            const response= await axios(programa,{ 
                headers: { "Accept-Encoding": "gzip,deflate,compress" } 
            })

            const html = response.data
            const hola = cheerio.load(html)
            hola(".program-title",html).each(function(){
                const title = hola(this).text()
                programs.push(title)
            })


            
            
        })
       programas[channel]= programs
       

    })
    await sleep(10000)
    return programas
    
   
    
}



SacarProgramas().then(response=>{console.log(response[" Programación La 1"])})
//Una vez guarda la lista de de canales vamos a buscar su programación 





App.listen(8000, ()=>{console.log("Listening to port 8000")})