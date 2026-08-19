package com.andersonjuniorz.cifras.dto;

import com.andersonjuniorz.cifras.model.Lista;

import java.time.LocalDateTime;
import java.util.List;

public record ListaResponse(
    Long id,
    String nome,
    String descricao,
    List<CifraResponse> cifras,
    LocalDateTime criadoEm,
    LocalDateTime atualizadoEm
) {
    public static ListaResponse from(Lista lista) {
        List<CifraResponse> cifras = lista.getCifras() != null
            ? lista.getCifras().stream().map(CifraResponse::from).toList()
            : List.of();
        return new ListaResponse(
            lista.getId(),
            lista.getNome(),
            lista.getDescricao(),
            cifras,
            lista.getCriadoEm(),
            lista.getAtualizadoEm()
        );
    }
}
