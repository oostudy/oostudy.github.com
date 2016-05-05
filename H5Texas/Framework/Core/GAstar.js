
var AStarNode = cc.Class.extend({
    ParentNode: null,
    CurTilePos: null,
    G: 0,
    H: 0,
    ctor: function (node, tilePos)
    {
        this.ParentNode = node;
        this.CurTilePos = tilePos;
        if (this.ParentNode)
        {
            this.G = this.ParentNode.G + 10;
        }
        else
        {
            this.G = 0;
        }
    },
    F: function ()
    {
        return this.G + this.H;
    }
});

GAStar =
{
    _markList: [],
    _markedList: [],
    _routes: [],
    _maxTileWidth: 0,
    _maxTileHeight: 0,
    _mapData: null,
    getRoutes: function (srcTilePos, tarTilePos, mapData, maxTileWidth, maxTileHeight)
    {
        this._markList = [];
        this._markedList = [];
        this._routes = [];
        this._mapData = mapData;
        this._maxTileWidth = maxTileWidth;
        this._maxTileHeight = maxTileHeight;
        var tp = cc.pSub(srcTilePos, tarTilePos);
        var node = new AStarNode(null, srcTilePos);
        node.H = (Math.abs(tp.x) + Math.abs(tp.y)) * 14;
        this._markList.push(node);

        node = this._routing(srcTilePos, tarTilePos);
        while (node)
        {
            this._routes.push(node.CurTilePos);
            node = node.ParentNode;
        }
        this._routes.reverse();
        this._routes.removeAt(0);
        return this._routes;
    },
    _routing: function (srcTilePos, tarTilePos)
    {
        if (this._markList.length <= 0)//已经没有节点，是死路根本无法到达
        {
            return null;
        }

        var node = this._markList[0];
        var curIndex = 0;
        for (var i = 1; i < this._markList.length; ++i)
        {
            if (node.F() > this._markList[i].F())
            {
                node = this._markList[i];
                curIndex = i;
            }
            if (cc.pSameAs(this._markList[i].CurTilePos, tarTilePos))//到达终点
            {
                return this._markList[i];
            }
        }

        this._markList.removeAt(curIndex);
        this._markedList.push(node);

        var tp = cc.p(0, 0);
        //上
        tp.x = node.CurTilePos.x; tp.y = node.CurTilePos.y + 1;
        this._addToMark(tp, tarTilePos, node);
        //下
        tp = cc.p(0, 0);
        tp.x = node.CurTilePos.x; tp.y = node.CurTilePos.y - 1;
        this._addToMark(tp, tarTilePos, node);
        //左
        tp = cc.p(0, 0);
        tp.x = node.CurTilePos.x - 1; tp.y = node.CurTilePos.y;
        this._addToMark(tp, tarTilePos, node);
        //右
        tp = cc.p(0, 0);
        tp.x = node.CurTilePos.x + 1; tp.y = node.CurTilePos.y;
        this._addToMark(tp, tarTilePos, node);

        return this._routing(srcTilePos, tarTilePos);
    },
    _isInMark: function (tilePos)
    {
        for (var i = 0; i < this._markList.length; ++i)
        {
            if (cc.pSameAs(this._markList[i].CurTilePos, tilePos))
            {
                return true;
            }
        }
        for (var i = 0; i < this._markedList.length; ++i)
        {
            if (cc.pSameAs(this._markedList[i].CurTilePos, tilePos))
            {
                return true;
            }
        }
        return false;
    },
    _addToMark: function (curTilePos, tarTilePos, parentAStarNode)
    {
        //无地图数据
        if (curTilePos.x < 0 || curTilePos.y < 0
            || !this._mapData[curTilePos.y] || !this._mapData[curTilePos.y][curTilePos.x]
            || this._mapData[curTilePos.y][curTilePos.x] != 1)
        {
            return
        }
        if (!this._isInMark(curTilePos))//未曾添加
        {
            var newNode = new AStarNode(parentAStarNode, curTilePos);
            var temp_tp = cc.pSub(parentAStarNode.CurTilePos, tarTilePos);
            newNode.H = (Math.abs(temp_tp.x) + Math.abs(temp_tp.y)) * 10;
            this._markList.push(newNode);
        }
    }
};