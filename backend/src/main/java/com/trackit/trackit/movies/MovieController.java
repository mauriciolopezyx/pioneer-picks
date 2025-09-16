package com.trackit.trackit.movies;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequestMapping("/movie")
@RestController
public class MovieController {

    private final MovieRepository movieRepository;

    public MovieController(
            MovieRepository movieRepository
    ) {
        this.movieRepository = movieRepository;
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingMovies() {
        List<Movie> topMovies = movieRepository.findTop5ByOrderByCountDesc();
        while (topMovies.size() < 5) {
            topMovies.add(new Movie());
        }
        return ResponseEntity.ok(Map.of("movies", topMovies));
    }

    @PostMapping("/")
    public ResponseEntity<?> postSearchResult(@RequestBody MovieDto movieDto) {
        System.out.println("Received search request");
        Movie movie = movieRepository.findByMovieId(movieDto.movie_id())
                .orElseGet(() -> new Movie(
                        movieDto.movie_id(),
                        movieDto.poster_url(),
                        movieDto.title(),
                        0 // start count at 0
                ));
        movie.setCount(movie.getCount() + 1);
        Movie saved = movieRepository.save(movie);
        return ResponseEntity.ok(saved);
    }

}
