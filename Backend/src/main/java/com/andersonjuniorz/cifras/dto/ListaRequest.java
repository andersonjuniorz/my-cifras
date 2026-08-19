package com.andersonjuniorz.cifras.dto;

import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.model.Lista;

import java.time.LocalDateTime;
import java.util.List;

public record ListaRequest(
    String nome,
    String descricao,
    List<Long> cifraIds
) {}
