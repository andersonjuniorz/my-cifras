package com.andersonjuniorz.cifras;

import com.andersonjuniorz.cifras.dto.ListaRequest;
import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.model.Lista;
import com.andersonjuniorz.cifras.repository.CifraRepository;
import com.andersonjuniorz.cifras.repository.ListaRepository;
import com.andersonjuniorz.cifras.service.ListaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ListaCrudTest {

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private CifraRepository cifraRepository;

    @Autowired
    private ListaService listaService;

    private Cifra cifraA;
    private Cifra cifraB;

    @BeforeEach
    void setUp() {
        cifraA = cifraRepository.save(Cifra.builder()
                .titulo("Hotel California")
                .artista("Eagles")
                .tom("Bm")
                .instrumento(Cifra.Instrumento.GUITARRA)
                .conteudo("Bm - F#7 - A - E\nG - D - Em - F#7")
                .build());

        cifraB = cifraRepository.save(Cifra.builder()
                .titulo("Bohemian Rhapsody")
                .artista("Queen")
                .tom("Bb")
                .instrumento(Cifra.Instrumento.TECLADO)
                .conteudo("Bb - Gm - Cm - F\nEb - Ab")
                .build());
    }

    @Test
    void criarLista() {
        ListaRequest request = new ListaRequest("Rock Classico", "Musicas dos anos 70", null);
        Lista salva = listaService.criar(request);

        assertNotNull(salva.getId());
        assertEquals("Rock Classico", salva.getNome());
        assertEquals("Musicas dos anos 70", salva.getDescricao());
        assertTrue(salva.getCifras().isEmpty());
        assertNotNull(salva.getCriadoEm());
        assertNotNull(salva.getAtualizadoEm());
    }

    @Test
    void criarListaComCifras() {
        ListaRequest request = new ListaRequest("Favoritas", null, List.of(cifraA.getId(), cifraB.getId()));
        Lista salva = listaService.criar(request);

        assertNotNull(salva.getId());
        assertEquals(2, salva.getCifras().size());
    }

    @Test
    void buscarListaPorId() {
        ListaRequest request = new ListaRequest("Minha Lista", "Desc", null);
        Lista salva = listaService.criar(request);

        Lista encontrada = listaService.buscarPorId(salva.getId());

        assertEquals(salva.getId(), encontrada.getId());
        assertEquals("Minha Lista", encontrada.getNome());
    }

    @Test
    void buscarListaPorIdInexistente() {
        assertThrows(RuntimeException.class, () -> listaService.buscarPorId(9999L));
    }

    @Test
    void atualizarLista() {
        ListaRequest criar = new ListaRequest("Original", null, null);
        Lista salva = listaService.criar(criar);

        ListaRequest atualizar = new ListaRequest("Atualizada", "Nova desc", null);
        Lista atualizada = listaService.atualizar(salva.getId(), atualizar);

        assertEquals("Atualizada", atualizada.getNome());
        assertEquals("Nova desc", atualizada.getDescricao());
    }

    @Test
    void deletarLista() {
        ListaRequest request = new ListaRequest("Para Deletar", null, null);
        Lista salva = listaService.criar(request);
        Long id = salva.getId();

        listaService.deletar(id);

        assertThrows(RuntimeException.class, () -> listaService.buscarPorId(id));
    }

    @Test
    void listarTodasAsListas() {
        listaService.criar(new ListaRequest("Lista A", null, null));
        listaService.criar(new ListaRequest("Lista B", null, null));

        List<Lista> todas = listaService.listarTodas();

        assertTrue(todas.size() >= 2);
    }

    @Test
    void adicionarCifraALista() {
        Lista lista = listaService.criar(new ListaRequest("Teste", null, null));

        Lista atualizada = listaService.adicionarCifra(lista.getId(), cifraA.getId());

        assertEquals(1, atualizada.getCifras().size());
        assertEquals(cifraA.getId(), atualizada.getCifras().getFirst().getId());
    }

    @Test
    void adicionarCifraDuplicada() {
        Lista lista = listaService.criar(new ListaRequest("Teste", null, null));

        listaService.adicionarCifra(lista.getId(), cifraA.getId());
        Lista segunda = listaService.adicionarCifra(lista.getId(), cifraA.getId());

        assertEquals(1, segunda.getCifras().size());
    }

    @Test
    void removerCifraDeLista() {
        Lista lista = listaService.criar(new ListaRequest("Teste", null, List.of(cifraA.getId(), cifraB.getId())));
        assertEquals(2, lista.getCifras().size());

        Lista atualizada = listaService.removerCifra(lista.getId(), cifraA.getId());

        assertEquals(1, atualizada.getCifras().size());
        assertEquals(cifraB.getId(), atualizada.getCifras().getFirst().getId());
    }

    @Test
    void buscarListasPorNome() {
        listaService.criar(new ListaRequest("Rock Nacional", null, null));
        listaService.criar(new ListaRequest("Sertanejo", null, null));
        listaService.criar(new ListaRequest("Rock Internacional", null, null));

        List<Lista> resultado = listaService.buscar("Rock");

        assertEquals(2, resultado.size());
        assertTrue(resultado.stream().allMatch(l -> l.getNome().toLowerCase().contains("rock")));
    }

    @Test
    void removerCifraInexistenteDaLista() {
        Lista lista = listaService.criar(new ListaRequest("Teste", null, List.of(cifraA.getId())));

        Lista atualizada = listaService.removerCifra(lista.getId(), 9999L);

        assertEquals(1, atualizada.getCifras().size());
    }

    @Test
    void criarListaSemDescricao() {
        ListaRequest request = new ListaRequest("Sem Descricao", null, null);
        Lista salva = listaService.criar(request);

        assertNotNull(salva.getId());
        assertNull(salva.getDescricao());
    }
}
