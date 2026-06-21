package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, String> {
    List<SupportRequest> findByRelativeIdOrderBySubmittedAtDesc(Integer relativeId);
    List<SupportRequest> findAllByOrderBySubmittedAtDesc();
}
