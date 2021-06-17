package rpo.backend.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "contries")
@Access(AccessType.FIELD)
public class Country {

    public Country() { }
    public Country(Long id) { this.id = id; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false, unique = true)
    public String name;

//    @OneToMany(mappedBy = "country")
//    public List<rpo.backend.models.Artist> artists = new ArrayList<>();
}
