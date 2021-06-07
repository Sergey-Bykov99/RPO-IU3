package rpo.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rpo.backend.models.Artist;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {

}
