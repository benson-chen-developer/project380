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
	
	enterTimer: Timer = new Timer(3000);	// 3 Seconds long
	waitTimer: Timer = new Timer(15000); 	// 15 Seconds long
	deleteTimer: Timer = new Timer(3000); 	// 3 Seconds long

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
		if (event.type == WorldStatus.PLAYER_SERVE) {
			this.satisfied = true;
		}
	}

	update(deltaT: number): void {
		if (!this.entered && this.enterTimer.isStopped()) { 
			this.entered = true;
			this.waitTimer.start(); 
		}
		
		if (this.entered && !this.leaving && this.waitTimer.isStopped()) {
			if (this.satisfied) {
				this.expression = CustomerStates.HAPPY;
				this.finished(CustomerStates.HAPPY);
				this.leaving = true;
				this.deleteTimer.start();
			} else if (this.expression == CustomerStates.WAITING) {
				this.expression = CustomerStates.CONCERN;
				this.finished(CustomerStates.CONCERN);
                
				this.waitTimer.start();
            } else if (this.expression == CustomerStates.CONCERN) {
				this.expression = CustomerStates.ANGRY;
                this.finished(CustomerStates.ANGRY);
				this.leaving = true;
				this.deleteTimer.start();
            }
        }


	}
}
