import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Ingredients } from "../../WorldEnums/Foods";
import { StationStates } from "../StationController";
import StationState from "../StationState";

export default class BurgerState extends StationState {
	onEnter(): void {
                console.log("We are in buirger state", this.parent.isBurger);
		(<AnimatedSprite>this.owner).animation.play("burger", true);
	}

	update(deltaT: number): void {
                if(!this.parent.isBun && !this.parent.isCookedPatty){
                        this.finished(StationStates.noFood)
                }
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}