package rpo.backend.controllers;

import org.junit.jupiter.params.shadow.com.univocity.parsers.common.DataValidationException;
import org.springframework.beans.factory.annotation.Autowired;
// org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
//import rpo.backend.models.Country;
import org.springframework.web.server.ResponseStatusException;
import rpo.backend.models.Artist;
//import rpo.backend.repositories.CountryRepository;
import rpo.backend.models.Museum;
import rpo.backend.repositories.ArtistRepository;
//import rpo.backend.repositories.CountryRepository;

import java.util.*;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")

public class ArtistController {
    @Autowired
    ArtistRepository artistRepository;

    @GetMapping("/artists")
    public Page<Artist> getAllArtists(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        return artistRepository.findAll(PageRequest.of(page, limit, Sort.by(Sort.Direction.ASC, "name")));
    }

//    @GetMapping("/Artist/{id}")
//    public ResponseEntity<Artist> getArtist(@PathVariable(value = "id") Long artistId)
//            throws DataValidationException
//    {
//        Artist artist = artistRepository.findById(artistId)
//                .orElseThrow(()->new DataValidationException("Такой художник не найден"));
//        return ResponseEntity.ok(artist);
//    }

    @PostMapping("/artists")
    public ResponseEntity<?> createArtist(@Valid @RequestBody Artist artist)
            throws DataValidationException {
        try {
            Artist nc = artistRepository.save(artist);
            return new ResponseEntity<Artist>(nc, HttpStatus.OK);
        }
        catch (Exception ex) {
            String error;
            if (ex.getMessage().contains("artist.name_UNIQUE"))
                error = "artistalreadyexists";
            else
                error = "undefinederror";
            Map<String, String> map = new HashMap<>();
            map.put("error", error);
            return new ResponseEntity<Object>(map, HttpStatus.OK);
        }
    }

    @PutMapping("/artists/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable(value = "id") Long artistId,
                                                 @Validated @RequestBody Artist artistDetails) {
        Artist artist = null;
        Optional<Artist> cc = artistRepository.findById(artistId);
        if (cc.isPresent()) {
            artist = cc.get();
            artist.name = artistDetails.name;
            artist.century = artistDetails.century;
            artistRepository.save(artist);
        } else
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "artist not found"
            );
        return ResponseEntity.ok(artist);
//            throws DataValidationException {
//        try {
//            Artist artist = artistRepository.findById(artistId)
//                    .orElseThrow(()-> new DataValidationException("Такой художник не найден"));
//            artist.name = artistDetails.name;
////            artist.countryid = artistDetails.countryid;
//            artist.century = artistDetails.century;
//            artistRepository.save(artist);
//            return ResponseEntity.ok(artist);
//        }
//        catch (Exception ex) {
//            String error;
//            if (ex.getMessage().contains("artists.name_UNIQUE"))
//                throw new DataValidationException("Такой художник уже есть в базе");
//            else
//                throw new DataValidationException("Неизвестная ошибка");
//        }

    }

//    @PostMapping("/deleteArtists")
//    public ResponseEntity deleteArtists(@Valid @RequestBody List<Artist> artists) {
//        artistRepository.deleteAll(artists);
//        return new ResponseEntity(HttpStatus.OK);
//    }

    @DeleteMapping("/artists/{id}")
    public Map<String, Boolean> deleteArtist(@PathVariable(value = "id") Long artistId) {
        Optional<Artist> artist = artistRepository.findById(artistId);
        Map<String, Boolean> response = new HashMap<>();
        if (artist.isPresent()) {
            artistRepository.delete(artist.get());
            response.put("deleted", Boolean.TRUE);
        }
        else
            response.put("deleted", Boolean.FALSE);
        return response;
    }
}
