import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { Foods, Ingredients } from "../WorldEnums/Foods";
import { WorldStatus } from "../WorldEnums/WorldStatus";
import StorageStationController from "./StorageStationController";

export default class StorageStationState extends State {
	owner: GameNode;
	parent: StorageStationController;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}

    handleInput(event: GameEvent): void {

	}

    onEnter(options: Record<string, any>): void {
        (<AnimatedSprite>this.owner).animation.play("FRIDGE", true);
    }

    update(deltaT: number): void {

	}

    onExit(): Record<string, any> {
        (<AnimatedSprite>this.owner).animation.stop();
		return {};
    }
}
	

	
