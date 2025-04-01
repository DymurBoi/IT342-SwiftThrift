package edu.cit.swiftthrift.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name = "wishlist")
@Entity
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Date addedAt;
 
    // Getters and Setter

    public int getId() {
        return id;
    }
    public Date getAddedAt() {
        return addedAt;
    }
    public void setAddedAt(Date addedAt) {
        this.addedAt = addedAt;
    }
}
