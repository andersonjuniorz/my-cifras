package com.andersonjuniorz.cifras.repository;

import com.andersonjuniorz.cifras.model.Cifra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CifraRepository extends JpaRepository<Cifra, Long> {

    @Query("SELECT c FROM Cifra c WHERE LOWER(c.titulo) LIKE LOWER(CONCAT('%', :busca, '%')) " +
           "OR LOWER(c.artista) LIKE LOWER(CONCAT('%', :busca, '%'))")
    List<Cifra> buscarPorTituloOuArtista(@Param("busca") String busca);

    List<Cifra> findByInstrumento(Cifra.Instrumento instrumento);

    List<Cifra> findByArtistaContainingIgnoreCase(String artista);

    List<Cifra> findByFavoritoTrue();
}
