package com.andersonjuniorz.cifras.service;

import com.andersonjuniorz.cifras.dto.CifraRequest;
import com.andersonjuniorz.cifras.model.Cifra;
import com.andersonjuniorz.cifras.repository.CifraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CifraService {

    private final CifraRepository repository;

    public List<Cifra> listarTodas() {
        return repository.findAll();
    }

    public Cifra buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cifra não encontrada com id: " + id));
    }

    public Cifra criar(CifraRequest request) {
        Cifra cifra = Cifra.builder()
                .titulo(request.titulo())
                .artista(request.artista())
                .tom(request.tom())
                .instrumento(request.instrumento())
                .conteudo(request.conteudo())
                .fonte(request.fonte())
                .observacoes(request.observacoes())
                .acordesIds(request.acordesIds())
                .favorito(request.favorito() != null ? request.favorito() : false)
                .build();
        return repository.save(cifra);
    }

    public Cifra atualizar(Long id, CifraRequest request) {
        Cifra cifra = buscarPorId(id);
        cifra.setTitulo(request.titulo());
        cifra.setArtista(request.artista());
        cifra.setTom(request.tom());
        cifra.setInstrumento(request.instrumento());
        cifra.setConteudo(request.conteudo());
        cifra.setFonte(request.fonte());
        cifra.setObservacoes(request.observacoes());
        cifra.setAcordesIds(request.acordesIds());
        if (request.favorito() != null) {
            cifra.setFavorito(request.favorito());
        }
        return repository.save(cifra);
    }

    public Cifra toggleFavorito(Long id) {
        Cifra cifra = buscarPorId(id);
        cifra.setFavorito(!cifra.getFavorito());
        return repository.save(cifra);
    }

    public List<Cifra> listarFavoritos() {
        return repository.findByFavoritoTrue();
    }

    public void deletar(Long id) {
        Cifra cifra = buscarPorId(id);
        repository.delete(cifra);
    }

    public List<Cifra> buscar(String busca) {
        return repository.buscarPorTituloOuArtista(busca);
    }

    public List<Cifra> filtrarPorInstrumento(Cifra.Instrumento instrumento) {
        return repository.findByInstrumento(instrumento);
    }
}
