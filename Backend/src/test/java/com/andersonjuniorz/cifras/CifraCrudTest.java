package com.andersonjuniorz.cifras;

import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.repository.CifraRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CifraCrudTest {

    @Autowired
    private CifraRepository repository;

    @Test
    void criarCifra() {
        Cifra cifra = Cifra.builder()
                .titulo("Hotel California")
                .artista("Eagles")
                .tom("Bm")
                .instrumento(Cifra.Instrumento.GUITARRA)
                .conteudo("Bm - F#7 - A - E\nG - D - Em - F#7")
                .fonte("https://cifrasclub.com.br/eagles/hotel-california")
                .observacoes("Versao simplificada para guitarra")
                .build();

        Cifra salva = repository.save(cifra);

        assertNotNull(salva.getId());
        assertEquals("Hotel California", salva.getTitulo());
        assertEquals("Eagles", salva.getArtista());
        assertEquals("Bm", salva.getTom());
        assertEquals(Cifra.Instrumento.GUITARRA, salva.getInstrumento());
        assertNotNull(salva.getCriadoEm());
        assertNotNull(salva.getAtualizadoEm());
    }

    @Test
    void buscarCifraPorId() {
        Cifra cifra = Cifra.builder()
                .titulo("Wonderwall")
                .artista("Oasis")
                .tom("Em")
                .instrumento(Cifra.Instrumento.VIOLAO)
                .conteudo("Em - G - D - C\nEm7 - Dsus4")
                .build();

        Cifra salva = repository.save(cifra);
        Optional<Cifra> encontrada = repository.findById(salva.getId());

        assertTrue(encontrada.isPresent());
        assertEquals("Wonderwall", encontrada.get().getTitulo());
        assertEquals("Oasis", encontrada.get().getArtista());
    }

    @Test
    void atualizarCifra() {
        Cifra cifra = Cifra.builder()
                .titulo("Stairway to Heaven")
                .artista("Led Zeppelin")
                .tom("Am")
                .instrumento(Cifra.Instrumento.GUITARRA)
                .conteudo("Am - C/E - D - F#m\nG - Am")
                .build();

        Cifra salva = repository.save(cifra);

        salva.setTitulo("Stairway to Heaven (Editado)");
        salva.setTom("C");
        salva.setConteudo("C - E/G - F - Am\nD - C");
        repository.save(salva);

        Cifra atualizada = repository.findById(salva.getId()).orElseThrow();

        assertEquals("Stairway to Heaven (Editado)", atualizada.getTitulo());
        assertEquals("C", atualizada.getTom());
        assertEquals("C - E/G - F - Am\nD - C", atualizada.getConteudo());
    }

    @Test
    void deletarCifra() {
        Cifra cifra = Cifra.builder()
                .titulo("Smoke on the Water")
                .artista("Deep Purple")
                .tom("G")
                .instrumento(Cifra.Instrumento.GUITARRA)
                .conteudo("G - Bb - C - G\nG - Bb - Db - C")
                .build();

        Cifra salva = repository.save(cifra);
        Long id = salva.getId();

        repository.deleteById(salva.getId());

        assertFalse(repository.findById(id).isPresent());
    }

    @Test
    void listarTodasAsCifras() {
        int antes = repository.findAll().size();

        repository.save(Cifra.builder()
                .titulo("Cifra A").artista("Artista A").tom("C")
                .instrumento(Cifra.Instrumento.VIOLAO).conteudo("C - Am - F - G").build());

        repository.save(Cifra.builder()
                .titulo("Cifra B").artista("Artista B").tom("D")
                .instrumento(Cifra.Instrumento.TECLADO).conteudo("D - Bm - G - A").build());

        List<Cifra> todas = repository.findAll();

        assertEquals(antes + 2, todas.size());
    }

    @Test
    void buscarPorTituloOuArtista() {
        repository.save(Cifra.builder()
                .titulo("Bohemian Rhapsody")
                .artista("Queen")
                .tom("Bb")
                .instrumento(Cifra.Instrumento.TECLADO)
                .conteudo("Bb - Gm - Cm - F\nEb - Ab")
                .build());

        List<Cifra> resultado = repository.buscarPorTituloOuArtista("Bohemian");

        assertFalse(resultado.isEmpty());
        assertEquals("Queen", resultado.getFirst().getArtista());
    }

    @Test
    void filtrarPorInstrumento() {
        repository.save(Cifra.builder()
                .titulo("Cifra Teclado").artista("Tecladista").tom("C")
                .instrumento(Cifra.Instrumento.TECLADO).conteudo("C - F - G").build());

        List<Cifra> teclados = repository.findByInstrumento(Cifra.Instrumento.TECLADO);

        assertFalse(teclados.isEmpty());
        assertTrue(teclados.stream().allMatch(c -> c.getInstrumento() == Cifra.Instrumento.TECLADO));
    }

    @Test
    void criarCifraComTodosOsCampos() {
        Cifra cifra = Cifra.builder()
                .titulo("Imagine")
                .artista("John Lennon")
                .tom("C")
                .instrumento(Cifra.Instrumento.VIOLAO)
                .conteudo("C - Cmaj7 - F\nAm - Dm - G - C")
                .fonte("https://cifrasclub.com.br/john-lennon/imagine")
                .observacoes("Versao simplificada, Simplifiquei os acordes complexos")
                .favorito(true)
                .build();

        Cifra salva = repository.save(cifra);

        assertEquals("Imagine", salva.getTitulo());
        assertEquals("John Lennon", salva.getArtista());
        assertEquals("C", salva.getTom());
        assertEquals(Cifra.Instrumento.VIOLAO, salva.getInstrumento());
        assertEquals("C - Cmaj7 - F\nAm - Dm - G - C", salva.getConteudo());
        assertEquals("https://cifrasclub.com.br/john-lennon/imagine", salva.getFonte());
        assertEquals("Versao simplificada, Simplifiquei os acordes complexos", salva.getObservacoes());
        assertTrue(salva.getFavorito());
    }

    @Test
    void favoritoDefaultFalse() {
        Cifra cifra = Cifra.builder()
                .titulo("Test Default")
                .artista("Test Artist")
                .tom("C")
                .instrumento(Cifra.Instrumento.VIOLAO)
                .conteudo("C - F - G")
                .build();

        Cifra salva = repository.save(cifra);

        assertFalse(salva.getFavorito());
    }

    @Test
    void toggleFavorito() {
        Cifra cifra = Cifra.builder()
                .titulo("Toggle Test")
                .artista("Test Artist")
                .tom("D")
                .instrumento(Cifra.Instrumento.GUITARRA)
                .conteudo("D - G - A")
                .build();

        Cifra salva = repository.save(cifra);
        assertFalse(salva.getFavorito());

        salva.setFavorito(true);
        Cifra atualizada = repository.save(salva);
        assertTrue(atualizada.getFavorito());

        atualizada.setFavorito(false);
        Cifra desfavoritada = repository.save(atualizada);
        assertFalse(desfavoritada.getFavorito());
    }

    @Test
    void listarFavoritos() {
        repository.save(Cifra.builder()
                .titulo("Favorita 1").artista("Art A").tom("C")
                .instrumento(Cifra.Instrumento.VIOLAO).conteudo("C - F - G").favorito(true).build());
        repository.save(Cifra.builder()
                .titulo("Nao Favorita").artista("Art B").tom("D")
                .instrumento(Cifra.Instrumento.GUITARRA).conteudo("D - G - A").favorito(false).build());
        repository.save(Cifra.builder()
                .titulo("Favorita 2").artista("Art C").tom("E")
                .instrumento(Cifra.Instrumento.TECLADO).conteudo("E - A - B").favorito(true).build());

        List<Cifra> favoritas = repository.findByFavoritoTrue();

        assertEquals(2, favoritas.size());
        assertTrue(favoritas.stream().allMatch(Cifra::getFavorito));
    }
}
