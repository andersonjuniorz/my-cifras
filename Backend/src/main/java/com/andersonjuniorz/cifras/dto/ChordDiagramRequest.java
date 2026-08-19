package com.andersonjuniorz.cifras.dto;

import com.andersonjuniorz.cifras.model.Cifra.Instrumento;

public record ChordDiagramRequest(
    String nome,
    String diagrama,
    Instrumento instrumento
) {}
