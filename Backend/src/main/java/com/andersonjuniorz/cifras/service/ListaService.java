package com.andersonjuniorz.cifras.service;

import com.andersonjuniorz.cifras.dto.ListaRequest;
import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.model.Lista;
import com.andersonjuniorz.cifras.repository.CifraRepository;
import com.andersonjuniorz.cifras.repository.ListaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ListaService {

    private final ListaRepository listaRepository;
    private final CifraRepository cifraRepository;

    @Transactional(readOnly = true)
    public List<Lista> listarTodas() {
        return listaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Lista buscarPorId(Long id) {
        return listaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lista nao encontrada com id: " + id));
    }

    public Lista criar(ListaRequest request) {
        Lista lista = Lista.builder()
                .nome(request.nome())
                .descricao(request.descricao())
                .cifras(new ArrayList<>())
                .build();

        if (request.cifraIds() != null && !request.cifraIds().isEmpty()) {
            List<Cifra> cifras = cifraRepository.findAllById(request.cifraIds());
            lista.setCifras(new ArrayList<>(cifras));
        }

        return listaRepository.save(lista);
    }

    public Lista atualizar(Long id, ListaRequest request) {
        Lista lista = buscarPorId(id);
        lista.setNome(request.nome());
        lista.setDescricao(request.descricao());

        if (request.cifraIds() != null) {
            List<Cifra> cifras = cifraRepository.findAllById(request.cifraIds());
            lista.setCifras(new ArrayList<>(cifras));
        }

        return listaRepository.save(lista);
    }

    public void deletar(Long id) {
        Lista lista = buscarPorId(id);
        listaRepository.delete(lista);
    }

    @Transactional
    public Lista adicionarCifra(Long listaId, Long cifraId) {
        Lista lista = buscarPorId(listaId);
        Cifra cifra = cifraRepository.findById(cifraId)
                .orElseThrow(() -> new RuntimeException("Cifra nao encontrada com id: " + cifraId));

        if (!lista.getCifras().contains(cifra)) {
            lista.getCifras().add(cifra);
            listaRepository.save(lista);
        }
        return lista;
    }

    @Transactional
    public Lista removerCifra(Long listaId, Long cifraId) {
        Lista lista = buscarPorId(listaId);
        lista.getCifras().removeIf(c -> c.getId().equals(cifraId));
        return listaRepository.save(lista);
    }

    public List<Lista> buscar(String busca) {
        return listaRepository.findByNomeContainingIgnoreCase(busca);
    }
}
