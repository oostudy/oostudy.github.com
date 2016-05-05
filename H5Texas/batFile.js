/*
* @Author: YH
* @Date:   2016-05-05 13:33:24
* @Last Modified by:   YH
* @Last Modified time: 2016-05-05 18:37:01
*/

require([ 
	"Framework/Core/Base.js",
    "Framework/Core/GAstar.js",
    "Framework/Core/GHelper.js",
    "Framework/Core/JsExtention.js",
    "Framework/Core/GTriggerMgr.js",
    "Framework/Core/BehaviorAI.js",

    "Framework/Config/_inc_.js",
    "Framework/Config/GCfg.js",

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

    "resource.js",
    "texas/View/Page/Page_Room.js",
    "texas/View/Role/RoleView.js",
    "texas/View/Widget/ChipView.js",
    "texas/View/Widget/AnimationChipView.js",
    "texas/View/Widget/RandomHeapView.js",
    "texas/View/Widget/CardView.js",
    "texas/View/Widget/SpecialNumView.js",
    "texas/Logic/GServerMonitor.js",
    "texas/Logic/GCardTool.js"
	 ], function (init, main, $) {
    alert(main+$)
});