package rpo.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "museums")
@Access(AccessType.FIELD)
public class Museum {

    public Museum() {}
    public Museum(Long id) {this.id = id;}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public long id;

    @Column(name = "name", nullable = false)
    public String name;

    @Column(name = "location")
    public String location;

    @JsonIgnore
    @OneToMany
    public List<Painting> paintings = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "usersmuseums",
            joinColumns = @JoinColumn(name = "museumid"),
            inverseJoinColumns = @JoinColumn(name = "userid"))
    public Set<User> users = new HashSet<>();
}