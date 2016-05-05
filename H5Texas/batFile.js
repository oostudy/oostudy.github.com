/*
* @Author: YH
* @Date:   2016-05-05 13:33:24
* @Last Modified by:   YH
* @Last Modified time: 2016-05-05 14:46:57
*/

require([ 
	"main",
	 "resource",
	 "texas/Logic/GCardTool",
	 "texas/Logic/GServerMonitor",
	 "texas/View/Page/Page_Room",
	 "texas/View/Role/RoleView",
	 "texas/View/Widget/AnimationChipView",
	 "texas/View/Widget/CardView",
	 "texas/View/Widget/ChipView",
	 "texas/View/Widget/RandomHeapView",
	 "texas/View/Widget/SpecialNumView",
	 "Framework/init",
	 "Framework/IGame",
	 "Framework/Config/_inc_",
	 "Framework/Config/GCfg",
	 "Framework/Core/Base",
	 "Framework/Core/BehaviorAI",
	 "Framework/Core/GAstar",
	 "Framework/Core/GHelper",
	 "Framework/Core/GTriggerMgr",
	 "Framework/Core/JsExtention",
	 "Framework/Net/IWebSocketNode",
	 "Framework/Plug-in/AI/BaseAI",
	 "Framework/Plug-in/AI/EasyBossAI",
	 "Framework/Plug-in/AI/EasyHeroAI",
	 "Framework/Plug-in/AI/EasyMonsterAI",
	 "Framework/Plug-in/Buff/Buff",
	 "Framework/Plug-in/Map/CardDnfMap",
	 "Framework/Plug-in/Map/DnfMap",
	 "Framework/Plug-in/Map/TileMap",
	 "Framework/Plug-in/Skill/BaseSkill",
	 "Framework/Plug-in/Skill/BasicSkill",
	 "Framework/Plug-in/Skill/SkillManager",
	 "Framework/Plug-in/Task/GTaskMgr",
	 "Framework/Plug-in/_inc_",
	 "Framework/Tool/GAniTool",
	 "Framework/Tool/GAudioTool",
	 "Framework/Tool/GBattleMgr",
	 "Framework/Tool/GIconTool",
	 "Framework/Tool/GResMgr",
	 "Framework/View/Layer/RootLayer",
	 "Framework/View/Map/BaseMap",
	 "Framework/View/Map/MapManager",
	 "Framework/View/Page/BasePage",
	 "Framework/View/Page/PageManager",
	 "Framework/View/Role/BaseRole",
	 "Framework/View/Role/RoleManager",
	 "Framework/View/Scene/GameScene"
	 ], function (init, main, $) {
    alert(main+$)
});