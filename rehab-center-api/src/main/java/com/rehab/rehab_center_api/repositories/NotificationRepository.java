package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    @Query("""
            SELECT n
            FROM Notification n
            LEFT JOIN n.recipientUser recipient
            WHERE recipient.id = :userId
               OR recipient IS NULL
            ORDER BY n.createdAt DESC
            """)
    List<Notification> findVisibleForUserOrderByCreatedAtDesc(@Param("userId") Integer userId);

    List<Notification> findByStaff_User_IdOrderByCreatedAtDesc(Integer userId);
}
