package com.andersonjuniorz.cifras.repository;

import com.andersonjuniorz.cifras.model.Lista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListaRepository extends JpaRepository<Lista, Long> {

    List<Lista> findByNomeContainingIgnoreCase(String nome);
}
