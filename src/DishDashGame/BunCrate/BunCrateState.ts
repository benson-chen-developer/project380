import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { Foods, Ingredients } from "../WorldEnums/Foods";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import { DishDashEvents } from "../DishDashEvents";
import BunCrateController from "./BunCrateController";

export default abstract class BunCrateState extends State {
	owner: GameNode;
	parent: BunCrateController;
	
	waitTimer: Timer = new Timer(1000); 	// 10 Seconds long

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {
	}

	update(deltaT: number): void {
		// super.update(deltaT)
		
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
