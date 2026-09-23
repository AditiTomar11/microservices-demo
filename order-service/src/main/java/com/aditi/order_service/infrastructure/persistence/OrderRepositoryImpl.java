package com.aditi.order_service.infrastructure.persistence;

import com.aditi.order_service.domain.model.Order;
import com.aditi.order_service.domain.repository.OrderRepository;
import com.aditi.order_service.infrastructure.entity.OrderEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class OrderRepositoryImpl implements OrderRepository {

    private final OrderJpaRepository jpaRepository;

    @Autowired
    public OrderRepositoryImpl(OrderJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Order save(Order order) {
        OrderEntity entity = new OrderEntity(order.getId(), order.getProductId(), order.getQuantity(), order.getUsername());
        OrderEntity saved = jpaRepository.save(entity);
        return new Order(saved.getId(), saved.getProductId(), saved.getQuantity(), saved.getUsername());
    }

    @Override
    public Optional<Order> findById(Long id) {
        return jpaRepository.findById(id)
                .map(e -> new Order(e.getId(), e.getProductId(), e.getQuantity(), e.getUsername()));
    }

    @Override
    public List<Order> findAll() {
        return jpaRepository.findAll().stream()
                .map(e -> new Order(e.getId(), e.getProductId(), e.getQuantity(), e.getUsername()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public Order update(Long id, Order order) {
        OrderEntity entity = jpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id " + id));
        entity.setProductId(order.getProductId());
        entity.setQuantity(order.getQuantity());
        entity.setUsername(order.getUsername());
        OrderEntity updated = jpaRepository.save(entity);
        return new Order(updated.getId(), updated.getProductId(), updated.getQuantity(), updated.getUsername());
    }
}