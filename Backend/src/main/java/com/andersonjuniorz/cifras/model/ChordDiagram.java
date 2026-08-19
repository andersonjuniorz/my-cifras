package com.andersonjuniorz.cifras.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chord_diagrams")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChordDiagram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String diagrama;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Cifra.Instrumento instrumento;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    private LocalDateTime atualizadoEm;
}
