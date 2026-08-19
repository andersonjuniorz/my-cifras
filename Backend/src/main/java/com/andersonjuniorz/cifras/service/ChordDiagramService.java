package com.andersonjuniorz.cifras.service;

import com.andersonjuniorz.cifras.dto.ChordDiagramRequest;
import com.andersonjuniorz.cifras.model.ChordDiagram;
import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.repository.ChordDiagramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChordDiagramService {

    private final ChordDiagramRepository repository;

    public List<ChordDiagram> listarTodas() {
        return repository.findAll();
    }

    public ChordDiagram buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Acorde nao encontrado com id: " + id));
    }

    public ChordDiagram criar(ChordDiagramRequest request) {
        ChordDiagram diagram = ChordDiagram.builder()
                .nome(request.nome())
                .diagrama(request.diagrama())
                .instrumento(request.instrumento())
                .build();
        return repository.save(diagram);
    }

    public ChordDiagram atualizar(Long id, ChordDiagramRequest request) {
        ChordDiagram diagram = buscarPorId(id);
        diagram.setNome(request.nome());
        diagram.setDiagrama(request.diagrama());
        diagram.setInstrumento(request.instrumento());
        return repository.save(diagram);
    }

    public void deletar(Long id) {
        ChordDiagram diagram = buscarPorId(id);
        repository.delete(diagram);
    }

    public List<ChordDiagram> filtrarPorInstrumento(Cifra.Instrumento instrumento) {
        return repository.findByInstrumento(instrumento);
    }

    public List<ChordDiagram> buscar(String busca) {
        return repository.findByNomeContainingIgnoreCase(busca);
    }
}
