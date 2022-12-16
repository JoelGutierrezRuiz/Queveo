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

    axios(`https://www.imdb.com/find?q=${film}&ref_=nv_sr_sm`,{ 
        headers: { "Access-Control-Allow-Origin":"https://queveo-buiselip0-joelgutierrezruiz.vercel.app/"} 
    })
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
            headers: {"Access-Control-Allow-Origin":"https://queveo-buiselip0-joelgutierrezruiz.vercel.app/" } 
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
