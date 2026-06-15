package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.RehabPatient;
import org.springframework.stereotype.Repository;

@Repository
public interface RehabPatientRepository extends org.springframework.data.jpa.repository.JpaRepository<RehabPatient, String> {
}
