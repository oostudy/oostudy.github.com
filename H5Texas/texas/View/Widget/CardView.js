_GFirst = 1
var CardView = cc.Node.extend("CardView",{
    //14,2-13,其中14位A，而0、1、2、3 = 黑、红、梅、方
    //例如{0,14}代表黑桃A
    ctor:function(card)
    {
        this._super()
        if( !card || card.length!=2)
        {
            return
        }
        this._spCard = new cc.Sprite("image/card/"+card[0]+card[1]+".png")
        this.addChild(this._spCard,1)
        this._spCard.setPosition(cc.p(-20,35))
        this._spCard.pos=cc.p(-20,35)
        this._spFrame = new cc.Sprite("image/card/frame.png")
        this.addChild(this._spFrame,2)
        this._spFrame.setPosition(cc.p(-20,35))
        this._spFrame.setVisible(false)
        this._card = card
    },

    showFrame:function(isShow)
    {
        isShow = isShow || false
        if( !this._spFrame)
        {
            return
        }
        this._spFrame.setVisible(isShow)
    },

    getCard:function()
    {
        return this._card
    },

    doTurn:function(delayTime)
    {
        var self = this
        if(!this._spCard)
        {
            return
        }
        delayTime = delayTime || 0
        this.setVisible(false)
        var sp = new cc.Sprite("image/room/back.png")
        this.getParent().addChild(sp, 1000000)
        sp.setVisible(false)
        var pos = this.getPosition()
        sp.setScale(0.8)
        var action = cc.sequence(
            cc.delayTime(delayTime),
            cc.show(),
            cc.spawn(
                cc.moveTo(0.3, pos).easing(cc.easeExponentialOut()),
                cc.rotateBy(0.3,360)
            ),
            cc.callFunc( function()
            {
                sp.removeFromParent()
                if (self._spCard)
                {
                    self._spCard.setScaleX(0)
                    self.setVisible(true)
                    self._spCard.runAction(cc.scaleTo(0.07, 1, 1))
                }
            } )
        )
        sp.setPosition(cc.p(568, 424))
        sp.runAction(action)
    },
    shake:function()
    {
        if(!this._spCard)
        {
            return
        }
        var x = this._spCard.pos.x
        var y = this._spCard.pos.y
        var left=cc.moveTo(0.07,cc.p(x-6,y+2))
        var right=cc.moveTo(0.07,cc.p(x+6,y-2))
        var action = null
        if(_GFirst%2==1)
        {
            action = cc.sequence(left,right)
        }
        else
        {
            action = cc.sequence(right,left)
        }
        action = cc.repeatForever(action)
        this._spCard.stopAllActions()
        this._spCard.runAction(action)
        _GFirst=_GFirst+1
    },


    stopShake:function()
    {
        this._spCard.stopAllActions()
        if(this._spCard.pos)
        {
            this._spCard.setPosition(this._spCard.pos)
        }
    }
})