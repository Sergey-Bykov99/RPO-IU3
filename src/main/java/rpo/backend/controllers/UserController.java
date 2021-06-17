package rpo.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import javax.validation.Valid;

import org.springframework.security.crypto.codec.Hex;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rpo.backend.models.Artist;
import rpo.backend.models.Museum;
import rpo.backend.models.User;
import rpo.backend.repositories.MuseumRepository;
import rpo.backend.repositories.UserRepository;
import rpo.backend.tools.DataValidationException;
import rpo.backend.tools.Utils;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    MuseumRepository museumRepository;
    @Autowired
    MuseumRepository paintingRepository;
    @Autowired
    MuseumRepository countryRepository;
    @Autowired
    MuseumRepository artistRepository;

    @GetMapping("/users")
    public Page<User> getAllUsers(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        return userRepository.findAll(PageRequest.of(page, limit, Sort.by(Sort.Direction.ASC,"name")));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable(value = "id") Long userId)
            throws DataValidationException
    {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new DataValidationException("Пользователь с таким индексом не найден"));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    public ResponseEntity<Object> createUser(@Valid @RequestBody User user){
        try {
            User nc = userRepository.save(user);
            return new ResponseEntity<Object>(nc, HttpStatus.OK);
        }
        catch (Exception ex)
        {
            String error;
            if(ex.getMessage().contains("users.login_UNIQUE"))
                error = "loginalreadyexists";
            else
                error = "undefinederror";
            Map<String, String> map = new HashMap<>();
            map.put("error", error);
            return ResponseEntity.ok(map);
        }
    }

    @PostMapping("/users/{id}/addmuseums")
    public ResponseEntity<Object> addMuseums(@PathVariable(value = "id") Long userId,
                                             @Valid @RequestBody Set<Museum> museums){
        Optional<User> uu = userRepository.findById(userId);
        int cnt = 0;
        if (uu.isPresent()){
            User u = uu.get();
            for (Museum m: museums){
                Optional<Museum> mm = museumRepository.findById(m.id);
                if (mm.isPresent()){
                    u.addMuseum(mm.get());
                    cnt++;
                }
            }
            userRepository.save(u);
        }
        Map<String, String> response = new HashMap<>();
        response.put("count", String.valueOf(cnt));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/{id}/removemuseums")
    public ResponseEntity<Object> removeMuseums(@PathVariable(value = "id") Long userId,
                                                @Valid @RequestBody Set<Museum> museums){
        Optional<User> uu = userRepository.findById(userId);
        int cnt = 0;
        if (uu.isPresent()){
            User u = uu.get();
            for (Museum m: u.museums){
                u.removeMuseum(m);
                cnt++;
            }
            userRepository.save(u);
        }
        Map<String, String> response = new HashMap<>();
        response.put("count", String.valueOf(cnt));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable(value = "id") Long userId,
                                           @Valid @RequestBody User userDetails)
            throws DataValidationException
    {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(()->new DataValidationException("Пользователь с таким индексом не найден"));
            user.email = userDetails.email;
            String np = userDetails.np;
            if (np != null && !np.isEmpty()) {
                byte[] b = new byte[32];
                new Random().nextBytes(b);
                String salt = new String(Hex.encode(b));
                user.password = Utils.ComputeHash(np, salt);
                user.salt = salt;
            }
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        catch (Exception ex) {
            String error;
            if (ex.getMessage().contains("users.email_UNIQUE"))
                throw new DataValidationException("Пользователь с такой почтой уже есть в базе");
            else
                throw new DataValidationException("Неизвестная ошибка");
        }
    }

    @PostMapping("/deleteusers")
    public ResponseEntity deleteUsers(@Valid @RequestBody List<User> users){
        userRepository.deleteAll(users);
        return new ResponseEntity(HttpStatus.OK);
    }
}