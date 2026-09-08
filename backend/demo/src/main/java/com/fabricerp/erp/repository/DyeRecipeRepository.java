package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.DyeRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DyeRecipeRepository extends JpaRepository<DyeRecipe, Long> {
    List<DyeRecipe> findAllByOrderByIdDesc();
    Optional<DyeRecipe> findByRecipeCode(String recipeCode);
}