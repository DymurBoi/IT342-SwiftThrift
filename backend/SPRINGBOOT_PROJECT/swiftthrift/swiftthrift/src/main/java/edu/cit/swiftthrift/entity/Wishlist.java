package edu.cit.swiftthrift.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_id") // Updated to match database column name
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "added_at")
    private Date addedAt;

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(Date addedAt) {
        this.addedAt = addedAt;
    }

    // Add this for backward compatibility if your frontend uses wishlistId
    public Integer getWishlistId() {
        return id;
    }

    public void setWishlistId(Integer id) {
        this.id = id;
    }
}
