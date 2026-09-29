package com.abhi.parkspace.auth;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DebugEntityCheck {

    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    public void check() {
        System.out.println("Entities: " + entityManager.getMetamodel().getEntities());
    }
}