import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import GameEvent from "../Wolfie2D/Events/GameEvent";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import Level1 from "../DishDashGame/Scenes/Level1";
import Level2 from "../DishDashGame/Scenes/Level2";
import Level3 from "../DishDashGame/Scenes/Level3";
import Level6 from "../DishDashGame/Scenes/Level6";
import Level5 from "../DishDashGame/Scenes/Level5";
import Level4 from "../DishDashGame/Scenes/Level4";

const MainScreenLayer = {
    MENU: "MENU",
    LEVELS: "LEVELS",
    CONTROLS: "CONTROLS",
    HELP: "HELP"
} as const

const MainScreenEvent = {
    MENU: "MENU",
    LEVELS: "LEVELS",
    CONTROLS: "CONTROLS",
    HELP: "HELP"
} as const

export default class MainScreen extends Scene {
    private logo: Sprite;
    private mainScreen: Layer;
    private levelScreen: Layer;
    private helpScreen: Layer;
    private controlsScreen: Layer;
    private currentLayer: Layer;

    public override loadScene(){
        this.load.image("Dash", "assets/Splash/Dash.png")
        this.load.image("Dish", "assets/Splash/Dish.png")
        this.load.image("Ellipse1", "assets/Splash/Ellipse1.png")
        this.load.image("Ellipse1", "assets/Splash/Ellipse1.png")
        this.load.image("burger", "assets/Splash/burger.png")
        this.load.image("Vector1", "assets/Splash/Vector1.png")
        this.load.image("Vector2", "assets/Splash/Vector2.png")
        this.load.image("Vector3", "assets/Splash/Vector3.png")
    }

    public override startScene(): void {
        this.addUILayer("Main");

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        
        let sceneOptions = {
            physics: {
                groupNames: ["ground", "player", "customer", "throwable", "station"],
                collisions:
                [
                    [0, 0, 1, 1, 1],
                    [1, 0, 0, 0, 0],
                    [1, 0, 0, 0, 0],
                    [1, 0, 0, 0, 0],
                    [1, 0, 0, 0, 0],
                ]
            }
        }
        
        this.levelScreen = this.addUILayer(MainScreenLayer.LEVELS);
        this.helpScreen = this.addUILayer(MainScreenLayer.HELP);
        this.controlsScreen = this.addUILayer(MainScreenLayer.CONTROLS);

        this.levelScreen.setHidden(true)
        this.helpScreen.setHidden(true)
        this.controlsScreen.setHidden(true)

        const center = this.viewport.getCenter();
        
        // Main Screen
        this.mainScreen = this.addUILayer(MainScreenLayer.MENU);
        this.currentLayer = this.mainScreen;

        this.logo = this.add.sprite("Dish", MainScreenLayer.MENU)
        this.logo.position = new Vec2(center.x*.75, center.y*.5)
        this.logo = this.add.sprite("Dash", MainScreenLayer.MENU)
        this.logo.position = new Vec2(center.x*1.25, center.y*.75)
        
        this.logo = this.add.sprite("Ellipse1", MainScreenLayer.MENU)
        this.logo.position = new Vec2(center.x*.5, center.y*1.5)
        this.logo = this.add.sprite("burger", MainScreenLayer.MENU)
        this.logo.position = new Vec2(center.x*.4, center.y*1.3)

        this.logo = this.add.sprite("Vector1", MainScreenLayer.MENU)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.5)
        this.logo = this.add.sprite("Vector2",MainScreenLayer.MENU)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.4)
        this.logo = this.add.sprite("Vector3", MainScreenLayer.MENU)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.3)

        const helpBtn = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.MENU, {position: new Vec2(center.x * 1.8, center.y * 1.7), text: "Help"});
        helpBtn.size.set(200, 50);
        helpBtn.borderWidth = 2;
        helpBtn.onClickEventId = MainScreenEvent.HELP;
        
        const controlsBtn = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.MENU, {position: new Vec2(center.x * 1.8, center.y * 1.5), text: "Controls"});
        controlsBtn.size.set(200, 50);
        controlsBtn.borderWidth = 2;
        controlsBtn.onClickEventId = MainScreenEvent.CONTROLS;
        
        const levelsBtn = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.MENU, {position: new Vec2(center.x * 1.8, center.y * 1.3), text: "Levels"});
        levelsBtn.size.set(200, 50);
        levelsBtn.borderWidth = 2;
        levelsBtn.onClickEventId = MainScreenEvent.LEVELS;

        this.receiver.subscribe(MainScreenEvent.LEVELS);
        this.receiver.subscribe(MainScreenEvent.CONTROLS);
        this.receiver.subscribe(MainScreenEvent.HELP);
        this.receiver.subscribe(MainScreenEvent.MENU);

        // Level Screen
        this.logo = this.add.sprite("Dish", MainScreenLayer.LEVELS)
        this.logo.position = new Vec2(center.x*.75, center.y*.5)
        this.logo = this.add.sprite("Dash", MainScreenLayer.LEVELS)
        this.logo.position = new Vec2(center.x*1.25, center.y*.75)
        
        this.logo = this.add.sprite("Ellipse1", MainScreenLayer.LEVELS)
        this.logo.position = new Vec2(center.x*.5, center.y*1.5)
        this.logo = this.add.sprite("burger", MainScreenLayer.LEVELS)
        this.logo.position = new Vec2(center.x*.4, center.y*1.3)

        this.logo = this.add.sprite("Vector1", MainScreenLayer.LEVELS)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.5)
        this.logo = this.add.sprite("Vector2",MainScreenLayer.LEVELS)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.4)
        this.logo = this.add.sprite("Vector3", MainScreenLayer.LEVELS)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.3)
        const backdrop = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.LEVELS, {position: new Vec2(center.x, center.y), text: ""});
        backdrop.size.set(1200, 800)
        backdrop.backgroundColor = new Color(0,0,0,0.5);

        const backBtn = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.LEVELS, {position: new Vec2(center.x * .2, center.y * .2), text: "Back"});
        backBtn.size.set(80, 80);
        backBtn.borderWidth = 2;
        backBtn.backgroundColor = new Color(170,170,170, 1);
        backBtn.onClickEventId = MainScreenEvent.MENU;

        const title = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.LEVELS, {position: new Vec2(center.x * 1, center.y * .6), text: "Levels"});
        title.size.set(120, 80);
        title.borderWidth = 2;
        title.backgroundColor = new Color(252,182,2, 1);


        // Level 1 Button
        const Btn1 = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.LEVELS, {position: new Vec2(center.x * .8, center.y * 1), text: "1"});
        Btn1.size.set(100, 100);
        Btn1.borderWidth = 2;
        Btn1.backgroundColor = new Color(65,77,204, 1);
        Btn1.onClick = () => { this.sceneManager.changeToScene(Level1, {}, sceneOptions); }
        // Btn1.onClickEventId = MainScreenEvent.MENU;

        // Level 2 Button
        const Btn2 = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.LEVELS, {position: new Vec2(center.x * 1, center.y * 1), text: "2"});
        Btn2.size.set(100, 100);
        Btn2.borderWidth = 2;
        Btn2.backgroundColor = new Color(65,77,204, 1);
        // Btn2.backgroundColor = new Color(198,198,198, 1);
        // Btn2.onClickEventId = MainScreenEvent.MENU;
        Btn2.onClick = () => { this.sceneManager.changeToScene(Level2, {}, sceneOptions); }

        // Level 3 Button
        const Btn3 = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.LEVELS, {position: new Vec2(center.x * 1.2, center.y * 1), text: "3"});
        Btn3.size.set(100, 100);
        Btn3.borderWidth = 2;
        // Btn3.backgroundColor = new Color(65,205,98, 1);
        Btn3.backgroundColor = new Color(65,77,204, 1);
        // Btn3.backgroundColor = new Color(198,198,198, 1);
        // Btn3.onClickEventId = MainScreenEvent.MENU;
        Btn3.onClick = () => { this.sceneManager.changeToScene(Level3, {}, sceneOptions); }

        // Level 4 Button
        const Btn4 = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.LEVELS, {position: new Vec2(center.x * .8, center.y * 1.5), text: "4"});
        Btn4.size.set(100, 100);
        Btn4.borderWidth = 2;
        // Btn4.backgroundColor = new Color(65,205,98, 1);
        Btn4.backgroundColor = new Color(65,77,204, 1);
        // Btn4.backgroundColor = new Color(198,198,198, 1);
        // Btn4.onClickEventId = MainScreenEvent.MENU;
        Btn4.onClick = () => { this.sceneManager.changeToScene(Level4, {}, sceneOptions); }

        // Level 5 Button
        const Btn5= this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.LEVELS, {position: new Vec2(center.x * 1, center.y * 1.5), text: "5"});
        Btn5.size.set(100, 100);
        Btn5.borderWidth = 2;
        // Btn5.backgroundColor = new Color(250,78,0, 1);
        // Btn5.backgroundColor = new Color(198,198,198, 1);
        Btn5.backgroundColor = new Color(65,77,204, 1);
        // Btn5.onClickEventId = MainScreenEvent.MENU;
        Btn5.onClick = () => { this.sceneManager.changeToScene(Level5, {}, sceneOptions); }

        // Level 6 Button
        const Btn6 = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.LEVELS, {position: new Vec2(center.x * 1.2, center.y * 1.5), text: "6"});
        Btn6.size.set(100, 100);
        Btn6.borderWidth = 2;
        // Btn6.backgroundColor = new Color(250,78,0, 1);
        // Btn6.backgroundColor = new Color(198,198,198, 1);
        Btn6.backgroundColor = new Color(65,77,204, 1);
        // Btn6.onClickEventId = MainScreenEvent.MENU;
        Btn6.onClick = () => { this.sceneManager.changeToScene(Level6, {}, sceneOptions); }

        //Controls Screen
        this.logo = this.add.sprite("Dish", MainScreenLayer.CONTROLS)
        this.logo.position = new Vec2(center.x*.75, center.y*.5)
        this.logo = this.add.sprite("Dash", MainScreenLayer.CONTROLS)
        this.logo.position = new Vec2(center.x*1.25, center.y*.75)
        
        this.logo = this.add.sprite("Ellipse1", MainScreenLayer.CONTROLS)
        this.logo.position = new Vec2(center.x*.5, center.y*1.5)
        this.logo = this.add.sprite("burger", MainScreenLayer.CONTROLS)
        this.logo.position = new Vec2(center.x*.4, center.y*1.3)

        this.logo = this.add.sprite("Vector1", MainScreenLayer.CONTROLS)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.5)
        this.logo = this.add.sprite("Vector2",MainScreenLayer.CONTROLS)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.4)
        this.logo = this.add.sprite("Vector3", MainScreenLayer.CONTROLS)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.3)

        const backdropControls = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x, center.y), text: ""});
        backdropControls.size.set(1200, 800)
        backdropControls.backgroundColor = new Color(0,0,0,0.5);

        const backBtnControl = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .2, center.y * .2), text: "Back"});
        backBtnControl.size.set(80, 80);
        backBtnControl.borderWidth = 2;
        backBtnControl.backgroundColor = new Color(170,170,170, 1);
        backBtnControl.onClickEventId = MainScreenEvent.MENU;

        const titleControl = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * 1, center.y * .4), text: "Controls"});
        titleControl.size.set(150, 80);
        titleControl.borderWidth = 2;
        titleControl.backgroundColor = new Color(120,125,250, 1);

        const btnW = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .2, center.y * .8), text: "W"});
        btnW.size.set(80, 80);
        btnW.borderWidth = 2;
        btnW.backgroundColor = new Color(120,125,250, 1);
        const btnA = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .4, center.y * .8), text: "A"});
        btnA.size.set(80, 80);
        btnA.borderWidth = 2;
        btnA.backgroundColor = new Color(120,125,250, 1);
        const btnS = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .6, center.y * .8), text: "S"});
        btnS.size.set(80, 80);
        btnS.borderWidth = 2;
        btnS.backgroundColor = new Color(120,125,250, 1);
        const btnD = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .8, center.y * .8), text: "D"});
        btnD.size.set(80, 80);
        btnD.borderWidth = 2;
        btnD.backgroundColor = new Color(120,125,250, 1);
        const movement = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * 1.5, center.y * .8), text: "Movement"});
        movement.size.set(150, 80);
        movement.borderWidth = 2;
        movement.backgroundColor = new Color(240,240,240, 1);

        // const btnESC = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .2, center.y * 1.2), text: "BackSpace"});
        // btnESC.size.set(150, 80);
        // btnESC.borderWidth = 2;
        // btnESC.backgroundColor = new Color(120,125,250, 1);
        // const esc = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * 1.5, center.y * 1.2), text: "Pause"});
        // esc.size.set(150, 80);
        // esc.borderWidth = 2;
        // esc.backgroundColor = new Color(240,240,240, 1);

        const btnEnter = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .2, center.y *1.5), text: "RMB"});
        btnEnter.size.set(80, 80);
        btnEnter.borderWidth = 2;
        btnEnter.backgroundColor = new Color(120,125,250, 1);
        const throwThing = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * 1.5, center.y * 1.5), text: "Throw"});
        throwThing.size.set(150, 80);
        throwThing.borderWidth = 2;
        throwThing.backgroundColor = new Color(240,240,240, 1);

        const btnE = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .2, center.y *1.8), text: "LMB"});
        btnE.size.set(80, 80);
        btnE.borderWidth = 2;
        btnE.backgroundColor = new Color(120,125,250, 1);
        const ineteract = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * 1.5, center.y * 1.8 ), text: "Interact"});
        ineteract.size.set(150, 80);
        ineteract.borderWidth = 2;
        ineteract.backgroundColor = new Color(240,240,240, 1);

        // const btnO = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .2, center.y *2), text: "O"});
        // btnO.size.set(80, 80);
        // btnO.borderWidth = 2;
        // btnO.backgroundColor = new Color(120,125,250, 1);
        // const btnOT = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * 1.5, center.y * 2 ), text: "Inventory Left"});
        // btnOT.size.set(150, 80);
        // btnOT.borderWidth = 2;
        // btnOT.backgroundColor = new Color(240,240,240, 1);

        // const btnP = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * .2, center.y *1.8), text: "P"});
        // btnP.size.set(80, 80);
        // btnP.borderWidth = 2;
        // btnP.backgroundColor = new Color(120,125,250, 1);
        // const btnPT = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.CONTROLS, {position: new Vec2(center.x * 1.5, center.y * 2 ), text: "Inventory Right"});
        // btnPT.size.set(150, 80);
        // btnPT.borderWidth = 2;
        // btnPT.backgroundColor = new Color(240,240,240, 1);

        //Help Screen
        this.logo = this.add.sprite("Dish", MainScreenLayer.HELP)
        this.logo.position = new Vec2(center.x*.75, center.y*.5)
        this.logo = this.add.sprite("Dash", MainScreenLayer.HELP)
        this.logo.position = new Vec2(center.x*1.25, center.y*.75)
        this.logo = this.add.sprite("Ellipse1", MainScreenLayer.HELP)
        this.logo.position = new Vec2(center.x*.5, center.y*1.5)
        this.logo = this.add.sprite("burger", MainScreenLayer.HELP)
        this.logo.position = new Vec2(center.x*.4, center.y*1.3)

        this.logo = this.add.sprite("Vector1", MainScreenLayer.HELP)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.5)
        this.logo = this.add.sprite("Vector2",MainScreenLayer.HELP)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.4)
        this.logo = this.add.sprite("Vector3", MainScreenLayer.HELP)
        this.logo.position = new Vec2(center.x*1.25, center.y*1.3)

        
        const backdropHELP = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.HELP, {position: new Vec2(center.x, center.y), text: ""});
        backdropHELP.size.set(1200, 800)
        backdropHELP.backgroundColor = new Color(0,0,0,0.5);
        
        const backBtnHelp = this.add.uiElement(UIElementType.BUTTON, MainScreenLayer.HELP, {position: new Vec2(center.x * .2, center.y * .2), text: "Back"});
        backBtnHelp.size.set(80, 80);
        backBtnHelp.borderWidth = 2;
        backBtnHelp.backgroundColor = new Color(170,170,170, 1);
        backBtnHelp.onClickEventId = MainScreenEvent.MENU;
        const helpThing = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.HELP, {position: new Vec2(center.x, center.y* .4), text: "Help"});
        helpThing.size.set(200, 50)
        helpThing.backgroundColor = new Color(250,0,219,1);

        const blackBox = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.HELP, {position: new Vec2(center.x, center.y* 1.25), text:''});
        blackBox.size.set(1000, 500)
        blackBox.backgroundColor = new Color(0,0,0,.75);
        const text = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.HELP, {position: new Vec2(center.x*.55, center.y* .7), text:"Serve the hungry customers!"});
        text.backgroundColor = new Color(255,255,255,1);
        const text2 = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.HELP, {position: new Vec2(center.x*.92, center.y* .9), text:"You are an elite chef at multiple restaurants and you must cook"});
        text2.backgroundColor = new Color(255,255,255,1);
        const text22 = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.HELP, {position: new Vec2(center.x*.65, center.y* 1), text:"and deliver the food to the customers."});
        text22.backgroundColor = new Color(255,255,255,1);
        const text3 = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.HELP, {position: new Vec2(center.x*.9, center.y* 1.2), text:"Time is of the essence however so you must ensure you finish"});
        text3.backgroundColor = new Color(255,255,255,1);
        const text33 = this.add.uiElement(UIElementType.LABEL, MainScreenLayer.HELP, {position: new Vec2(center.x*.8, center.y* 1.3), text:"the foods or else the hungry customers will get mad!"});
        text33.backgroundColor = new Color(255,255,255,1);


    }

    public override updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent())
        }
    }

    protected handleEvent(event: GameEvent): void {
        switch(event.type){
            case MainScreenEvent.LEVELS: {
                this.currentLayer.setHidden(true)
                this.levelScreen.setHidden(false);
                this.currentLayer = this.levelScreen;

                break;
            }
            case MainScreenEvent.HELP: {
                this.currentLayer.setHidden(true)
                this.helpScreen.setHidden(false);
                this.currentLayer = this.helpScreen;

                break;
            }
            case MainScreenEvent.CONTROLS: {
                this.currentLayer.setHidden(true)
                this.controlsScreen.setHidden(false);
                this.currentLayer = this.controlsScreen;

                break;
            }
            case MainScreenEvent.MENU: {
                this.currentLayer.setHidden(true)
                this.mainScreen.setHidden(false);
                this.currentLayer = this.mainScreen;

                break;
            }
            default: {
                throw new Error(`Unhandled event in main menu ${event.type}`)
            }
        }
    }

}