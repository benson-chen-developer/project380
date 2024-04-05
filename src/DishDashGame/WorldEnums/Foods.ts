export enum Foods {
    BURGER = "burger",
    FRIES = "fries",
}

export enum Ingredients {
    PATTY = "patty",
    BUNS = "buns",
    POTATO = "potato",
}

export const foodIngredients: {[key in Foods]: Ingredients[]} = {
    [Foods.BURGER]: [Ingredients.PATTY, Ingredients.BUNS],
    [Foods.FRIES]: [Ingredients.POTATO]
};

export function getRandomFood(): Foods {
    const foodValues = Object.keys(Foods);
    const randomIndex = Math.floor(Math.random() * foodValues.length);
    return foodValues[randomIndex] as Foods;
}