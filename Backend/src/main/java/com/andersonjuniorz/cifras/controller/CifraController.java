package com.andersonjuniorz.cifras.controller;

import com.andersonjuniorz.cifras.dto.CifraRequest;
import com.andersonjuniorz.cifras.dto.CifraResponse;
import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.service.CifraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cifras")
@RequiredArgsConstructor
public class CifraController {

    private final CifraService service;

    @GetMapping
    public ResponseEntity<List<CifraResponse>> listar() {
        List<CifraResponse> cifras = service.listarTodas()
                .stream()
                .map(CifraResponse::from)
                .toList();
        return ResponseEntity.ok(cifras);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CifraResponse> buscarPorId(@PathVariable Long id) {
        CifraResponse response = CifraResponse.from(service.buscarPorId(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CifraResponse> criar(@RequestBody CifraRequest request) {
        CifraResponse response = CifraResponse.from(service.criar(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CifraResponse> atualizar(@PathVariable Long id, @RequestBody CifraRequest request) {
        CifraResponse response = CifraResponse.from(service.atualizar(id, request));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<CifraResponse>> buscar(@RequestParam String q) {
        List<CifraResponse> cifras = service.buscar(q)
                .stream()
                .map(CifraResponse::from)
                .toList();
        return ResponseEntity.ok(cifras);
    }

    @GetMapping("/instrumento/{instrumento}")
    public ResponseEntity<List<CifraResponse>> filtrarPorInstrumento(@PathVariable Cifra.Instrumento instrumento) {
        List<CifraResponse> cifras = service.filtrarPorInstrumento(instrumento)
                .stream()
                .map(CifraResponse::from)
                .toList();
        return ResponseEntity.ok(cifras);
    }

    @PatchMapping("/{id}/favorito")
    public ResponseEntity<CifraResponse> toggleFavorito(@PathVariable Long id) {
        CifraResponse response = CifraResponse.from(service.toggleFavorito(id));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/favoritos")
    public ResponseEntity<List<CifraResponse>> listarFavoritos() {
        List<CifraResponse> cifras = service.listarFavoritos()
                .stream()
                .map(CifraResponse::from)
                .toList();
        return ResponseEntity.ok(cifras);
    }
}
