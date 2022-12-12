//imports
const axios = require("axios")
const express = require("express")
const cheerio = require("cheerio");
const { response } = require("express");
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
    const programs= []
    
    for(let i=0; i<canales.length;i++){
        const response =await  axios(canales[i],{ 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })


        const html = response.data
        const $ = cheerio.load(html)
        $(".channel-programs-title a",html).each(function(){
            const programa = $(this).attr("href")
            programs.push(programa)
        })
    }

    return programs


    
    
}
SacarProgramas().then((response)=>{console.log(response)})

//Una vez guarda la lista de de canales vamos a buscar su programación 





App.listen(8000, ()=>{console.log("Listening to port 8000")})