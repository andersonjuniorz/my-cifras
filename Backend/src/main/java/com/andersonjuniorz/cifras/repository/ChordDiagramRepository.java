package com.andersonjuniorz.cifras.repository;

import com.andersonjuniorz.cifras.model.ChordDiagram;
import com.andersonjuniorz.cifras.model.Cifra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChordDiagramRepository extends JpaRepository<ChordDiagram, Long> {

    List<ChordDiagram> findByInstrumento(Cifra.Instrumento instrumento);

    List<ChordDiagram> findByNomeContainingIgnoreCase(String nome);
}
