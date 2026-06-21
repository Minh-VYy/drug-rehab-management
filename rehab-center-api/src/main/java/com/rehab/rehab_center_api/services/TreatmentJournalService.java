package com.rehab.rehab_center_api.services;

import com.rehab.rehab_center_api.dtos.DiaryPatientOptionDto;
import com.rehab.rehab_center_api.dtos.TreatmentJournalDto;

import java.util.List;

public interface TreatmentJournalService {
    List<TreatmentJournalDto> getTreatmentDiariesForDoctor(Integer userId);
    TreatmentJournalDto createTreatmentDiary(Integer userId, TreatmentJournalDto dto);
    TreatmentJournalDto updateTreatmentDiary(Integer userId, String id, TreatmentJournalDto dto);
    List<DiaryPatientOptionDto> getPatientOptionsForDoctor(Integer userId);
}
