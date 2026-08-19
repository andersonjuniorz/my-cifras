package com.andersonjuniorz.cifras.dto;

import com.andersonjuniorz.cifras.model.ChordDiagram;
import com.andersonjuniorz.cifras.model.Cifra.Instrumento;

import java.time.LocalDateTime;

public record ChordDiagramResponse(
    Long id,
    String nome,
    String diagrama,
    Instrumento instrumento,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {
    public static ChordDiagramResponse from(ChordDiagram diagram) {
        return new ChordDiagramResponse(
            diagram.getId(),
            diagram.getNome(),
            diagram.getDiagrama(),
            diagram.getInstrumento(),
            diagram.getCriadoEm(),
            diagram.getAtualizadoEm()
        );
    }
}
