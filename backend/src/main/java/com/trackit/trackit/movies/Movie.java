package com.trackit.trackit.movies;

import jakarta.persistence.*;

@Entity
@Table(name="movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name="movie_id", unique=true)
    private long movieId;
    @Column(name="poster_url")
    private String poster_url;
    @Column
    private String title;
    @Column
    private long count;

    public Movie() {}

    public Movie(long movie_id, String poster_url, String title, long count) {
        this.movieId = movie_id;
        this.poster_url = poster_url;
        this.title = title;
        this.count = count;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getMovie_id() {
        return movieId;
    }

    public void setMovie_id(long movie_id) {
        this.movieId = movie_id;
    }

    public String getPoster_url() {
        return poster_url;
    }

    public void setPoster_url(String poster_url) {
        this.poster_url = poster_url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
