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
    console.log("Your choices are: 'concert-this (artist)', 'spotify-this-song (song)', 'movie-this (movie)', 'do-what-it-says'");
    console.log("");
}

function setName() {
  for (var i = 3; i < input.length; i++) {
    if (i > 3 && i < input.length) {
      name = name + "+" + input[i];
    }
    else {
      name += input[i];
    }
  }
}

function concertThis(name) {
  if (name === "") {
    name = "Between The Buried and Me";
  }
  // console.log(name)
  let band = name.split("+").join(" ");
  // console.log(band)
  let search = "https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp"

  axios.get(search).then(function (response) {
    console.log("")
    console.log("Artist: " + band);
    console.log("---------------------")
    for (var i = 0; i < 9; i++) {
      var date = moment(response.data[i].datetime, "YYYY-MM-DDTHH:mm:SS").format("MM/DD/YYYY")
      console.log(response.data[i].venue.city);
      console.log(response.data[i].venue.name)
      console.log(date)
      console.log("---------------------")
    }
  })
    .catch(function (err) {
      if (err.response) {
        console.log("")
        console.log("Could not find shows for " + band)
        console.log("")
      }

    });

}

function spotifyThis(name) {
  if (name === "") {
    name = "Ace of Base The Sign";
  }
  var song = name.split("+").join("");

  spotify.search({
    type: "track",
    query: name,
    limit: 1
  }, function (err, data) {
    if (err) {
      return console.log("Could not find song: " + err);
    }
    console.log("");
    console.log("-----------------------------------");
    console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
    console.log("Song: " + data.tracks.items[0].name);
    console.log("Album: " + data.tracks.items[0].album.name);
    if (data.tracks.items[0].preview_url) {
      console.log("Sample: " + data.tracks.items[0].preview_url);
    } else {
      console.log("Sample:  Sorry no sample available for " + song);
    }
    console.log("-----------------------------------");
    console.log("");
  });

}