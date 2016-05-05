
var TileMap = BaseMap.extend({
    _data_map: null,
    _tmxmap: null,
    _mapSize: cc.p(0, 0),
    _tileSize: cc.p(0, 0),
    ctor: function (mapData) {
        this._super(mapData);
    },
    onEnter: function () {
        //var ext = jsb.fileUtils.getFileExtension(this._data_map.path)

        this._tmxmap = new cc.TMXTiledMap(this._data_map.path);

        this.addChild(this._tmxmap);
        this._hero = new Role(new RoleDataModel());
        this._hero.setScale(2);
        this.addChild(this._hero, 1000, 10086);
        this._mapSize = this._tmxmap.getMapSize();
        this._tileSize = this._tmxmap.getTileSize();
        this.setContentSize(this._mapSize.width * this._tileSize.width, this._mapSize.height * this._tileSize.height);
        this._mapData = [];
        for (var i = 0; i < this._mapSize.height; ++i) {
            this._mapData[i] = [];
            for (var j = 0; j < this._mapSize.width; ++j) {
                this._mapData[i][j] = 1;
            }
        }
        this._initNpc();

        this._super();
    },
    _initNpc: function () {
        if (this._data_map.npc.length <= 0) {
            return true;
        }
        for (var i = 0; i < this._data_map.npc.length; ++i) {
            var npc = new NpcRole(this._data_map.npc[i]);
            this._npc.push(npc);
            this.addChild(npc, 1000, 1008611 + i);
        }
    },
    onTouchBegan: function (touch, event) {
        this._super(touch, event)
        if (!this._hero) {
            return;
        }
        var lp = this.convertToNodeSpace(event.getLocation());
        var heroPos = this._hero.getPosition();
        var tarTileX = Math.floor(lp.x / this._tileSize.width);
        var tarTileY = Math.floor(lp.y / this._tileSize.height);
        var heroTileX = Math.floor(heroPos.x / this._tileSize.width);
        var heroTileY = Math.floor(heroPos.y / this._tileSize.height);
        var routs = GAStar.getRoutes(cc.p(heroTileX, heroTileY), cc.p(tarTileX, tarTileY), this._mapData, this._mapSize.width, this._mapSize.height);
        for (var i = 0; i < routs.length; ++i) {
            routs[i].x = routs[i].x * this._tileSize.width + this._tileSize.width / 2;
            routs[i].y = routs[i].y * this._tileSize.height + this._tileSize.height / 2;
        }
        this._hero.moveTo(routs);
    },
    update: function (dt) {
        if (!this._hero) {
            return;
        }
        var heroPos = this._hero.getPosition();
        var mapPos = this.getPosition();
        mapPos.x = cc.winSize.width / 2 - heroPos.x;
        mapPos.y = cc.winSize.height / 2 - heroPos.y;

        var mapSize = this._tmxmap.getMapSize();
        var tileSize = this._tmxmap.getTileSize();
        var minX = cc.winSize.width - mapSize.width * tileSize.width;
        var minY = cc.winSize.height - mapSize.height * tileSize.height;
        mapPos.x = mapPos.x > 0 ? 0 : mapPos.x;
        mapPos.x = mapPos.x < minX ? minX : mapPos.x;
        mapPos.y = mapPos.y > 0 ? 0 : mapPos.y;
        mapPos.y = mapPos.y < minY ? minY : mapPos.y;
        this.setPosition(mapPos);
        this._super(dt);
    }
});