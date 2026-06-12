package com.jobpilot.dto.response;

public record ApplicationResumeInfo(
        ResumeSummaryResponse resume,
        String source
) {
    public static final String SOURCE_APPLICATION = "APPLICATION_RESUME";
    public static final String SOURCE_DEFAULT = "USER_DEFAULT";
    public static final String SOURCE_NONE = "NONE";
}
