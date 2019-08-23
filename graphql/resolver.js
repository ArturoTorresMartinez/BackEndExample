const Movie = require('../model/movie');
const Actor = require('../model/actor');
const Director = require('../model/director');
const User = require('../model/user');

module.exports = {
    movies: async function (req) {
        const totalMovies = await Movie.find().countDocuments();
        const movies = await Movie.find().sort({ createdAt: -1 });
        return {
            movies: movies.map(m => {
                return {
                    ...m._doc,
                    _id: m._id.toString(),
                    year: m.year.toISOString(),
                    createdAt: m.createdAt.toISOString(),
                    updatedAt: m.updatedAt.toISOString()
                };
            }),
            totalMovies: totalMovies
        }
    },
    createMovie: async function ({ movieInput }, req) {
        const movie = new Movie({
            title: movieInput.title,
            year: movieInput.year,
            rating: movieInput.rating
        });
        const createdMovie = await movie.save();
        return {
            ...createdMovie._doc,
            id: createdMovie._id.toString(),
            createdAt: createdMovie.createdAt.toISOString(),
            updatedAt: createdMovie.updatedAt.toISOString()
        };
    }
};