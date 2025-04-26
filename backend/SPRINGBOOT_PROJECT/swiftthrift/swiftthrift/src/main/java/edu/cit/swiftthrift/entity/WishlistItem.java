package edu.cit.swiftthrift.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "wishlist_item")
public class WishlistItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer wishlistid;

    // Getters and Setters
    public Integer getWishlistid() {
        return wishlistid;
    }

    public void setWishlistid(Integer wishlistid) {
        this.wishlistid = wishlistid;
    }

    //Relationships
    @ManyToOne
    @JoinColumn(name = "wishlist_id", nullable = false)
    @JsonIgnoreProperties({"wishlistItems", "user"})
    private Wishlist wishlist;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"wishlistItems", "productRatings"})
    private Product product;

    // Getters and Setters
    public Wishlist getWishlist() {
        return wishlist;
    }

    public void setWishlist(Wishlist wishlist) {
        this.wishlist = wishlist;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
