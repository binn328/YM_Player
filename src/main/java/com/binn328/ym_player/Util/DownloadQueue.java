package com.binn328.ym_player.Util;

import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Component
public class DownloadQueue {
    private final BlockingQueue<String> queue;
    public DownloadQueue() {
        this.queue = new LinkedBlockingQueue<>();
    }

    public void addTask(String task) {
        queue.add(task);
    }

    public String getTask() throws InterruptedException {
        return queue.take();
    }
}
