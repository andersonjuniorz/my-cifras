package com.andersonjuniorz.cifras.controller;

import com.andersonjuniorz.cifras.service.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.management.ManagementFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final BackupService backupService;

    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
            "java", System.getProperty("java.version"),
            "spring", "4.1.0",
            "os", System.getProperty("os.name"),
            "uptime", ManagementFactory.getRuntimeMXBean().getUptime() / 1000 + "s"
        ));
    }

    @PostMapping("/restore-backup")
    public ResponseEntity<Map<String, String>> restoreBackup(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        BackupService.RestoreResult result = backupService.restoreBackup(file);

        if (result.success()) {
            return ResponseEntity.ok(Map.of("mensagem", result.message()));
        } else {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensagem", result.message()));
        }
    }
}