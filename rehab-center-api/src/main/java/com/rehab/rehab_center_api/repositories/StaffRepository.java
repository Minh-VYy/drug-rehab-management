package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.Staff;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends org.springframework.data.jpa.repository.JpaRepository<Staff, String> {

    Optional<Staff> findByUser_Id(Integer userId);
}
