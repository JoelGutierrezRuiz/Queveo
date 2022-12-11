//imports
import { Axios } from "axios";
import express from "express";

const App = express();
Axios()


App.listen(8000, ()=>{console.log("Listening to port 8000")})