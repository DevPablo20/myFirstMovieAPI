var express = require('express');
var router = express.Router();

const request = require('request');
const { route } = require('../app');
const app = require('../app');
const apiKey = '1fb720b97cc13e580c2c35e1138f90f8'
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300'

//Creating a middleware (adding to res. locals) to use it.
router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next()
})

/* GET home page. */
router.get('/', function(req, res, next) {
  //request takes 2 args: the url to http "get", the callback to run when done
  //The callback has 3 args: Error(if any), http response, json/data the server sent back
  request.get(nowPlayingUrl, (error, response, movieData) => {
  //All http message will be string type. We need to parse
  const parsedData = JSON.parse(movieData);
  //res.json(parsedData)
  res.render('index', {
    parsedData: parsedData.results
  })
  })
});

//Creating a id wildcard(:id) in get(/movie/:id) to be used in req.params
router.get('/movie/:id', (req, res, next) => {
  //res.json(req.params.id);
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  //res.send(thisMovieUrl);
  request.get(thisMovieUrl, (error, response,singleMovieData) => {
    const parsedData = JSON.parse(singleMovieData);
    // res.send(parsedData)
    res.render('single-movie', {
      parsedData
    }
    )
    })
  })

router.post('/search/', (req, res, next) => {
  // res.send('Sanity check');
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = encodeURI(req.body.cat);
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`
  // res.send(movieUrl);
  request.get(movieUrl, (error, response, movieData) => {
    let parsedData = JSON.parse(movieData);
    // res.json(parsedData);
    if(cat=='person'){
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render('index', {
      parsedData: parsedData.results
    })
  })
})

module.exports = router;
