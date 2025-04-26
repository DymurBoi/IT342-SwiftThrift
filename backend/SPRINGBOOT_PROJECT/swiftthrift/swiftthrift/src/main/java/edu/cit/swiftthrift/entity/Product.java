package edu.cit.swiftthrift.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "product")
@JsonIgnoreProperties({"wishlistItems", "hibernateLazyInitializer"})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    private String name;
    private String description;
    private Double price;
    private Integer itemCondition; // 0 for new, 1 for used

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    // Constructors
    public Product() {}

    public Product(String name, String description, Double price, List<String> imageUrl, Integer itemCondition) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrls = imageUrl;
        this.itemCondition = itemCondition;
    }


    // Getters and Setters
    public Integer getCondition() {
        return itemCondition;
    }

    public void setCondition(Integer condition) {
        this.itemCondition = condition;
    }

    public Boolean getIsSold() {
        return isSold;
    }

    public void setIsSold(Boolean isSold) {
        this.isSold = isSold;
    }

    private Boolean isSold;

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }


    //Relationships
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = true) // Allow category_id to be null
    @JsonIgnoreProperties({"products"})
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"product"})
    private List<ProductRating> productRatings = new ArrayList<>();

    // Getters and Setters
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<ProductRating> getProductRatings() {
        return productRatings;
    }

    public void setProductRatings(List<ProductRating> productRatings) {
        this.productRatings = productRatings;
    }

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"product"})
    private List<WishlistItem> wishlistItems = new ArrayList<>();

    public List<WishlistItem> getWishlistItems() {
        return wishlistItems;
    }

    public void setWishlistItems(List<WishlistItem> wishlistItems) {
        this.wishlistItems = wishlistItems;
    }


}