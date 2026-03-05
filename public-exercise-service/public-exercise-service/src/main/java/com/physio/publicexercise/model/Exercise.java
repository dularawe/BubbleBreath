package com.physio.publicexercise.model;

import java.util.List;

public class Exercise {
    private String id;
    private String name;
    private int timerSeconds;
    private String demoVideoUrl;
    private List<String> instructions;
    private boolean free;

    public Exercise() {}

    public Exercise(String id, String name, int timerSeconds, String demoVideoUrl, List<String> instructions, boolean free) {
        this.id = id;
        this.name = name;
        this.timerSeconds = timerSeconds;
        this.demoVideoUrl = demoVideoUrl;
        this.instructions = instructions;
        this.free = free;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getTimerSeconds() { return timerSeconds; }
    public void setTimerSeconds(int timerSeconds) { this.timerSeconds = timerSeconds; }

    public String getDemoVideoUrl() { return demoVideoUrl; }
    public void setDemoVideoUrl(String demoVideoUrl) { this.demoVideoUrl = demoVideoUrl; }

    public List<String> getInstructions() { return instructions; }
    public void setInstructions(List<String> instructions) { this.instructions = instructions; }

    public boolean isFree() { return free; }
    public void setFree(boolean free) { this.free = free; }
}