package com.rehab.rehab_center_api.repositories;

import com.rehab.rehab_center_api.entities.NotificationReadReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationReadReceiptRepository extends JpaRepository<NotificationReadReceipt, Integer> {
    Optional<NotificationReadReceipt> findByNotification_IdAndUser_Id(String notificationId, Integer userId);

    List<NotificationReadReceipt> findByNotification_IdInAndUser_Id(Collection<String> notificationIds, Integer userId);

    void deleteByNotification_IdIn(Collection<String> notificationIds);
}
