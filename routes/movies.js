const movieRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { celebrateCreateMovie, celebrateCheckMovieId } = require('../middlewares/celebrate');

const auth = require('../middlewares/auth');

movieRouter.get('/movies', auth, getMovies);
movieRouter.post('/movies', auth, celebrateCreateMovie, createMovie);
movieRouter.delete('/movies/:movieId', auth, celebrateCheckMovieId, deleteMovie);

module.exports = movieRouter;
