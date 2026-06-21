package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.VisitRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRequestRepository extends JpaRepository<VisitRequest, Integer> {
    List<VisitRequest> findByRelativeIdOrderByCreatedAtDesc(Integer relativeId);
}
