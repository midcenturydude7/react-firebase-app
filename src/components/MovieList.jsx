/* eslint-disable react/prop-types */
import React from "react";

function MovieList({ movieList }) {
  return (
    <div>
      {movieList.map((movie) => (
        <div key={movie.id}>
          <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
            {movie.title}
          </h1>
          <p>Year released: {movie.releaseDate}</p>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
