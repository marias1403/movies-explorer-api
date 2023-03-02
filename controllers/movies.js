const http2 = require('node:http2');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const validationConstants = require('./constants');

const getMovies = (req, res, next) => Movie.find({})
  .populate('owner')
  .then((movies) => res.send({ data: movies }))
  .catch(next);

const createMovie = (req, res, next) => Movie.create({
  country: req.body.country,
  director: req.body.director,
  duration: req.body.duration,
  year: req.body.year,
  description: req.body.description,
  image: req.body.image,
  trailer: req.body.trailer,
  nameRU: req.body.nameRU,
  nameEN: req.body.nameEN,
  thumbnail: req.body.thumbnail,
  owner: req.user._id,
  movieId: req.body.movieId,
})
  .then((movie) => res.status(http2.constants.HTTP_STATUS_CREATED).send({ data: movie }))
  .catch((err) => {
    console.log(err);
    if (err.name === 'ValidationError') {
      next(new BadRequestError(validationConstants.CREATE_MOVIE_VALIDATION_ERROR));
    } else {
      next(err);
    }
  });

const deleteMovie = (req, res, next) => Movie.findById(req.params.movieId)
  .then((movie) => {
    if (movie === null) {
      throw new NotFoundError(validationConstants.MOVIE_NOT_FOUND_ERROR);
    }

    if (movie.owner._id.toString() === req.user._id) {
      return Movie.findByIdAndRemove(req.params.movieId);
    }

    throw new ForbiddenError(validationConstants.DELETE_MOVIE_FORBIDDEN_ERROR);
  })
  .then((movie) => res.status(http2.constants.HTTP_STATUS_OK).send({ data: movie }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError(validationConstants.DELETE_MOVIE_VALIDATION_ERROR));
    } else {
      next(err);
    }
  });

module.exports = {
  getMovies, createMovie, deleteMovie,
};
