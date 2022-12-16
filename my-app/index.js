//imports
const axios = require("axios")
const express = require("express")
const cheerio = require("cheerio");
const util = require("util");
const { response } = require("express");
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
    //obtenemos el valor de la funcion sacarCanales (Array para map)
    const canales = await SacarCanales()
    //Esta variable servirá para almacenar temporalmente los resultados
    const programas = {}

    //Aqui mapeamos todas las urls de los canales
    canales.map(async canal=>{

        //Sacamos el html de los canales cons async para evitar las dependencias de variables
        const response =await  axios(canal,{ 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })

        //Guardamos los datos de la respuesta de axios (html)
        const html = response.data
        //Con esto podremos cargar y manipular el html
        const $ = cheerio.load(html)
        //Esta variables es para almacenar temporalmente el nombre del canal
        let channel = null
        //Buscamos el titulo del canal y guardamos su html para poder manipularlo sabiendo que canal es en un futuro 
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
            const sipnosis = $(this).find(".program-element p").text()
            
            titulo.trim()?programas.push({[titulo]:[categoria,hora,sipnosis]}):null


        })
    })
    await sleep(1500)
    return programas
}

SacarCanales()
//Una vez guarda la lista de de canales vamos a buscar su programación 






//imdb


const nombre = "el viaje de chi"

async function BuscarImdb(film){

    let resultado = null
    const filtro = []

    let imdbRate = null

    const filmPAge = await axios(`https://www.imdb.com/find?q=${film}&ref_=nv_sr_sm`,{ 
        headers: { "Accept-Encoding": "gzip,deflate,compress",Host:"www.imdb.com", "User-Agent":"Mozilla/5.0 (Macintosh; Intel)" } 
    })

    const htmlFilm = filmPAge.data
    const $ = cheerio.load(htmlFilm)

    $(".ipc-metadata-list-summary-item__t",htmlFilm).each(function(){
        let peliculaUrl = $(this).text().trim()
        filtro.push(peliculaUrl="https://www.imdb.com/"+$(this).attr("href"))
        resultado = filtro
    })

    sleep(200)

    const ratePage = await axios(resultado[0],{ 
        headers: { "Accept-Encoding": "gzip,deflate,compress",Host:"www.imdb.com", "User-Agent":"Mozilla/5.0 (Macintosh; Intel)" } 
    })
    htmlRate = ratePage.data
    pepe= cheerio.load(htmlRate)

    pepe(".sc-7ab21ed2-1",htmlRate).each(function(){
        const puntuacion = pepe(this).text()
        imdbRate= puntuacion

    })
            
    return imdbRate
    
    
    

}


App.get("/",(req,res)=>{
    BuscarImdb(nombre).then(response=>{res.send(response)})

})

App.listen(3000)

//const puntuacion = $(this).find(".sc-7ab21ed2-1").text()