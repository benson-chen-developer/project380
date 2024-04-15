import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";

import FlyingDishController, { FlyingDishStates } from "./FlyingDishController";

export default abstract class FlyingDishState extends State {
	owner: GameNode;
	// gravity: number = 500;
	parent: FlyingDishController;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}

	/**
	 * Here is where the states are defined for handling balloon gravity effects. We recieve a player suit change event 
	 * and adjust the balloon gravity effects accordingly based on its color
	 */
	handleInput(event: GameEvent): void {

	}

	update(deltaT: number): void {
        // if (this.owner.onWall) {
        //     console.log("ON WALL");
		// 	this.owner.destroy();
		// }
	}
}
