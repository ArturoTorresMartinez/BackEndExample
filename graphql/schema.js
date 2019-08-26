const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type User {
    _id: ID!
    username: String!
    password: String!
    token: String
    createdAt: String!
    updatedAt: String!
}


type Actor {
    _id: ID!
    name: String!
    birthday: String!
    country: String!
    createdAt: String!
    updatedAt: String!
}

type Director {
    _id: ID!
    name: String!
    birthday: String!
    country: String!
    createdAt: String!
    updatedAt: String!
}


type Movie {
    _id: ID!
    scoutbase_rating: Int
    title: String!
    year: String!
    rating: Int!
    actors: [Actor]
    directors: [Director]
    createdAt: String!
    updatedAt: String!
}

type MovieData {
    movies: [Movie]
    totalMovies: Int!
}

type ActorData {
    actors: [Actor]
    totalActors: Int!
}

type DirectorData {
    directors: [Director]
    totalDirectors: Int!
}

input UserInputData {
    username: String!
    password: String!
}


input MovieInputData {
    title: String!
    year: String!
    rating: Int!
}

input ActorInputData {
    name: String!
    birthday: String!
    country: String!
}

input DirectorInputData {
    name: String!
    birthday: String!
    country: String!
}


input ActorMovieInputData {
    movie: ID!
    actor: ID!
}
input DirectorMovieInputData {
    movie: ID!
    director: ID!
}


type RootQuery {
    movies: MovieData
    actors: ActorData
    directors: DirectorData

}

type RootMutation {
    login(userInput: UserInputData): User!
    createUser(userInput: UserInputData): User!
    createMovie(movieInput: MovieInputData): Movie!
    createActor(actorInput: ActorInputData): Actor!
    createDirector(directorInput: DirectorInputData): Director!
    addActorToMovie(addInput: ActorMovieInputData): Movie!
    addDirectorToMovie(addInput: DirectorMovieInputData): Movie!
}

schema {
    query: RootQuery
    mutation: RootMutation
}


`);
