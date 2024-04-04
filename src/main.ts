import Game from "./Wolfie2D/Loop/Game";
import SplashScreen from "./MainScreenScene/SplashScreen";
import MainScreen from "./MainScreenScene/MainScreen";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 700},          // The size of the game
        clearColor: {r: 255, g: 255, b: 255},   // The color the game clears to
        inputs: [
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "jump", keys: ["w", "space"]},
            {name: "run", keys: ["shift"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    // game.start(MainMenu, {});
    game.start(SplashScreen, {});
})();

function runTests(){};