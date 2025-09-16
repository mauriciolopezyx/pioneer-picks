package com.trackit.trackit.movies;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findTop5ByOrderByCountDesc();
    Optional<Movie> findByMovieId(long movieId);
}
