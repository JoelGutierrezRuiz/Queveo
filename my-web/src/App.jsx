import './Css/App.css'
import React from 'react'
import Canales from './Components/Canales'
import BestRank from './Components/BestRank'

import axios from "axios"
import cheerio from "cheerio";
function App() {


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
