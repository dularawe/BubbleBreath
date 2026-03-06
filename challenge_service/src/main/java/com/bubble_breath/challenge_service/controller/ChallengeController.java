package com.bubble_breath.challenge_service.controller;

import com.bubble_breath.challenge_service.dto.request.ChallengeRequest;
import com.bubble_breath.challenge_service.dto.request.ChallengeUpdateRequest;
import com.bubble_breath.challenge_service.dto.response.ChallengeResponse;
import com.bubble_breath.challenge_service.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RequestMapping("Challenge")
@RestController
@CrossOrigin
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;


    @PostMapping
    public ResponseEntity<ChallengeResponse> save(@Valid @RequestBody ChallengeRequest request){
        ChallengeResponse save = challengeService.save(request);
        return ResponseEntity.ok(save);
    }

    @PutMapping
    public ResponseEntity<ChallengeResponse> update(@Valid @RequestBody ChallengeUpdateRequest request){
        ChallengeResponse updated = challengeService.update(request);
        if(updated==null){
            return  ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }


    @GetMapping("{id}")
    public ResponseEntity<ChallengeResponse> getById(@PathVariable("id") UUID id){
        ChallengeResponse get = challengeService.getById(id);

        if(get==null){

            return  ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(get);
    }


    @GetMapping()
    public ResponseEntity<List<ChallengeResponse>> getAll(){
        List<ChallengeResponse> getall = challengeService.getAll();
        return ResponseEntity.ok(getall);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Integer> delete(@PathVariable("id") UUID id){
        int deleted = challengeService.delete(id);
        if(deleted==0){
            return  ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deleted);
    }
}