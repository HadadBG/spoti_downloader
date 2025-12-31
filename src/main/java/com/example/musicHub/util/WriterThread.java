package com.example.musicHub.util;

import java.io.File;

import jakarta.servlet.ServletOutputStream;
import java.io.FileInputStream;
import java.io.IOException;


public class WriterThread extends Thread {
    private final File file;
    private final ServletOutputStream pos;

    public WriterThread(File file, ServletOutputStream pos) {
        this.file = file;
        this.pos = pos;
    }

    @Override
    public void run() {
        final int BUFFER_SIZE = 1048576; // 1MB
        byte[] buffer = new byte[BUFFER_SIZE];

        try (FileInputStream fis = new FileInputStream(file)) {

            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                pos.write(buffer, 0, bytesRead);
            }

            pos.flush();
            pos.close();

        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
