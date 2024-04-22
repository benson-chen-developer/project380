// Output for Cooking Stations
export enum Foods {
    BURGER = "Burger",
    FRIES = "Fries",
    CHICKEN_NUGGETS = "Chicken Nuggets",
    FISH_AND_CHIPS = "Fish and Chips",
    SCRAMBLE_EGGS = "Scramble Eggs",
    APPLE_PIE = "Apple Pie",
    PANCAKES = "Pancakes",
}

// Inputs for Cooking Stations
export enum Ingredients { 
    PATTY = "Raw Patty",
    LETTUCES = "Lettuces",
    BUNS = "Buns",
    POTATOS = "Potatos",
    RAW_NUGGET = "Raw Chicken Nuggets",
    EGGS = "Eggs",
    FISH = "Fish",
    APPLE = "Apple",
    FLOUR_MIX = "Flour Mix",
    SYRUP = "Maple Syrup"
}

export const foodIngredients: {[key in Foods]: Ingredients[]} = {
    // Level 1 Foods
    [Foods.BURGER]: [Ingredients.PATTY, Ingredients.LETTUCES, Ingredients.BUNS],
    [Foods.FRIES]: [Ingredients.POTATOS],
    // Level 2 Foods
    [Foods.CHICKEN_NUGGETS]: [Ingredients.RAW_NUGGET],
    // Level 3 Foods
    [Foods.SCRAMBLE_EGGS]: [Ingredients.EGGS],
    // Level 4 Foods
    [Foods.APPLE_PIE]: [Ingredients.APPLE, Ingredients.FLOUR_MIX],
    // Level 5 Foods
    [Foods.PANCAKES]: [Ingredients.FLOUR_MIX, Ingredients.SYRUP],  
    // Level 6 Foods
    [Foods.FISH_AND_CHIPS]: [Ingredients.FISH, Ingredients.POTATOS, Ingredients.LETTUCES],
};

export function getRandomFood(diffculty: number): Foods {
    const randomIndex = Math.random();
    if (diffculty == 1) {
        if (randomIndex < 0.9) {
            return Foods.BURGER;
        } else {
            return Foods.FRIES;
        }
    } else if (diffculty == 2) {
        if (randomIndex < 0.2) {
            return Foods.BURGER;
        } else if (randomIndex < 0.6) {
            return Foods.CHICKEN_NUGGETS;
        } else {
            return Foods.FRIES;
        }
    } else if (diffculty == 3) {
        if (randomIndex < 0.2) {
            return Foods.BURGER;
        } else if (randomIndex < 0.4) {
            return Foods.CHICKEN_NUGGETS;
        } else if (randomIndex < 0.7) {
            return Foods.SCRAMBLE_EGGS;
        } else {
            return Foods.FRIES;
        }
    } else if (diffculty == 4) {
        if (randomIndex < 0.2) {
            return Foods.BURGER;
        } else if (randomIndex < 0.4) {
            return Foods.CHICKEN_NUGGETS;
        } else if (randomIndex < 0.6) {
            return Foods.SCRAMBLE_EGGS;
        } else if (randomIndex < 0.8) {
            return Foods.APPLE_PIE;
        } else {
            return Foods.FRIES;
        }
    } else if (diffculty == 5) {
        if (randomIndex < 0.15) {
            return Foods.BURGER;
        } else if (randomIndex < 0.3) {
            return Foods.CHICKEN_NUGGETS;
        } else if (randomIndex < 0.45) {
            return Foods.SCRAMBLE_EGGS;
        } else if (randomIndex < 0.6) {
            return Foods.APPLE_PIE;
        } else if (randomIndex < 0.75) {
            return Foods.PANCAKES;
        } else {
            return Foods.FRIES;
        }
    } else {
        if (randomIndex < 0.1) {
            return Foods.BURGER;
        } else if (randomIndex < 0.25) {
            return Foods.CHICKEN_NUGGETS;
        } else if (randomIndex < 0.4) {
            return Foods.SCRAMBLE_EGGS;
        } else if (randomIndex < 0.55) {
            return Foods.APPLE_PIE;
        } else if (randomIndex < 0.7) {
            return Foods.PANCAKES;
        } else if (randomIndex < 0.85) {
            return Foods.FISH_AND_CHIPS;
        } else {
            return Foods.FRIES;
        }
    }
}

export function isFoodsEnum(value: any): boolean {
    return Object.values(Foods).includes(value as Foods);
}

export function isIngredientsEnum(value: any): boolean {
    return Object.values(Ingredients).includes(value as Ingredients);
}
