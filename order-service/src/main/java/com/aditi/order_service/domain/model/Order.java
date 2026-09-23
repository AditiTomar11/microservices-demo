package com.aditi.order_service.domain.model;

public class Order {
    private Long id;
    private Long productId;
    private Integer quantity;
    private String username;

    public Order() {}

    public Order(Long id, Long productId, Integer quantity, String username) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.username = username;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}