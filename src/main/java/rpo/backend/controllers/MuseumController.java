package rpo.backend.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import rpo.backend.models.Country;
import rpo.backend.models.Museum;
import rpo.backend.repositories.MuseumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class MuseumController {
    @Autowired
    MuseumRepository museumRepository;

    @GetMapping("/museums")
    public Page<Museum> getAllMuseums(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        return museumRepository.findAll(PageRequest.of(page, limit, Sort.by(Sort.Direction.ASC, "name")));
    }
//    @GetMapping("/countries")
//    public Page<Country> getAllCountries(@RequestParam("page") int page, @RequestParam("limit") int limit) {
//        return countryRepository.findAll(PageRequest.of(page, limit, Sort.by(Sort.Direction.ASC, "name")));
//    }
    @PostMapping("/museums")
    public ResponseEntity<?> createMuseum(@Validated @RequestBody Museum museum) {
        try {
            Museum nm = museumRepository.save(museum);
            return new ResponseEntity<Museum>(nm, HttpStatus.OK);
        }
        catch (Exception ex) {
            String error;
            if (ex.getMessage().contains("museums.name_UNIQUE"))
                error = "museumalreadyexists";
            else
                error = "undefinederror";
            Map<String, String> map = new HashMap<>();
            map.put("error", error);
            return new ResponseEntity<Object>(map, HttpStatus.OK);
        }
    }

    @PutMapping("/museums/{id}")
    public ResponseEntity<Museum> updateMuseum(@PathVariable(value = "id") Long museumId,
                                               @Validated @RequestBody Museum museumDetails) {
        Museum museum = null;
        Optional<Museum> cc = museumRepository.findById(museumId);
        if (cc.isPresent()) {
            museum = cc.get();
            museum.name = museumDetails.name;
            museum.location = museumDetails.location;
            museumRepository.save(museum);
        } else
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "museum not found"
            );
        return ResponseEntity.ok(museum);
    }

    @DeleteMapping("/museums/{id}")
    public Map<String, Boolean> deleteMuseum(@PathVariable(value = "id") Long museumId) {
        Optional<Museum> museum = museumRepository.findById(museumId);
        Map<String, Boolean> response = new HashMap<>();
        if (museum.isPresent()) {
            museumRepository.delete(museum.get());
            response.put("deleted", Boolean.TRUE);
        }
        else
            response.put("deleted", Boolean.FALSE);
        return response;
    }
}
