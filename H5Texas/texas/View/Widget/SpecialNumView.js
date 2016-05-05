var SpecialNumView = cc.Node.extend("SpecialNumView",{
    ctor:function()
    {
        this._super()
        this._nums = { }
        this._num = -1
        this._forcelen = -1
        this._root = new cc.Node()
        this.addChild(this._root)
        this._max_num = 9
        // ×î¶à´æ9Î»
    },

    init:function(num, forcelen)
    {
        this._num = num
        this._forcelen = forcelen || -1
        var numStr = ""+num
        var length = numStr.length
        if(this._forcelen > 0 && length < this._forcelen )
        {
            for(var i = 0;i<this._forcelen - length;++i)
            {
                numStr = "0" + numStr
            }
            length = string.len(numStr)
        }
        var p = new cc.Sprite("image/nums/10_0.png")
        var size = p.getContentSize()
        for(var i = length-1;i>=0;--i )
        {
            var str_num = numStr[i]
            var str_one = "image/nums/10_" + str_num + ".png"
            var x =(i - 1) * size.width -(i - 1) * 6
            var top_one = new cc.Sprite(str_one, cc.rect(0, 0, size.width, size.height / 2))
            top_one.setPosition(cc.p(x, 0))
            top_one.setAnchorPoint(cc.p(0.5, 0))
            var bottom_one = new cc.Sprite(str_one, cc.rect(0, size.height / 2, size.width, size.height / 2))
            bottom_one.setPosition(cc.p(x, 0))
            bottom_one.setAnchorPoint(cc.p(0.5, 1))
            this._root.addChild(top_one, 0)
            this._root.addChild(bottom_one, 0)
            this._nums[this._max_num -(length - i)] =
            {
                top_sp : top_one,
                bottom_sp : bottom_one,
                str : str_num
            }
        }
    },

    changeTo:function(num)
    {
        if(num == this._num )
        {
            return
        }
        this._num = num
        var numStr = ""+this._num
        var length = numStr.length
        if(this._forcelen > 0 && length < this._forcelen )
        {
            for(var i = 0;i<this._forcelen - length;++i)
            {
                numStr = "0" + numStr
            }
            length = numStr.length
        }
        var p = new cc.Sprite("image/nums/10_0.png")
        var size = p.getContentSize()
        for(var i = length-1; i>=0; --i)
        {
            var str_num = numStr[i]
            var pre = this._nums[this._max_num -(length - i)]
            this._changeOne(str_num, pre, size,i)
        }
    },
    _changeOne: function (str_num, pre, size,i)
    {
        var self = this
        if (pre && pre.str != str_num)
        {
            var str_one = "image/nums/10_" + str_num + ".png"
            var x = (i - 1) * size.width - (i - 1) * 7
            var top_one = new cc.Sprite(str_one, cc.rect(0, 0, size.width, size.height / 2))
            top_one.setPosition(cc.p(x, 0))
            top_one.setAnchorPoint(cc.p(0.5, 0))
            var bottom_one = new cc.Sprite(str_one, cc.rect(0, size.height / 2, size.width, size.height / 2))
            bottom_one.setPosition(cc.p(x, 0))
            bottom_one.setAnchorPoint(cc.p(0.5, 1))
            this._root.addChild(top_one, pre.top_sp.getZOrder() - 1)
            this._root.addChild(bottom_one, pre.bottom_sp.getZOrder() + 1)
            bottom_one.setScaleY(0)
            var action = cc.sequence(
                cc.scaleTo(0.3, 1, 0),
                cc.callFunc(function ()
                {
                    var newAction = cc.sequence(
                        cc.scaleTo(0.2, 1, 1),
                        cc.callFunc(function ()
                        {
                            pre.bottom_sp.removeFromParent()
                            pre.bottom_sp = bottom_one
                        })
                    )
                    bottom_one.runAction(newAction)
                    pre.top_sp.removeFromParent()
                    pre.top_sp = null
                    pre.top_sp = top_one
                })
            )
            pre.top_sp.runAction(action)
            pre.str = str_num
        }
        else if (!pre)
        {
            var str_one = "image/nums/10_" + str_num + ".png"
            var x = (i - 1) * size.width - (i - 1) * 7
            var top_one = new cc.Sprite(str_one, cc.rect(0, 0, size.width, size.height / 2))
            top_one: setPosition(cc.p(x, 0))
            top_one: setAnchorPoint(cc.p(0.5, 0))
            var bottom_one = new cc.Sprite(str_one, cc.rect(0, size.height / 2, size.width, size.height / 2))
            bottom_one: setPosition(cc.p(x, 0))
            bottom_one: setAnchorPoint(cc.p(0.5, 1))
            this._root.addChild(top_one)
            this._root.addChild(bottom_one)
        }
    }
})