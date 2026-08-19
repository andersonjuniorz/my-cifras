package com.andersonjuniorz.cifras;

import com.andersonjuniorz.cifras.service.BackupService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BackupControllerTest {

    @Autowired
    private BackupService backupService;

    @Test
    void contextLoads() {
        assertNotNull(backupService);
    }

    @Test
    void extractDbName_comUrlCompleta() throws Exception {
        Method method = BackupService.class.getDeclaredMethod("extractDbName", String.class);
        method.setAccessible(true);

        String result = (String) method.invoke(backupService, "jdbc:postgresql://localhost:5432/cifras_db");

        assertEquals("cifras_db", result);
    }

    @Test
    void extractDbName_comQueryParams() throws Exception {
        Method method = BackupService.class.getDeclaredMethod("extractDbName", String.class);
        method.setAccessible(true);

        String result = (String) method.invoke(backupService, "jdbc:postgresql://localhost:5432/cifras_db?ssl=true");

        assertEquals("cifras_db", result);
    }

    @Test
    void extractDbName_urlNull() throws Exception {
        Method method = BackupService.class.getDeclaredMethod("extractDbName", String.class);
        method.setAccessible(true);

        String result = (String) method.invoke(backupService, (String) null);

        assertEquals("cifras_db", result);
    }

    @Test
    void extractDbName_urlVazia() throws Exception {
        Method method = BackupService.class.getDeclaredMethod("extractDbName", String.class);
        method.setAccessible(true);

        String result = (String) method.invoke(backupService, "");

        assertEquals("cifras_db", result);
    }

    @Test
    void extractDbName_urlSemSlash() throws Exception {
        Method method = BackupService.class.getDeclaredMethod("extractDbName", String.class);
        method.setAccessible(true);

        String result = (String) method.invoke(backupService, "jdbc:postgresql:");

        assertEquals("cifras_db", result);
    }

    @Test
    void extractDbName_urlComPorte() throws Exception {
        Method method = BackupService.class.getDeclaredMethod("extractDbName", String.class);
        method.setAccessible(true);

        String result = (String) method.invoke(backupService, "jdbc:postgresql://db-host:5433/my_production_db");

        assertEquals("my_production_db", result);
    }

    @Test
    void extractDbName_urlProducao() throws Exception {
        Method method = BackupService.class.getDeclaredMethod("extractDbName", String.class);
        method.setAccessible(true);

        String result = (String) method.invoke(backupService, "jdbc:postgresql://production-server.internal:5432/cifras_prod?currentSchema=public&sslmode=require");

        assertEquals("cifras_prod", result);
    }
}
