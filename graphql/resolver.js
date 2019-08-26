const Movie = require("../model/movie");
const Actor = require("../model/actor");
const Director = require("../model/director");
const User = require("../model/user");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async function({ userInput }, req) {
    const user = await User.findOne({ username: userInput.username });
    if (!user) {
      const error = new Error("Invalid username or password");
      error.code = 401;
      throw error;
    }
    const auth = await bcrypt.compare(userInput.password, user.password);
    if (!auth) {
      const error = new Error("Invalid username or password");
      error.code = 401;
      throw error;
    }
    user.token = jwt.sign(
      {
        password: user.password
      },
      "C0mPl3x1tY",
      { expiresIn: 180 }
    );
    const loggedInUser = await user.save();
    return {
      ...loggedInUser._doc,
      id: loggedInUser._id.toString(),
      createdAt: loggedInUser.createdAt.toISOString(),
      updatedAt: loggedInUser.updatedAt.toISOString()
    };
    //Needs to create a token and save the user.
  },
  movies: async function(req) {
    let verified;
    const totalMovies = await Movie.find().countDocuments();
    const movies = await Movie.find()
      .sort({ createdAt: -1 })
      .populate("actors")
      .populate("directors");

    const user = await User.findOne().sort({ updatedAt: -1 });
    if (user.token !== "") {
      try {
        verified = jwt.verify(user.token, "C0mPl3x1tY");
      } catch (err) {
        return {
          movies: movies.map(m => {
            return {
              ...m._doc,
              _id: m._id.toString(),
              createdAt: m.createdAt.toISOString(),
              updatedAt: m.updatedAt.toISOString()
            };
          }),
          totalMovies: totalMovies
        };
      }
      if (verified) {
        return {
          movies: movies.map(m => {
            const random = Math.floor(Math.random() * (10 - 5)) + 5;
            return {
              ...m._doc,
              scoutbase_rating: random,
              _id: m._id.toString(),
              createdAt: m.createdAt.toISOString(),
              updatedAt: m.updatedAt.toISOString()
            };
          }),
          totalMovies: totalMovies
        };
      }
    }

    return {
      movies: movies.map(m => {
        return {
          ...m._doc,
          _id: m._id.toString(),
          createdAt: m.createdAt.toISOString(),
          updatedAt: m.updatedAt.toISOString()
        };
      }),
      totalMovies: totalMovies
    };
  },
  actors: async function(req) {
    const totalActors = await Actor.find().countDocuments();
    const actors = await Actor.find().sort({ createdAt: -1 });
    return {
      actors: actors.map(a => {
        return {
          ...a._doc,
          _id: a._id.toString(),
          createdAt: a.createdAt.toISOString(),
          updatedAt: a.updatedAt.toISOString()
        };
      }),
      totalActors: totalActors
    };
  },
  directors: async function(req) {
    const totalDirectors = await Director.find().countDocuments();
    const directors = await Director.find().sort({ createdAt: -1 });
    return {
      directors: directors.map(d => {
        return {
          ...d._doc,
          _id: d._id.toString(),
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString()
        };
      }),
      totalDirectors: totalDirectors
    };
  },
  createMovie: async function({ movieInput }, req) {
    if (!moment(movieInput.year, "DD/MM/YYYY", true).isValid()) {
      const error = new Error(
        "Invalid date format, please use DD/MM/YYYY with quotes"
      );
      error.code = 409;
      throw error;
    }
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
  },
  createActor: async function({ actorInput }, req) {
    if (!moment(actorInput.birthday, "DD/MM/YYYY", true).isValid()) {
      const error = new Error(
        "Invalid date format, please use DD/MM/YYYY with quotes"
      );
      error.code = 409;
      throw error;
    }
    const actor = new Actor({
      name: actorInput.name,
      birthday: actorInput.birthday,
      country: actorInput.country
    });

    const createdActor = await actor.save();
    return {
      ...createdActor._doc,
      id: createdActor._id.toString(),
      createdAt: createdActor.createdAt.toISOString(),
      updatedAt: createdActor.updatedAt.toISOString()
    };
  },
  createDirector: async function({ directorInput }, req) {
    if (!moment(directorInput.birthday, "DD/MM/YYYY", true).isValid()) {
      const error = new Error(
        "Invalid date format, please use DD/MM/YYYY with quotes"
      );
      error.code = 409;
      throw error;
    }
    const director = new Director({
      name: directorInput.name,
      birthday: directorInput.birthday,
      country: directorInput.country
    });

    const createdDirector = await director.save();
    return {
      ...createdDirector._doc,
      id: createdDirector._id.toString(),
      createdAt: createdDirector.createdAt.toISOString(),
      updatedAt: createdDirector.updatedAt.toISOString()
    };
  },
  createUser: async function({ userInput }, req) {
    const pass = await bcrypt.hash(userInput.password, 12);

    const user = new User({
      username: userInput.username,
      password: pass,
      token: ""
    });

    const createdUser = await user.save();
    return {
      ...createdUser._doc,
      id: createdUser._id.toString(),
      createdAt: createdUser.createdAt.toISOString(),
      updatedAt: createdUser.updatedAt.toISOString()
    };
  },
  addActorToMovie: async function({ addInput }, req) {
    const movie = await Movie.findById(addInput.movie).populate("actors");
    movie.actors.forEach(actor => {
      if (actor._id.toString() === addInput.actor) {
        const error = new Error("Actor is already part of the movie");
        error.code = 409;
        error.data = movie.actors;
        throw error;
      }
    });
    const actor = await Actor.findById(addInput.actor);
    movie.actors.push(actor);
    const savedMovie = await movie.save();
    console.log(savedMovie);
    return {
      ...savedMovie._doc,
      id: savedMovie._id.toString(),
      createdAt: savedMovie.createdAt.toISOString(),
      updatedAt: savedMovie.updatedAt.toISOString()
    };
  },
  addDirectorToMovie: async function({ addInput }, req) {
    const movie = await Movie.findById(addInput.movie).populate("directors");
    movie.directors.forEach(director => {
      if (director._id.toString() === addInput.director) {
        const error = new Error("Director is already part of the movie");
        error.code = 409;
        error.data = movie.directors;
        throw error;
      }
    });
    const director = await Director.findById(addInput.director);
    movie.directors.push(director);
    const savedMovie = await movie.save();
    console.log(savedMovie);
    return {
      ...savedMovie._doc,
      id: savedMovie._id.toString(),
      createdAt: savedMovie.createdAt.toISOString(),
      updatedAt: savedMovie.updatedAt.toISOString()
    };
  }
};
