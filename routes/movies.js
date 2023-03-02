const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieBody, validateDeleteBody } = require('../middlewares/validations');

router.get('/', getMovies);

router.post('/', validateMovieBody, createMovie);

router.delete('/:movieId', validateDeleteBody, deleteMovie);

module.exports = router;
