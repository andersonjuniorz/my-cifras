package com.andersonjuniorz.cifras.controller;

import com.andersonjuniorz.cifras.service.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/backup")
@RequiredArgsConstructor
public class BackupController {

    private final BackupService backupService;

    @GetMapping(produces = "application/sql")
    public ResponseEntity<byte[]> backup() {
        try {
            byte[] dump = backupService.generateBackup();

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm"));
            String filename = "mycifras_backup_" + timestamp + ".sql";

            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/sql"))
                .body(dump);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(("Erro ao gerar backup: " + e.getMessage()).getBytes());
        }
    }
}
