package com.andersonjuniorz.cifras.controller;

import com.andersonjuniorz.cifras.dto.ListaRequest;
import com.andersonjuniorz.cifras.dto.ListaResponse;
import com.andersonjuniorz.cifras.model.Lista;
import com.andersonjuniorz.cifras.service.ListaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listas")
@RequiredArgsConstructor
public class ListaController {

    private final ListaService service;

    @GetMapping
    public ResponseEntity<List<ListaResponse>> listar() {
        List<ListaResponse> listas = service.listarTodas()
                .stream()
                .map(ListaResponse::from)
                .toList();
        return ResponseEntity.ok(listas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListaResponse> buscarPorId(@PathVariable Long id) {
        ListaResponse response = ListaResponse.from(service.buscarPorId(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ListaResponse> criar(@RequestBody ListaRequest request) {
        ListaResponse response = ListaResponse.from(service.criar(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListaResponse> atualizar(@PathVariable Long id, @RequestBody ListaRequest request) {
        ListaResponse response = ListaResponse.from(service.atualizar(id, request));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ListaResponse>> buscar(@RequestParam String q) {
        List<ListaResponse> listas = service.buscar(q)
                .stream()
                .map(ListaResponse::from)
                .toList();
        return ResponseEntity.ok(listas);
    }

    @PostMapping("/{id}/cifras/{cifraId}")
    public ResponseEntity<ListaResponse> adicionarCifra(@PathVariable Long id, @PathVariable Long cifraId) {
        ListaResponse response = ListaResponse.from(service.adicionarCifra(id, cifraId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/cifras/{cifraId}")
    public ResponseEntity<ListaResponse> removerCifra(@PathVariable Long id, @PathVariable Long cifraId) {
        ListaResponse response = ListaResponse.from(service.removerCifra(id, cifraId));
        return ResponseEntity.ok(response);
    }
}
