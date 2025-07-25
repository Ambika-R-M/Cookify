async function searchRecipe() {
  const dish = document.getElementById("dishInput").value.toLowerCase().trim();
  const resultDiv = document.getElementById("result");
  const tryBtn = document.getElementById("tryCookingBtn");

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${dish}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.meals) {
      const meal = data.meals[0];
      const ingredients = [];

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
          ingredients.push(`${measure} ${ingredient}`.trim());
        }
      }

      // Display in HTML
      resultDiv.innerHTML = `
        <h2>🥘 ${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="300">
        <h3>Ingredients:</h3>
        <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        <a href="${meal.strYoutube}" target="_blank">📺 Watch Video</a>
      `;

      // Prepare Game Mode
      currentSteps = [...ingredients, ...meal.strInstructions.split(". ").filter(s => s.trim())];
      currentStepIndex = 0;
      tryBtn.style.display = "inline-block";

    } else {
      resultDiv.innerHTML = `<p>No recipe found for "${dish}".</p>`;
      tryBtn.style.display = "none";
    }
  } catch (error) {
    resultDiv.innerHTML = `<p>Error fetching recipe. Please try again.</p>`;
    console.error(error);
  }
}

// Game Mode (same as before)
const modal = document.getElementById("cookingModal");
const closeBtn = document.querySelector(".close");
const stepText = document.getElementById("cookingStepText");
const nextBtn = document.getElementById("nextStepBtn");

document.getElementById("tryCookingBtn").addEventListener("click", () => {
  if (currentSteps.length > 0) {
    modal.style.display = "block";
    stepText.innerText = `Step 1: ${currentSteps[0]}`;
    nextBtn.style.display = "inline-block";
  }
});

closeBtn.onclick = () => {
  modal.style.display = "none";
};

nextBtn.onclick = () => {
  currentStepIndex++;
  if (currentStepIndex < currentSteps.length) {
    stepText.innerText = `Step ${currentStepIndex + 1}: ${currentSteps[currentStepIndex]}`;
  } else {
    stepText.innerText = "🎉 Congratulations! You've finished cooking!";
    nextBtn.style.display = "none";
  }
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
