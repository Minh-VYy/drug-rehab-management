package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.Relative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RelativeRepository extends JpaRepository<Relative, Integer> {
    Optional<Relative> findByIdentityNumber(String identityNumber);

    Optional<Relative> findByUser_Id(Integer userId);
}
