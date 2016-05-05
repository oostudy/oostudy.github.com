var MapManager = cc.Node.extend({
    _curMap:null,
    ctor:function()
    {
        this._super();
    },

    getCurMap:function()
    {
        return this._curMap
    },

    openMap:function(mapData,from)
    {
        if(this._curMap)
        {
            this.closeMap();
        }
        //GMapDataModel.init(mapData);
        this._curMap = eval("new " + mapData.maptype + "(mapData, from);");
        this.addChild(this._curMap);
        return true;
    },

    closeMap:function()
    {
        if(!this._curMap)
        {
            cc.log("closeMap failed!CurMap==nil");
            return false;
        }
    
        this._curMap.removeFromParent();
        this._curMap = null;
        return true;
    }
});
GMapMgr = null;