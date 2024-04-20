import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Ingredients } from "../../WorldEnums/Foods";
import { StationStates } from "../StationController";
import StationState from "../StationState";

export default class noFoodState extends StationState {
	onEnter(): void {
        // if(this.parent.foodInOven === Ingredients.PATTY){
        //     this.parent.foodInOven = Ingredients.COOKEDPATTY;
        //     this.parent.cookingState = CookingStationStates.COOKED; 
        // }
        this.parent.isBun = false;
        this.parent.isBurger = false;
        this.parent.isCookedPatty = false;
		(<AnimatedSprite>this.owner).animation.play("noFood", true);
	}

	update(deltaT: number): void {
        super.update(deltaT)
        
        if(this.parent.isBun && this.parent.isBurger){
            this.finished(StationStates.burger)
        } else if(this.parent.isBun){
            this.finished(StationStates.bun)
        } else if(this.parent.isCookedPatty){
            console.log("is cooked paty (noFoodState trans)");
            this.finished(StationStates.cookedPatty)
        }
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}