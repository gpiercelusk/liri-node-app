require("dotenv").config();

const fs = require("fs");

const keys = require("./keys.js");

const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

const axios = require("axios");

const moment = require("moment");

const inquirer = require("inquirer");

let songSearch = "";

let movieSearch = "";

let bandSearch = "";

let newLine = "\n ---------------------------------------\n";

let input = "";

function selection() {
  inquirer
    .prompt([
      {
        type: "list",
        message:
          "Please select one of the following options: ",
        choices: [
          "spotify-this-song",
          "concert-this",
          "movie-this",
          "do-what-it-says"
        ],
        name: "liri"
      }
    ])
    .then(function (answers) {
      if (answers.liri === "do-what-it-says") {
        doThis();
        return;
      } else {
        liri = answers.liri;
        inquirer
          .prompt([
            {
              message: "What would you like to search for?",
              name: "input"
            }
          ])
          .then(function (response) {
            input = response.input;
            liriSelect(liri);
          });
      }
    });
}
function liriSelect(liri) {
  checkInput();

  switch (liri) {
    case "spotify-this-song":
      spotifyAPI();
      break;
    case "concert-this":
      bandsInTownAPI();
      break;
    case "movie-this":
      omdbAPI();
      break;
  }
}

function checkInput() {
  if (input) {
    songSearch = input;
    movieSearch = input;
    bandSearch = input;
  } else {
    songSearch = "The Sign Ace of Base";
    movieSearch = "Mr. Nobody";
    bandSearch = "Between the Buried and Me";
  }
}

function timestamp() {
  let time = moment()
    .local()
    .format("MM/DD/YYYY HH:mm");
  let timeStamp = String(
    "\n Search Time: " +
    time +
    "\nCommand: " +
    liri +
    "\nSearch Parameter: " +
    input
  );

  fs.appendFileSync("./log.txt", timeStamp, function (err) {
    if (err) throw err;
  });
}

function logEntry(entry) {

  fs.appendFileSync("./log.txt", newLine, function (err) {
    if (err) throw err;
  });
  fs.appendFileSync("./log.txt", entry, function (err) {
    if (err) throw err;
  });
  fs.appendFileSync("./log.txt", newLine, function (err) {
    if (err) throw err;
  });
  console.log("Your data was written to file!");
  console.log(newLine + entry + newLine);

}

function bandsInTownAPI() {
  timestamp();

  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
      bandSearch +
      "/events?app_id=codingbootcamp"
    )
    .then(function (response) {
      response.data.forEach(function (result) {
        var concert = result.venue;
        var date = moment(result.datetime).format("MM/DD/YYYY");

        var concertEntry = [
          "Venue: " + concert.name,
          "Location: " +
          concert.city +
          " " +
          concert.region +
          " " +
          concert.region +
          " " +
          concert.country,
          "Date: " + date
        ].join("\n");

        logEntry(concertEntry);
      });
    });
}

function spotifyAPI() {
  timestamp();

  spotify
    .search({
      type: "track",
      query: songSearch,
      limit: 1
    })
    .then(function (response, err) {
      if (err) console.log(err);
      var songArr = response.tracks.items[0];

      var songEntry = [
        "Artist: " + songArr.artists[0].name,
        "Song Name: " + songArr.name,
        "Preview: " + songArr.preview_url,
        "Album: " + songArr.album.name
      ].join("\n");

      logEntry(songEntry);
    });
}

function omdbAPI() {
  axios
    .get(
      "http://www.omdbapi.com/?t=" +
      movieSearch +
      "&y=&plot=short&apikey=trilogy"
    )
    .then(function (response) {
      var movie = response.data;

      var movieEntry = [
        "Title: " + movie.Title,
        "Year: " + movie.Year,
        movie.Ratings[0].Value + "(IMDB)",
        movie.Ratings[1].Value + " (Rotten Tomatoes)",
        "Filmed in: " + movie.Country,
        "Summary: " + movie.Plot,
        "Starring: " + movie.Actors
      ].join("\n");

      timestamp();
      logEntry(movieEntry);
    });
}

function doThis() {
  var randomArr = [];
  fs.readFile("./random.txt", "utf8", function (err, data) {
    if (err) {
      throw err;
    } else {
      randomArr = data.split(",");
      input = randomArr[1];
      liri = randomArr[0];
      liriSelect(liri);
    }
  });
}

selection();