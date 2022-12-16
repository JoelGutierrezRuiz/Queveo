import './Css/App.css'
import React from 'react'
import Canales from './Components/Canales'
import BestRank from './Components/BestRank'

import axios from "axios"
import cheerio from "cheerio";

function App() {
  //imdb


const nombre = "el viaje de chi"

 const BuscarImdb= async(film)=>{

    let resultado = null
    const filtro = []

    axios(`https://www.imdb.com/find?q=${film}&ref_=nv_sr_sm`)
    .then(response=>{
        const html = response.data
        const $ = cheerio.load(html)

        $(".ipc-metadata-list-summary-item__t",html).each(function(){
            let peliculaUrl = $(this).text().trim()
            filtro.push(peliculaUrl="https://www.imdb.com/"+$(this).attr("href"))
            resultado = filtro

                
           
            
        })
        return resultado
    }).then(response=>{
        axios(response[0],{ 
            headers: { "Accept-Encoding": "gzip,deflate,compress","Accept": "application/json","Authorization": "Bearer","Origin":" http://localhost:4200",
            "Referer": "http://localhost:4200/matches",
            "User-Agent":" Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36" } 
        }).then(response=>{
            html = response.data
            pepe= cheerio.load(html)
            pepe(".sc-7ab21ed2-1",html).each(function(){
                const puntuacion = pepe(this).text()
                console.log(puntuacion)
            })
            

        })
    })

    
    

}

BuscarImdb(nombre)

  return (
    <div className="App">

      <section className='main__header'>
            <div className='header-container'>
                <ul className='header-list-container'>
                    <li>Queveo</li>
                    <li>Buscar</li>
                </ul>
            </div>
      </section>
      <BestRank></BestRank>
      <Canales></Canales>

    </div>
  )
}

export default App
