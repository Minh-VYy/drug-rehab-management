package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.HandoverSlipDetail;
import com.rehab.rehab_center_api.enums.HandoverSlipDetailStatus;
import com.rehab.rehab_center_api.enums.HandoverSlipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface HandoverSlipDetailRepository extends JpaRepository<HandoverSlipDetail, String> {

    List<HandoverSlipDetail> findByHandoverSlip_IdOrderByIdAsc(String handoverSlipId);

    @Query("""
            SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END
            FROM HandoverSlipDetail d
            WHERE d.identityNumber = :identityNumber
              AND d.handoverSlip.status NOT IN :excludedSlipStatuses
              AND d.status <> :rejectedStatus
              AND d.handoverSlip.id <> :excludeSlipId
            """)
    boolean existsActiveIdentityNumberExcludingSlip(
            @Param("identityNumber") String identityNumber,
            @Param("excludedSlipStatuses") Collection<HandoverSlipStatus> excludedSlipStatuses,
            @Param("rejectedStatus") HandoverSlipDetailStatus rejectedStatus,
            @Param("excludeSlipId") String excludeSlipId
    );

    @Query("""
            SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END
            FROM HandoverSlipDetail d
            WHERE d.identityNumber = :identityNumber
              AND d.handoverSlip.status NOT IN :excludedSlipStatuses
              AND d.status <> :rejectedStatus
            """)
    boolean existsActiveIdentityNumber(
            @Param("identityNumber") String identityNumber,
            @Param("excludedSlipStatuses") Collection<HandoverSlipStatus> excludedSlipStatuses,
            @Param("rejectedStatus") HandoverSlipDetailStatus rejectedStatus
    );
}
