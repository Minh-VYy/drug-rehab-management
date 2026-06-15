package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.PoliceRecordOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PoliceRecordOfficerRepository extends JpaRepository<PoliceRecordOfficer, String> {

    Optional<PoliceRecordOfficer> findByUser_Id(Integer userId);
}
