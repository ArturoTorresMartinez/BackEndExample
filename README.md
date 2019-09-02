# Back-end task of Code Challenge for Scoutbase

This task is for demonstrating your understanding of HTTP, GraphQL, Node.js and general API practices.

Instructions:

1. Implement a Node.js-based server with raw `http`, Koa or **Express**.
2. Add a `/graphql` endpoint serving the apollo-server or any other GraphQL implementation.
3. Schema must be able to return proper response for the following public query:

**NOTE:** You may notice I moved "directors" outside of "actors", this was intentional as I believe they belong to Movies and not to Actors
```graphql
{
  movies {
    title
    year
    rating
    actors {
      name
      birthday
      country
    }
    directors {
        name
        birthday
        country
      }
  }
}
```

4. Add support for the following mutation:
```graphql
mutation {
  createUser(userInput: {username: "Username", password: "password"}) {
    _id
    username
    password
    token
    createdAt
    updatedAt
  }
}
```

5. To expand on the number four, add a mutation-based authentication that accepts:
```graphql
mutation {
  login(userInput: {username: "Username", password: "password"}) {
    _id
    username
    password
    token
    createdAt
    updatedAt
  }
}
```

6. Authenticated users may request additional fields for the query used earlier. New `scoutbase_rating` field must return the a random string between 5.0-9.0:

**NOTE:** "scoutbase_rating" is always available but will only return the rating if a user (any) has logged-in in the last 3 minutes, else it returns null
```graphql
{
  movies {
    movies {
      _id
      scoutbase_rating
      title
      year
      rating
      actors{ _id name birthday country createdAt updatedAt}
      directors{ _id name birthday country createdAt updatedAt}
      createdAt
      updatedAt
    }
  }
}
```

7. `/graphql` must be accessible for external clients.

8. End.
