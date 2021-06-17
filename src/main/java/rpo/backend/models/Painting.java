package rpo.backend.models;

import javax.persistence.*;

@Entity
@Table(name = "paintings")
@Access(AccessType.FIELD)
public class Painting {

    public Painting() {}
    public Painting(Long id) {this.id = id;}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "artistid")
    public long artistid;

    @Column(name = "museumid")
    public long museumid;

    @Column(name = "year")
    public int year;
}