package com.rehab.rehab_center_api.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class LeaderDashboardResponse {

    private final long activePatients;
    private final long pendingIntakes;
    private final long pendingCompletions;
    private final long completedPatients;
    private final List<LeaderTaskResponse> recentTasks;
    private final List<LeaderStageStatResponse> stageStats;
}
