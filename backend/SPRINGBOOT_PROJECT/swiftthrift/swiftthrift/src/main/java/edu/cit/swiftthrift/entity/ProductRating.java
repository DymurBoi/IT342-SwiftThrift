package edu.cit.swiftthrift.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_rating")
public class ProductRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productRatingId;
    private String name;
    private String comment;
    private int rating;
    private Date date;

    public ProductRating(int productRatingId, String name, int rating, Date date, String comment) {
        this.productRatingId = productRatingId;
        this.name = name;
        this.rating = rating;
        this.date = date;
    }

    public int getProductRatingId() {
        return productRatingId;
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
    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
