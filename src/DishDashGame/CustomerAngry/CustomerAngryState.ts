import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import CustomerAngryController from "./CustomerAngryController";


export default abstract class CustomerAngryState extends State {
	owner: GameNode;
	parent: CustomerAngryController;
	
	// enterTimer: Timer = new Timer(2000);	// 3 Seconds long
	waitTimer: Timer = new Timer(10000); 	// 10 Seconds long
	deleteTimer: Timer = new Timer(3000); 	// 3 Seconds long

	// entered: boolean = false;
	leaving: boolean = false;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {
	}

	update(deltaT: number): void {
	}
}
