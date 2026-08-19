package com.andersonjuniorz.cifras.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BackupService {

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String datasourceUsername;

    private static final String[] REQUIRED_TABLES = {
        "cifras", "chord_diagrams", "listas", "lista_cifras"
    };

    public record ProcessResult(int exitCode, String stdout, String stderr) {}

    public record RestoreResult(boolean success, String message) {}

    // ===================== BACKUP =====================

    public byte[] generateBackup() throws Exception {
        String dbName = extractDbName(datasourceUrl);
        String host = getEnv("PGHOST", "localhost");
        String password = getEnv("PGPASSWORD", "postgres");

        ProcessBuilder pb = new ProcessBuilder(
            "pg_dump",
            "-h", host,
            "-p", "5432",
            "-U", datasourceUsername,
            "-d", dbName,
            "--no-owner",
            "--no-privileges"
        );
        pb.environment().put("PGPASSWORD", password);

        Process process = pb.start();
        String stdout;
        String stderr;

        try (BufferedReader out = new BufferedReader(new InputStreamReader(process.getInputStream()));
             BufferedReader err = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            stdout = out.lines().collect(Collectors.joining("\n"));
            stderr = err.lines().collect(Collectors.joining("\n"));
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            log.error("pg_dump falhou. exit={}, stderr={}", exitCode, stderr);
            throw new RuntimeException("pg_dump falhou (exit " + exitCode + "): " + stderr);
        }

        return stdout.getBytes();
    }

    // ===================== RESTORE =====================

    public RestoreResult restoreBackup(MultipartFile file) {
        String dbName = extractDbName(datasourceUrl);
        String tempDbName = dbName + "_restore_temp";
        String host = getEnv("PGHOST", "localhost");
        String password = getEnv("PGPASSWORD", "postgres");
        File tempFile = null;

        try {
            if (file.isEmpty()) {
                return new RestoreResult(false, "Arquivo vazio.");
            }

            tempFile = Files.createTempFile("restore_", ".sql").toFile();
            file.transferTo(tempFile);

            log.info("Restore iniciado. Banco temporário: {}", tempDbName);

            dropDatabaseIfExists(host, password, tempDbName);

            createDatabase(host, password, tempDbName, datasourceUsername);
            log.info("Banco temporário criado: {}", tempDbName);

            ProcessResult restore = executePsql(host, password, tempDbName,
                "-v", "ON_ERROR_STOP=on",
                "-f", tempFile.getAbsolutePath()
            );

            if (restore.exitCode != 0) {
                log.error("Restore falhou no banco temporário. exit={}, stderr={}",
                    restore.exitCode, restore.stderr);
                dropDatabaseIfExists(host, password, tempDbName);
                return new RestoreResult(false,
                    "Erro ao restaurar backup (exit " + restore.exitCode + "): " + restore.stderr);
            }

            log.info("Restore no banco temporário concluído. Validando...");

            String validationError = validateDatabase(host, password, tempDbName);
            if (validationError != null) {
                log.error("Validação falhou: {}", validationError);
                dropDatabaseIfExists(host, password, tempDbName);
                return new RestoreResult(false,
                    "Backup restaurado, mas validação falhou: " + validationError);
            }

            log.info("Validação OK. Substituindo banco principal...");

            dropDatabaseForce(host, password, dbName);
            renameDatabase(host, password, tempDbName, dbName);

            log.info("Restore concluído com sucesso. Banco {} restaurado.", dbName);
            return new RestoreResult(true, "Backup restaurado com sucesso.");

        } catch (Exception e) {
            log.error("Erro inesperado durante restore", e);
            try {
                dropDatabaseIfExists(host, password, tempDbName);
            } catch (Exception ex) {
                log.error("Erro ao limpar banco temporário", ex);
            }
            return new RestoreResult(false, "Erro ao restaurar backup: " + e.getMessage());
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    // ===================== VALIDATION =====================

    private String validateDatabase(String host, String password, String dbName) {
        for (String table : REQUIRED_TABLES) {
            ProcessResult result = executePsql(host, password, dbName,
                "-t", "-A", "-c",
                "SELECT EXISTS (" +
                    "SELECT 1 FROM information_schema.tables " +
                    "WHERE table_schema = 'public' AND table_name = '" + table + "'"
                + ")"
            );

            if (result.exitCode != 0) {
                return "Erro ao verificar tabela '" + table + "': " + result.stderr;
            }

            String exists = result.stdout.trim();
            if (!"t".equals(exists)) {
                return "Tabela essencial não encontrada: " + table;
            }
        }

        ProcessResult fkResult = executePsql(host, password, dbName,
            "-t", "-A", "-c",
            "SELECT COUNT(*) FROM information_schema.table_constraints " +
            "WHERE constraint_type = 'FOREIGN KEY' " +
            "AND table_schema = 'public' AND table_name = 'lista_cifras'"
        );

        if (fkResult.exitCode == 0) {
            String count = fkResult.stdout.trim();
            if ("0".equals(count)) {
                return "Relacionamentos foreign key não encontrados em 'lista_cifras'";
            }
        }

        return null;
    }

    // ===================== DATABASE OPERATIONS =====================

    private void createDatabase(String host, String password, String dbName, String owner) throws Exception {
        ProcessResult result = executePsql(host, password, "postgres",
            "-c", "CREATE DATABASE " + quoteIdentifier(dbName) + " OWNER " + quoteIdentifier(owner)
        );
        if (result.exitCode != 0) {
            throw new RuntimeException("Erro ao criar banco " + dbName + ": " + result.stderr);
        }
    }

    private void dropDatabaseIfExists(String host, String password, String dbName) throws Exception {
        executePsql(host, password, "postgres",
            "-c", "DROP DATABASE IF EXISTS " + quoteIdentifier(dbName)
        );
    }

    private void dropDatabaseForce(String host, String password, String dbName) throws Exception {
        ProcessResult result = executePsql(host, password, "postgres",
            "-c", "DROP DATABASE IF EXISTS " + quoteIdentifier(dbName) + " WITH (FORCE)"
        );
        if (result.exitCode != 0) {
            throw new RuntimeException("Erro ao dropar banco " + dbName + ": " + result.stderr);
        }
    }

    private void renameDatabase(String host, String password, String fromName, String toName) throws Exception {
        ProcessResult result = executePsql(host, password, "postgres",
            "-c", "ALTER DATABASE " + quoteIdentifier(fromName) + " RENAME TO " + quoteIdentifier(toName)
        );
        if (result.exitCode != 0) {
            throw new RuntimeException("Erro ao renomear banco " + fromName + " -> " + toName + ": " + result.stderr);
        }
    }

    // ===================== EXECUTION =====================

    private ProcessResult executePsql(String host, String password, String database, String... args) {
        List<String> command = new ArrayList<>();
        command.add("psql");
        command.add("-h");
        command.add(host);
        command.add("-p");
        command.add("5432");
        command.add("-U");
        command.add(datasourceUsername);
        command.add("-d");
        command.add(database);
        command.add("--no-psqlrc");
        command.addAll(Arrays.asList(args));

        try {
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.environment().put("PGPASSWORD", password);

            Process process = pb.start();
            String stdout;
            String stderr;

            try (BufferedReader out = new BufferedReader(new InputStreamReader(process.getInputStream()));
                 BufferedReader err = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                stdout = out.lines().collect(Collectors.joining("\n"));
                stderr = err.lines().collect(Collectors.joining("\n"));
            }

            int exitCode = process.waitFor();
            return new ProcessResult(exitCode, stdout, stderr);
        } catch (Exception e) {
            return new ProcessResult(-1, "", e.getMessage());
        }
    }

    // ===================== UTILITIES =====================

    private String quoteIdentifier(String name) {
        return "\"" + name.replace("\"", "\"\"") + "\"";
    }

    String extractDbName(String url) {
        if (url == null || url.isEmpty()) return "cifras_db";
        int lastSlash = url.lastIndexOf('/');
        if (lastSlash == -1) return "cifras_db";
        String dbName = url.substring(lastSlash + 1);
        int queryIndex = dbName.indexOf('?');
        if (queryIndex != -1) dbName = dbName.substring(0, queryIndex);
        return dbName;
    }

    private String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isEmpty()) ? value : defaultValue;
    }
}
