import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { Foods } from "../WorldEnums/Foods";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import CookingStationController, { CookingStationStates, ItemInOvenState } from "./CookingStationController";
import { DishDashEvents } from "../DishDashEvents";

export default abstract class CookingStationState extends State {
	owner: GameNode;
	parent: CookingStationController;
	
	waitTimer: Timer = new Timer(1000); 	// 10 Seconds long

    foodInOven: ItemInOvenState = ItemInOvenState.NONE
    cookingProgess: CookingStationStates = CookingStationStates.NOTCOOKING

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {
		if (event.type == WorldStatus.PLAYER_PUTS_FOOD_IN_OVEN) {
			this.finished(CookingStationStates.COOKING);
		}
	}

	update(deltaT: number): void {
		// console.log("Expression " + this.expression + "\tLeaving: " + this.leaving);
		// if (this.leaving) {
		// 	if (this.deleteTimer.isStopped()) {
		// 		// console.log("Delete State: " + this.expression);
		// 		this.emitter.fireEvent(WorldStatus.CUSTOMER_DELETE, {owner: this.owner.id});
		// 	} 
		// } else {
		// 	if (this.waitTimer.isStopped()) {
		// 		if (this.expression == CustomerStates.WAITING) {
		// 			this.finished(CustomerStates.CONCERN); // Changes animation texture to concern
		// 		} else if (this.expression == CustomerStates.CONCERN) {
		// 			this.finished(CustomerStates.ANGRY); // Changes animation texture to Angry
		// 		}
		// 	}
		// }
	}
}
