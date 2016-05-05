init_config =
{
    project_type: "javascript",

    designWidth: 1136,
    designHeight: 640,
    width: 1136,
    height: 640,
    frameZoomFactor: 0.7,
    debugMode: 1,
    showFPS: true,
    frameRate: 60,
    id: "gameCanvas",
    renderMode: 0,
    engineDir: "frameworks/cocos2d-html5",

    modules: ["cocos2d", "extensions", "external"],

    jsList: [
      //////////核心部分，依赖性只和js本身相关，必须有
      "Framework/Core/Base.js",
      "Framework/Core/GAstar.js",
      "Framework/Core/GHelper.js",
      "Framework/Core/JsExtention.js",
      "Framework/Core/GTriggerMgr.js",
      "Framework/Core/BehaviorAI.js",

      //////////框架部分，依赖与core，cocos2dx，必须有
      "Framework/Config/_inc_.js",
      "Framework/Config/GCfg.js",

      //Net
      "Framework/Net/IWebSocketNode.js",

      "Framework/Tool/GAniTool.js",
      "Framework/Tool/GAudioTool.js",
      "Framework/Tool/GBattleMgr.js",
      "Framework/Tool/GIconTool.js",
      "Framework/Tool/GResMgr.js",

      "Framework/View/Layer/RootLayer.js",
      "Framework/View/Map/BaseMap.js",
      "Framework/View/Map/MapManager.js",
      "Framework/View/Page/BasePage.js",
      "Framework/View/Page/PageManager.js",
      "Framework/View/Role/BaseRole.js",
      "Framework/View/Role/RoleManager.js",
      "Framework/View/Scene/GameScene.js",


      //插件扩展，依赖于框架部分，视具体应用，可有可无，
      "Framework/Plug-in/_inc_.js",
      "Framework/Plug-in/AI/BaseAI.js",
      "Framework/Plug-in/AI/EasyBossAI.js",
      "Framework/Plug-in/AI/EasyHeroAI.js",
      "Framework/Plug-in/AI/EasyMonsterAI.js",
      "Framework/Plug-in/Buff/Buff.js",
      "Framework/Plug-in/Map/DnfMap.js",
      "Framework/Plug-in/Map/TileMap.js",
      "Framework/Plug-in/Skill/BaseSkill.js",
      "Framework/Plug-in/Skill/BasicSkill.js",
      "Framework/Plug-in/Skill/SkillManager.js",
      "Framework/Plug-in/Task/GTaskMgr.js",

      "Framework/IGame.js",
    ]
};
App_Name = "Dnf";