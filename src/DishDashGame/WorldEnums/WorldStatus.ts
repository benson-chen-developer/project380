export enum WorldStatus {
    PLAYER_MOVE = "PlayerMove",
    PLAYER_JUMP = "PlayerJump",

    PLAYER_COLLECT = "PlayerCollect",
    PLAYER_DROP = "PlayerDrop",
    PLAYER_DUMP = "PlayerDump",
    PLAYER_SERVE = "PlayerServe",

    PLAYER_AT_CUSTOMER = "PlayerAtCustomer",
    PLAYER_AT_STATION = "PlayerAtStation",
    PLAYER_AT_STORAGE = "PlayerAtStorage",
    DISH_HIT_CUSTOMER = "DishHitCustomer",
    
    CUSTOMER_SPAWN = "CustomerSpawn",
    CUSTOMER_DELETE = "CustomerDelete",
    CUSTOMER_LEAVING = "CustomerLeaving",
    
    PLAYER_ENTERED_LEVEL_END = "PlayerEnteredLevelEnd",
    LEVEL_START = "LevelStart",
    LEVEL_END = "LevelEnd",
}