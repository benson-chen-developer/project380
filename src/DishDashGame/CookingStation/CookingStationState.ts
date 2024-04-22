import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { Foods, Ingredients } from "../WorldEnums/Foods";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import CookingStationController, { CookingStationStates } from "./CookingStationController";

export default abstract class CookingStationState extends State {
	owner: GameNode;
	parent: CookingStationController;
	waitTimer: Timer = new Timer(3000); // 3 seconds long

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {
		if (event.type == WorldStatus.PAUSE_TIME && this.waitTimer.hasRun() && !this.waitTimer.isStopped()) {
			this.waitTimer.isPaused();
			(<AnimatedSprite>this.owner).animation.pause();
		} 
		else if (event.type == WorldStatus.RESUME_TIME && this.waitTimer.hasRun() && !this.waitTimer.isPaused()) {
			this.waitTimer.start();
			(<AnimatedSprite>this.owner).animation.resume();
		}
	}

	update(deltaT: number): void {

	}
}
