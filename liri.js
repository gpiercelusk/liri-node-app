require("dotenv").config();

const fs = require("fs");

const keys = require("./keys.js");

const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

const axios = require("axios");

const moment = require("moment");

let input = process.argv;
let command = process.argv[2];

let name = "";

switch (command) {
  case "concert-this":
    setName();
    concertThis(name);
    break;

  case "spotify-this-song":
    setName();
    spotifyThis(name);
    break;

  case "movie-this":
    setName();
    movieThis(name);
    break;

  case "do-what-it-says":
    doThis();
    break;

  default:
    console.log("");
    console.log("Your choices are: 'concert-this, 'spotify-this-song', 'movie-this', 'do-what-it-says'");
    console.log("");



}