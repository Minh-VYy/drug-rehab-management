package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.HandoverSlip;
import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface HandoverSlipRepository extends JpaRepository<HandoverSlip, String> {

    @Query("SELECT COUNT(h) FROM HandoverSlip h WHERE h.id LIKE CONCAT(:prefix, '%')")
    long countByIdStartingWith(@Param("prefix") String prefix);

    @EntityGraph(attributePaths = {"subjects", "policeOfficer"})
    Optional<HandoverSlip> findWithSubjectsById(String id);

    @EntityGraph(attributePaths = {"policeOfficer"})
    Page<HandoverSlip> findByPoliceOfficer_Id(String officerId, Pageable pageable);

    @EntityGraph(attributePaths = {"policeOfficer"})
    Page<HandoverSlip> findByPoliceOfficer_IdAndStatus(
            String officerId,
            HandoverSlipStatus status,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"subjects", "policeOfficer"})
    List<HandoverSlip> findByStatusInOrderBySubmittedAtDesc(List<HandoverSlipStatus> statuses);

    long countByStatus(HandoverSlipStatus status);
}
