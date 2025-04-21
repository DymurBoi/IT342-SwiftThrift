package edu.cit.swiftthrift.entity;

import java.time.LocalDate;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "store_rating")
public class StoreRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer storeRatingId;
    
    private String name;
    private int rating; 
    private String comment;
    private LocalDate date;

    public StoreRating() {
    }

    // Optional all-args constructor
    public StoreRating(String name, String comment, Integer rating, LocalDate date, User user) {
        this.name = name;
        this.comment = comment;
        this.rating = rating;
        this.date = date;
        this.user = user;
    }

    public int getStoreRatingId() {
        return storeRatingId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }

    //Relationships
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}


