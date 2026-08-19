package com.andersonjuniorz.cifras.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cifras")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cifra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String artista;

    @Column(nullable = false)
    private String tom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Instrumento instrumento;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    private String fonte;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(length = 500)
    private String acordesIds;

    @Column(nullable = false)
    @Builder.Default
    private Boolean favorito = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    private LocalDateTime atualizadoEm;

    public enum Instrumento {
        VIOLAO,
        GUITARRA,
        TECLADO
    }
}
