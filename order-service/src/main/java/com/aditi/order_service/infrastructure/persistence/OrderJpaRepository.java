package com.aditi.order_service.infrastructure.persistence;

import com.aditi.order_service.infrastructure.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderJpaRepository extends JpaRepository<OrderEntity, Long> {
}