package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.VoluntaryAdmissionApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoluntaryAdmissionApplicationRepository extends JpaRepository<VoluntaryAdmissionApplication, Integer> {
    List<VoluntaryAdmissionApplication> findByRelativeIdOrderBySubmittedAtDesc(Integer relativeId);
}
