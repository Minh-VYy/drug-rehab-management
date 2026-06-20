package com.rehab.rehab_center_api.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record RoleDashboardResponse(
        String theme,
        String icon,
        String roleLabel,
        String title,
        String name,
        String subtitle,
        String commandLabel,
        String commandValue,
        String commandText,
        List<Metric> metrics,
        Visual visual,
        Focus focus,
        Timeline timeline,
        List<Action> actions,
        List<Signal> signals
) {
    public record Metric(
            String label,
            String value,
            String icon,
            String tone,
            String trend,
            Boolean warn
    ) {}

    public record Visual(
            String title,
            String subtitle,
            String badge,
            String centerValue,
            String centerLabel,
            List<ChartDatum> data
    ) {}

    public record ChartDatum(
            String label,
            long value,
            String tone,
            String color
    ) {}

    public record Focus(
            String title,
            String subtitle,
            List<FocusItem> items
    ) {}

    public record FocusItem(
            String title,
            String text,
            String meta,
            String icon,
            String tone,
            String route
    ) {}

    public record Timeline(
            String title,
            String subtitle,
            List<TimelineItem> items
    ) {}

    public record TimelineItem(
            String time,
            String title,
            String text
    ) {}

    public record Action(
            String label,
            String text,
            String icon,
            String tone,
            String route
    ) {}

    public record Signal(
            String text,
            String icon,
            String tone
    ) {}
}
