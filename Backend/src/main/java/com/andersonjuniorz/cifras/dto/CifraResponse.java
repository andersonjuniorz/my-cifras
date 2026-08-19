package com.andersonjuniorz.cifras.dto;

import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.model.Cifra.Instrumento;

import java.time.LocalDateTime;

public record CifraResponse(
    Long id,
    String titulo,
    String artista,
    String tom,
    Instrumento instrumento,
    String conteudo,
    String fonte,
    String observacoes,
    String acordesIds,
    Boolean favorito,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {
    public static CifraResponse from(Cifra cifra) {
        return new CifraResponse(
            cifra.getId(),
            cifra.getTitulo(),
            cifra.getArtista(),
            cifra.getTom(),
            cifra.getInstrumento(),
            cifra.getConteudo(),
            cifra.getFonte(),
            cifra.getObservacoes(),
            cifra.getAcordesIds(),
            cifra.getFavorito(),
            cifra.getCriadoEm(),
            cifra.getAtualizadoEm()
        );
    }
}
