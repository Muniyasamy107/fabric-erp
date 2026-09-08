package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.DyeRecipe;
import com.fabricerp.erp.entity.YarnInventory;
import com.fabricerp.erp.repository.DyeRecipeRepository;
import com.fabricerp.erp.repository.YarnInventoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/dye-house")
public class DyeHouseController {

    private final YarnInventoryRepository yarnRepository;
    private final DyeRecipeRepository dyeRepository;

    public DyeHouseController(YarnInventoryRepository yarnRepository, DyeRecipeRepository dyeRepository) {
        this.yarnRepository = yarnRepository;
        this.dyeRepository = dyeRepository;
    }

    // --- Yarn Cone Stock ---
    @GetMapping("/yarn-stock")
    public List<YarnInventory> getAllYarnStock() {
        return yarnRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/yarn-stock")
    public ResponseEntity<?> receiveYarnConsignment(@RequestBody YarnInventory yarn) {
        if (yarn.getYarnLotNumber() == null || yarn.getYarnLotNumber().isBlank()) {
            yarn.setYarnLotNumber("YARN-LOT-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm")));
        }
        return ResponseEntity.ok(yarnRepository.save(yarn));
    }

    // --- Dye Kitchen Recipes ---
    @GetMapping("/recipes")
    public List<DyeRecipe> getAllRecipes() {
        return dyeRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/recipes")
    public ResponseEntity<?> createDyeRecipe(@RequestBody DyeRecipe recipe) {
        if (recipe.getRecipeCode() == null || recipe.getRecipeCode().isBlank()) {
            recipe.setRecipeCode("DYE-RECIPE-" + System.currentTimeMillis() % 10000);
        }
        return ResponseEntity.ok(dyeRepository.save(recipe));
    }

    @PutMapping("/recipes/{id}/status")
    public ResponseEntity<?> updateLabDipStatus(@PathVariable Long id, @RequestParam String status) {
        DyeRecipe r = dyeRepository.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();
        r.setLabDipStatus(status);
        return ResponseEntity.ok(dyeRepository.save(r));
    }
}