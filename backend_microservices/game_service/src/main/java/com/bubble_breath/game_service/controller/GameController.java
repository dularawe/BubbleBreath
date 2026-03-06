package com.bubble_breath.game_service.controller;

import com.bubble_breath.game_service.dto.request.GameRequest;
import com.bubble_breath.game_service.dto.request.GameUpdateRequest;
import com.bubble_breath.game_service.dto.response.GameResponse;
import com.bubble_breath.game_service.service.GameService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("Game")
@RestController
@CrossOrigin
public class GameController {

    @Autowired
    private GameService gameService;


    @PostMapping
    public ResponseEntity<GameResponse> save(@Valid @RequestBody GameRequest request){
        GameResponse save = gameService.save(request);
        return ResponseEntity.ok(save);
    }

    @PutMapping
    public ResponseEntity<GameResponse> update(@Valid @RequestBody GameUpdateRequest request){
        GameResponse updated = gameService.update(request);
        if(updated==null){
            return  ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }


    @GetMapping("{id}")
    public ResponseEntity<GameResponse> getById(@PathVariable("id") UUID id){
        GameResponse get = gameService.getById(id);

        if(get==null){

            return  ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(get);
    }


    @GetMapping()
    public ResponseEntity<List<GameResponse>> getAll(){
        List<GameResponse> getall = gameService.getAll();
        return ResponseEntity.ok(getall);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Integer> delete(@PathVariable("id") UUID id){
        int deleted = gameService.delete(id);
        if(deleted==0){
            return  ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deleted);
    }
}