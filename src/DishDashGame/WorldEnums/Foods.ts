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
    const foodValues = Object.values(Foods);
    const randomIndex = Math.floor(Math.random() * foodValues.length);
    return foodValues[randomIndex];
}

export function isFoodsEnum(value: any): boolean {
    return Object.values(Foods).includes(value as Foods);
}

export function isIngredientsEnum(value: any): boolean {
    return Object.values(Ingredients).includes(value as Ingredients);
}

