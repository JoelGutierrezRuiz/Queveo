//imports
const axios = require("axios")
const express = require("express")
const cheerio = require("cheerio");
const util = require("util");
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
    const programas = {}

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
            channel= channel.replace("Programación","")
            channel = channel.trim().toLowerCase()
            
            programas[channel] = html
            
        })
       
       

    })
    await sleep(2000)
    
    return programas
    
   
    
}
const buscar = "be mad"
async function BuscarCanal (busquedaHtml){
    try{
        const $ = cheerio.load(busquedaHtml)
        const programas = []
    
    $(".channel-programs-title a",busquedaHtml).each(function(){
        const title = "https://www.tvguia.es"+$(this).attr("href")
        programas.push(title)

    })

    return programas

    }catch{console.log("Este canal no existe")}

    
}

async function BuscarProgramas (programasList){
    const programas = []
    programasList.map(async programa=>{

        const response =await axios(programa,{ 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })

        const html = response.data
        $ = cheerio.load(html)

        $(".program-wrapper",html).each(function(){
            const titulo = $(this).find(".program-title").text()
            const categoria = $(this).find(".tvprogram").text()
            const hora = $(this).find(".program-hour").text()
            
            titulo.trim()?programas.push({[titulo]:[categoria,hora]}):null


        })
    })
    await sleep(500)
    return programas
}

SacarProgramas().then(response=>{BuscarCanal(response[buscar]).then(response =>{BuscarProgramas(response).then(response=>{console.log(response)})})})
//Una vez guarda la lista de de canales vamos a buscar su programación 



App.listen(8000, ()=>{console.log("Listening to port 8000")})