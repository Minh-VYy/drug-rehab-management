package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.TreatmentStageDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreatmentStageDefinitionRepository extends JpaRepository<TreatmentStageDefinition, String> {

    List<TreatmentStageDefinition> findAllByOrderBySequenceOrderAsc();

    Optional<TreatmentStageDefinition> findBySequenceOrder(Integer sequenceOrder);
}
