const { buildSchema } = require('graphql');

module.exports = buildSchema(`

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

input MovieInputData {
    title: String!
    year: String!
    rating: Int!
}


type RootQuery {
    movies: MovieData

}

type RootMutation {
    createMovie(movieInput: MovieInputData): Movie!
}

schema {
    query: RootQuery
    mutation: RootMutation
}


`);