package com.andersonjuniorz.cifras.controller;

import com.andersonjuniorz.cifras.dto.ChordDiagramRequest;
import com.andersonjuniorz.cifras.dto.ChordDiagramResponse;
import com.andersonjuniorz.cifras.model.ChordDiagram;
import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.service.ChordDiagramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/acordes")
@RequiredArgsConstructor
public class ChordDiagramController {

    private final ChordDiagramService service;

    @GetMapping
    public ResponseEntity<List<ChordDiagramResponse>> listar() {
        List<ChordDiagramResponse> acordes = service.listarTodas()
                .stream()
                .map(ChordDiagramResponse::from)
                .toList();
        return ResponseEntity.ok(acordes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChordDiagramResponse> buscarPorId(@PathVariable Long id) {
        ChordDiagramResponse response = ChordDiagramResponse.from(service.buscarPorId(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ChordDiagramResponse> criar(@RequestBody ChordDiagramRequest request) {
        ChordDiagramResponse response = ChordDiagramResponse.from(service.criar(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChordDiagramResponse> atualizar(@PathVariable Long id, @RequestBody ChordDiagramRequest request) {
        ChordDiagramResponse response = ChordDiagramResponse.from(service.atualizar(id, request));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ChordDiagramResponse>> buscar(@RequestParam String q) {
        List<ChordDiagramResponse> acordes = service.buscar(q)
                .stream()
                .map(ChordDiagramResponse::from)
                .toList();
        return ResponseEntity.ok(acordes);
    }

    @GetMapping("/instrumento/{instrumento}")
    public ResponseEntity<List<ChordDiagramResponse>> filtrarPorInstrumento(@PathVariable Cifra.Instrumento instrumento) {
        List<ChordDiagramResponse> acordes = service.filtrarPorInstrumento(instrumento)
                .stream()
                .map(ChordDiagramResponse::from)
                .toList();
        return ResponseEntity.ok(acordes);
    }
}
