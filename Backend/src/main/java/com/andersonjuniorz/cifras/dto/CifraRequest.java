package com.andersonjuniorz.cifras.dto;

import com.andersonjuniorz.cifras.model.Cifra.Instrumento;

public record CifraRequest(
    String titulo,
    String artista,
    String tom,
    Instrumento instrumento,
    String conteudo,
    String fonte,
    String observacoes,
    String acordesIds,
    Boolean favorito
) {}
