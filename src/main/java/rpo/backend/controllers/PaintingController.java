package rpo.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rpo.backend.models.Artist;
import rpo.backend.models.Painting;
import rpo.backend.repositories.PaintingRepository;
import rpo.backend.tools.DataValidationException;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class PaintingController {
    @Autowired
    PaintingRepository paintingRepository;

    @GetMapping("/paintings")
    public Page<Painting> getAllPaintings(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        return paintingRepository.findAll(PageRequest.of(page, limit, Sort.by(Sort.Direction.ASC,"name")));
    }

    @GetMapping("/paintings/{id}")
    public ResponseEntity<Painting> getPainting(@PathVariable(value = "id") Long paintingId)
            throws DataValidationException
    {
        Painting painting = paintingRepository.findById(paintingId)
                .orElseThrow(()-> new DataValidationException("Картина с таким индексом не найден"));
        return ResponseEntity.ok(painting);
    }

    @PostMapping("/paintings")
    public ResponseEntity<Object> createPainting(@Valid @RequestBody Painting painting) {
        Painting nc = paintingRepository.save(painting);
        return new ResponseEntity<Object>(nc, HttpStatus.OK);
    }

    @PutMapping("/paintings/{id}")
    public ResponseEntity<Painting> updatePainting(@PathVariable(value = "id") Long paintingId,
                                                   @Valid @RequestBody Painting paintingDetails) {
        Painting painting = null;
        Optional<Painting> cc = paintingRepository.findById(paintingId);
        if (cc.isPresent())
        {
            painting = cc.get();
            painting.name = paintingDetails.name;
            paintingRepository.save(painting);
        }
        else
        {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "painting not found"
            );
        }
        return ResponseEntity.ok(painting);
    }

    @PostMapping("/deletepaintings")
    public ResponseEntity deletePaintings(@Valid @RequestBody List<Painting> paintings){
        paintingRepository.deleteAll(paintings);
        return new ResponseEntity(HttpStatus.OK);
    }
}