package com.andersonjuniorz.cifras.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "listas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "lista_cifras",
        joinColumns = @JoinColumn(name = "lista_id"),
        inverseJoinColumns = @JoinColumn(name = "cifra_id")
    )
    @Builder.Default
    private List<Cifra> cifras = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    private LocalDateTime atualizadoEm;
}
