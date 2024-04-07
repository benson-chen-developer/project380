import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW5_Color } from "../hw5_color";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import CustomerController, { CustomerStates } from "./CustomerController";
import { Foods, getRandomFood } from "../WorldEnums/Foods";


export default abstract class CustomerState extends State {
	owner: GameNode;
	parent: CustomerController;
	
	enterTimer: Timer = new Timer(2000);	// 3 Seconds long
	waitTimer: Timer = new Timer(7000); 	// 15 Seconds long
	deleteTimer: Timer = new Timer(2000); 	// 5 Seconds long

	entered: boolean = false;
	leaving: boolean = false;
	
	expression: CustomerStates = CustomerStates.WAITING;
	satisfied: boolean = false;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
		this.enterTimer.start();
	}

	handleInput(event: GameEvent): void {
		if (event.type == WorldStatus.PLAYER_SERVE && this.expression != CustomerStates.ANGRY) {
			this.satisfied = true;
		}
	}

	updateExpression() {
		// if (this.expression == CustomerStates.WAITING){ 
		// 	(<AnimatedSprite>this.owner).animation.playIfNotAlready("WAITING", true);
		// } else if (this.expression == CustomerStates.CONCERN){
		// 	(<AnimatedSprite>this.owner).animation.playIfNotAlready("CONCEERN", true);
		// } else if (this.expression == CustomerStates.ANGRY){
		// 	(<AnimatedSprite>this.owner).animation.playIfNotAlready("ANGRY", true);
		// } else {
		// 	(<AnimatedSprite>this.owner).animation.playIfNotAlready("HAPPY", true);
		// }
	}

	update(deltaT: number): void {
		if (this.entered) {
			if (!this.leaving) {
				if (this.satisfied) {
					this.waitTimer.pause();
					this.expression = CustomerStates.HAPPY;
					this.finished(CustomerStates.HAPPY); // Changes animation texture to happy
					
					this.leaving = true;
					this.deleteTimer.start();
				} else {
					if (this.waitTimer.isStopped()) {
						if (this.expression == CustomerStates.WAITING) {
						   this.expression = CustomerStates.CONCERN;
						   this.finished(CustomerStates.CONCERN); // Changes animation texture to concern
						   this.waitTimer.start();
					   } else if (this.expression == CustomerStates.CONCERN) {
						   this.expression = CustomerStates.ANGRY;
						   this.finished(CustomerStates.ANGRY); // Changes animation texture to Angry
						   
						   this.leaving = true;
						   this.deleteTimer.start();
					   }
					}
				}
			} else {
				if (this.deleteTimer.isStopped()) {
					console.log("Delete State: " + this.expression);
					this.emitter.fireEvent(WorldStatus.CUSTOMER_DELETE, {owner: this.owner.id});
				}
			}
		} else {
			if (this.enterTimer.isStopped()) { 
				this.entered = true;
				this.waitTimer.start(); 
			}
		}
	}
}
