package edu.cit.swiftthrift.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlist_item")
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer wishlistid;

    @ManyToOne
    @JoinColumn(name = "wishlist_id", nullable = false)
    private Wishlist wishlist;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public WishlistItem() {
    }

    // ✅ All-args constructor
    public WishlistItem(Integer wishlistid, Wishlist wishlist, Product product) {
        this.wishlistid = wishlistid;
        this.wishlist = wishlist;
        this.product = product;
    }
    // Getters and Setters
    public Integer getwishlistid() {
        return wishlistid;
    }

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
