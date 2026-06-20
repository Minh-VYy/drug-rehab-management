package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.RehabPatient;
import com.rehab.rehab_center_api.enums.RehabPatientStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RehabPatientRepository extends org.springframework.data.jpa.repository.JpaRepository<RehabPatient, String> {
    long countByStatus(RehabPatientStatus status);

    long countByStatusIn(Collection<RehabPatientStatus> statuses);

    @Query("""
            SELECT p.currentStageDefinition.name, COUNT(p)
            FROM RehabPatient p
            WHERE p.currentStageDefinition IS NOT NULL
            GROUP BY p.currentStageDefinition.name
            ORDER BY MIN(p.currentStageDefinition.sequenceOrder)
            """)
    List<Object[]> countPatientsByCurrentStage();
}
