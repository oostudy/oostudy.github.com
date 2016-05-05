
var AnimationChipView = cc.Node.extend("AnimationChipView", {

    ctor: function (chip, pos, delayTime, rv, any)
    {
        this._super()
        if(chip)
        {
            this.goto_pos(chip, pos, delayTime, rv, any)
        }
    },

    goto_pos:function(chip, pos, delayTime, rv, any)
    {
        var self = this
        if(!chip || chip <= 0)
        {
            self:removeFromParent()
            return false
        }
        any = any || false
        delayTime = delayTime || 0

        var action = cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc( function()
            {
                self._do(chip, pos, rv, any)
            } )
        )
        this.runAction(action)
        return true
    },

    _do:function(chip, pos, rv, any)
    {
        var self = this
        this._refresh("",chip, any)
        if( rv )
        {
            if(! rv.doWin)
            {
                this.removeFromParent()
                return
            }
            rv.doWin(chip)
        }
        if(!this._chips)
        {
            this.removeFromParent()
            return
        }
        var x, y = this.getPosition()
        core.foreach(this._chips,function(index, spChip)
        {
            var action = cc.sequence(
                cc.moveTo(index * 0.1, cc.pSub(pos, cc.p(x, y))).easing(cc.easeExponentialOut()),
                cc.hide())
            spChip.runAction(action)
        })
        var action = cc.sequence(
            cc.delayTime(0.7),
            cc.callFunc(function(){
                self.removeFromParent()
            })
        )
        this.runAction(action)
    },

    _refresh:function(pre,chip, any)
    {
        var self = this
        pre = pre || ""
        pre = "image/chip/"+pre
        any = any || false
        this.removeAllChildren()
        this._chips = []
        if(any == true)
        {
            for(var i=1;i<=2;++i)
            {
                var sp = new cc.Sprite(pre+"black.png")
                sp.path = pre+"black.png"
                this.addChild(sp)
                this._chips.push(sp)
            }

            for(var i=3;i<=4;++i)
            {
                var sp = new cc.Sprite(pre+"orrange.png")
                sp.path = pre+"orrange.png"
                this.addChild(sp)
                this._chips.push(sp)
            }

            for(var i=5;i<=6;++i)
            {
                var sp = new cc.Sprite(pre+"green.png")
                sp.path = pre+"green.png"
                this.addChild(sp)
                this._chips.push(sp)
            }
            return
        }
        if( chip < 10 )
        {
            var sp = new cc.Sprite(pre+"green.png")
            sp.path = pre+"green.png"
            this.addChild(sp)
            this._chips.push(sp)
        }
        var offsetY = 0
        var step = 1
        var yellow = Math.floor(chip / 1000000)
        chip = chip % 1000000
        for(var i = 1;i<= yellow;++i)
        {
            var sp = new cc.Sprite(pre+"orrange.png")
            sp.path = pre+"orrange.png"
            this.addChild(sp)
            this._chips.push(sp)
            sp:setPositionY(offsetY)
            offsetY = offsetY + step
            if(offsetY >= step * 5)
            {
                return
            }
        }
        var purple = Math.floor(chip / 100000)
        chip = chip % 100000
        for(var i = 1;i<=purple;++i)
        {
            var sp = new cc.Sprite(pre+"purple.png")
            sp.path = pre+"purple.png"
            this.addChild(sp)
            self._chips.push(sp)
            sp.setPositionY(offsetY)
            offsetY = offsetY + step
            if(offsetY >= step * 5)
            {
                return
            }
        }
        var black = Math.floor(chip / 10000)
        chip = chip % 10000
        for(var i = 1;i<=black;++i)
        {
            var sp = new cc.Sprite(pre+"black.png")
            sp.path = pre+"black.png"
            this.addChild(sp)
            this._chips.push(sp)
            sp.setPositionY(offsetY)
            offsetY = offsetY + step
            if(offsetY >= step * 5)
            {
                return
            }
        }
        var blue = Math.floor(chip / 1000)
        chip = chip % 1000
        for(var i = 1;i<=blue;++i)
        {
            var sp = new cc.Sprite(pre+"blue.png")
            sp.path = pre+"blue.png"
            this.addChild(sp)
            this._chips.push(sp)
            sp.setPositionY(offsetY)
            offsetY = offsetY + step
            if(offsetY >= step * 5)
            {
                return
            }
        }
        var red = Math.floor(chip / 100)
        chip = chip % 100
        for(var i = 1;i<=red;++i)
        {
            var sp = new cc.Sprite(pre+"red.png")
            sp.path = pre+"red.png"
            this.addChild(sp)
            this._chips.push(sp)
            sp.setPositionY(offsetY)
            offsetY = offsetY + 5
            if(offsetY >= step * 5)
            {
                return
            }
        }
        var green = Math.floor(chip / 10)
        for(var i = 1;i<=green;++i)
        {
            var sp = new cc.Sprite(pre+"green.png")
            sp.path = pre+"green.png"
            this.addChild(sp)
            this._chips.push(sp)
            sp.setPositionY(offsetY)
            offsetY = offsetY + step
            if(offsetY >= step * 5)
            {
                return
            }
        }
    },

    goto_center:function(rv, chipHeapView, delayTime)
    {
        var self = this
        if( !rv || rv.getRoundChip() <= 0 )
        {
            this.removeFromParent()
            return false
        }
        var p = cc.pAdd(rv._chipNode.getChipPos(), rv.getPosition())
        this.setPosition(p)
        var chip = rv.getRoundChip()
        delayTime = delayTime || 0
        if(delayTime>0)
        {
            var action = cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc( function()
                {
                    rv.refreshRoundChip(0)
                    self._do_center(chip, chipHeapView)
                } )
            )
            this.runAction(action)
        }
        else
        {
            rv.refreshRoundChip(0)
            return this._do_center(chip, chipHeapView)
        }
        return true
    },

    _do_center:function(chip, chipHeapView)
    {
        var self = this
        this._refresh("big_",chip)
        if(!self._chips || !chip || !chipHeapView)
        {
            self.removeFromParent()
            return false
        }
        var x, y = this.getPosition()
        core.foreach(this._chips,function(index,spChip)
        {
            var pos = chipHeapView.getRandomPos()
            var posl = self.getPosition()
            var posp = chipHeapView.getParent().getPosition()
            var posc = chipHeapView.getPosition()
            var tx = posp.x + posc.x - posl.x + pos[0]
            var ty = posp.y + posc.y - posl.y + pos[1]
            spChip.setScale(0.58)
            var action = cc.sequence(
                    cc.moveTo(1, cc.p(tx, ty)).easing(cc.easeExponentialOut()),
                    cc.callFunc( function(){
                        chipHeapView.addRandomChipPath(spChip.path, pos)
                    } ),
                    cc.hide()
                )
            spChip.runAction(action)
        })
        var action = cc.sequence(
                cc.delayTime(1.5),
                cc.callFunc(function(){
                    self.removeFromParent()
                })
            )
        self.runAction(action)
        return true
    }
})