package com.aditi.order_service.application.service;

import com.aditi.order_service.domain.model.Order;
import com.aditi.order_service.domain.model.Product;
import com.aditi.order_service.domain.repository.OrderRepository;
import com.aditi.order_service.infrastructure.client.ProductClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;

    @Autowired
    public OrderService(OrderRepository orderRepository, ProductClient productClient) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
    }

    public Order createOrder(Order order) {
        Product product = productClient.getProductById(order.getProductId());
        System.out.println("Ordering product: " + product.getName());
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order updateOrder(Long id, Order order) {
        return orderRepository.update(id, order);
    }
}