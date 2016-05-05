GWin_Ani=null
var RoleView = cc.Node.extend("RoleView", {
    /*
        #通知桌子当前的最新状态信息
        .SeatInfo {
	        seat_index 0 : integer #座位号
	        state 1 : integer #座位状态
	        rid 2 : integer   #rid
	        chips 3 : integer #玩家拥有的筹码
	        bet_chips 4 : integer  #玩家已下筹码
	        is_tuoguan 5 : boolean #玩家是否托管
	        sng_rank 6 : integer   #玩家SNG的排名
        }
        #桌上玩家的基础数据信息
        .TablePlayerInfo {
	        rid 0 : integer
	        rolename 1 : string
	        logo 2 : string
	        sex 3 : integer
        }
    */
    ctor:function(seat,info)
    {
        this._super()
        this._seat_index = seat.seat_index
        this._sex = info.sex || 1
        this._name = info.rolename || "default"
        this._avatar = info.logo || "1"
        this._showIndex = seat.showIndex || this._seat_index
        this._rid = seat.rid
        this._chip = seat.chips
        
        this._is_auto = seat.is_tuoguan

        this._light = new cc.Sprite("image/room/light2.png")
        this.addChild(this._light, -2)

        this._light.setOpacity(0)
        if(this.checkIsSelf())
        {
            this._light.setPosition(cc.p(0, 90))
        }
        else
        {
            this._light.setScale(0.875)
            this._light.setPosition(cc.p(0, 50))
        }
        this._winbg = new cc.Sprite("image/room/win_bg.png")
        this.addChild(this._winbg, -1)
        this._winbg.setVisible(false)

        this._bg_light = new cc.Sprite("image/room/bg_light.png")
        this._bg_light.setVisible(false)
        this.addChild(this._bg_light, -1)
        var scaleTo
        var scaleBack
        if (this.checkIsSelf())
        {
            scaleTo = cc.ScaleTo.create(1.5, 1, 1)
            scaleBack = cc.ScaleTo.create(1.5, 0.8, 0.8)
        }
        else
        {
            scaleTo = cc.ScaleTo.create(1.5, 0.875, 0.875)
            scaleBack = cc.ScaleTo.create(1.5, 0.7, 0.7)
        }
        var seqAction = cc.Sequence.create(scaleTo, scaleBack)
        var action = cc.RepeatForever.create(seqAction)
        this._bg_light.runAction(action)
        this._avatar_shadow = new cc.Sprite("image/room/default_avatar_shadow.png")
        this.addChild(this._avatar_shadow, 0)
        this._sp_avatar = this.createAvatarSprite()
        this.addChild(this._sp_avatar, 1)

        if (!this.checkIsSelf())
        {
            this._title = new cc.LabelTTF(this._name, "fonts/dream.ttf",18)
            this.addChild(this._title, 100)
            this._title.setAnchorPoint(cc.p(0.5, 0.5))
            this._title.setPosition(cc.p(0, 50))
            this._title.enableStroke(new cc.Color(0, 0, 0, 153), 1);
            this._spTitle = new cc.Sprite()
            this.addChild(this._spTitle, 2)
            this._spTitle.setPosition(cc.p(0, 45))
            this._spTitle.setVisible(false)
        }

        this._sp_chip_bg = new cc.Sprite("image/room/total_bg.png")
        this.addChild(this._sp_chip_bg, 1)
        this._lbl_chip = new cc.LabelTTF(GHelper.convertChipNumToStr(this._chip), "fonts/AGENCYB.TTF",22)
        this._lbl_chip.setFontFillColor(new cc.Color(21, 29, 32))
        this.addChild(this._lbl_chip, 2)
        this._lbl_chip.setAnchorPoint(cc.p(0, 0.5))
        if (!this.checkIsSelf())
        {
            this._sp_chip_bg.setPosition(cc.p(1, -50))
            this._lbl_chip.setPosition(cc.p(-18, -50))
        }
        else
        {
            this._sp_chip_bg.setPosition(cc.p(1, -53))
            this._lbl_chip.setPosition(cc.p(-18, -53))
        }
        var sp1 = new cc.Sprite("image/room/back.png")
        var sp2 = new cc.Sprite("image/room/back.png")
        this._cardBacks =
        [
            sp1,
            sp2
        ]
        sp1.setRotation(-7)
        sp2.setRotation(10)

        this._cardNode = new cc.Node()
        this.addChild(this._cardNode, 5)

        this._cardNode.addChild(sp1, 5)
        this._cardNode.addChild(sp2, 6)

        sp1.setVisible(false)
        sp2.setVisible(false)

        this._chipNode = new ChipView(0)
        this.addChild(this._chipNode)

        this._autoDo = false

        this._isGiveUp = false
        this._isAllIn = false
        this._isSmallBlind = false
        this._isBigBlind = false

        this.setShowIndex(this._showIndex)

        if (this.checkIsSelf())
        {
            this._cardTypeNode = new cc.Node()
            this.addChild(this._cardTypeNode, 20)
            var bg = new cc.Sprite("image/room/card_type_bg.png")
            this._cardTypeNode.addChild(bg, 0)
            var ttfConfig = { }
            ttfConfig.fontFilePath = 
            ttfConfig.fontSize = 22
            this._lbl_cardtype = new cc.LabelTTF("","fonts/dream.ttf", 22)
            this._lbl_cardtype.enableStroke(new cc.Color(21, 29, 32), 2);
            this._cardTypeNode.addChild(this._lbl_cardtype)
            this._cardTypeNode.setVisible(false)
            this._cardTypeNode.setPosition(cc.p(-45, 64))
        }
        else
        {
            this._sp_avatar.setScale(0.875)
            this._avatar_shadow.setScale(0.875)
        }
        if(this._is_auto)
        {
            this.onTuoguan(this._is_auto)
        }
        this._round_chip = 0
    },
    isStandUp:function()
    {
        return false
    },
    isGiveUp:function()
    {
        return this._isGiveUp
    },
    checkIsSelf:function()
    {
        return this._rid == GPage_Room.rid
    },
    onTuoguan:function()
    {

    },
    setShowIndex:function(index)
    {
        index = index || 0
        this._showIndex = index
        
        if (this._cardBacks)
        {
            if (this._showIndex == 1 || this._showIndex == 2)
            {
                if (this._cardBacks[0])
                {
                    var pos = cc.p(-74, -11)
                    this._cardBacks[0].setPosition(pos)
                }
                if (this._cardBacks[1])
                {
                    var pos = cc.p(-65, -11)
                    this._cardBacks[1].setPosition(pos)
                }
                this._chipNode.setPosition(cc.p(-12, -80))
            }
            else if (this._showIndex == 3 || this._showIndex == 4)
            {
                if (this._cardBacks[0])
                {
                    var pos = cc.p(-74, -11)
                    this._cardBacks[0].setPosition(pos)
                }
                if (this._cardBacks[1])
                {
                    var pos = cc.p(-65, -11)
                    this._cardBacks[1].setPosition(pos)
                }
                this._chipNode.setPosition(cc.p(-93, 32))
            }
            else if (this._showIndex == 5)
            {
                if (this.checkIsSelf())
                {
                    if (this._cardBacks[0])
                    {
                        this._cardBacks[0].setRotation(-10)
                        this._cardBacks[0].setPosition(cc.p(-50, 89))
                    }
                    if (this._cardBacks[1])
                    {
                        this._cardBacks[1].setRotation(10)
                        this._cardBacks[1].setPosition(cc.p(-5, 84))
                    }
                    this._chipNode.setPosition(cc.p(63, 140))
                }
                else
                {
                    if (this._cardBacks[0])
                    {
                        var pos = cc.p(-74, -11)
                        this._cardBacks[0].setPosition(pos)
                    }
                    if (this._cardBacks[1])
                    {
                        var pos = cc.p(-65, -11)
                        this._cardBacks[1].setPosition(pos)
                    }
                    this._chipNode.setPosition(cc.p(-93, 32))
                }
            }
            else if (this._showIndex == 6 || this._showIndex == 7)
            {
                if (this._cardBacks[0])
                {
                    var pos = cc.p(65, -11)
                    this._cardBacks[0].setPosition(pos)
                }
                if (this._cardBacks[1])
                {
                    var pos = cc.p(74, -11)
                    this._cardBacks[1].setPosition(pos)
                }
                this._chipNode.setPosition(cc.p(68, 32))
            }
            else if (this._showIndex == 8 || this._showIndex == 9)
            {
                if (this._cardBacks[0])
                {
                    var pos = cc.p(65, -11)
                    this._cardBacks[0].setPosition(pos)
                }
                if (this._cardBacks[1])
                {
                    var pos = cc.p(74, -11)
                    this._cardBacks[1].setPosition(pos)
                }
                this._chipNode.setPosition(cc.p(-12, -80))
            }
        }
        var rotations = [ - 134.78, - 116.60, - 85.18, - 62.26, 0, 59.85, 83.09, 114.66, 136.68 ]
        var pos =
        [
            cc.p(-20,- 10),
            cc.p(-20,- 15),
            cc.p(-20,5),
            cc.p(-10,10),
            cc.p(0,- 10),
            cc.p(30,20),
            cc.p(25,0),
            cc.p(20,- 15),
            cc.p(10,- 10),
        ]
        this._light.setRotation(rotations[this._showIndex-1])
        this._light.setPosition(pos[this._showIndex-1])
    },
    createAvatarSprite:function()
    {
        self = this
        var len = self._avatar.length
        // 系统默认头像
        if (len < 3) {
            return new cc.Sprite("image/avatar/" + self._avatar + ".png")
        } else {
            return new cc.Sprite("http://7xpkh2.com2.z0.glb.qiniucdn.com/" + self._avatar)
        }
        return new cc.Sprite("image/avatar/1.png")
    },
    refreshRoundChip:function(chip)
    {
        this._round_chip = chip
        this._chipNode.refresh(this._round_chip)
    },
    getRoundChip:function()
    {
        return this._round_chip
    },
    getCards:function()
    {
        return this._cards
    },
    showHoleCards:function(cards)
    {
        if (cards == null) {
            return
        }
        this._cards = cards
        if(this.checkIsSelf())
        {
            this._cardNode.removeFromParent()
            this._cardNode = new cc.Node()
            this.addChild(this._cardNode, 5)
            this._cardBacks[0] = new CardView(this._cards[0])
            this._cardBacks[1] = new CardView(this._cards[1])
            this._cardNode.addChild(this._cardBacks[0], 5)
            this._cardNode.addChild(this._cardBacks[1], 6)
            this._cardBacks[0].setRotation(-10)
            this._cardBacks[1].setRotation(10)

            this._cardBacks[0].setRotation(-10)
            this._cardBacks[0].setPosition(cc.p(-50, 89))
            this._cardBacks[1].setRotation(10)
            this._cardBacks[1].setPosition(cc.p(-5, 84))
        }
        else
        {
            if(this._cardBacks[0])
            {
                this._cardBacks[0].removeFromParent()
            }
            if(this._cardBacks[1])
            {
                this._cardBacks[1].removeFromParent()
            }
            this._cardBacks[0] = new cc.Sprite("image/room/back.png")
            this._cardBacks[1] = new cc.Sprite("image/room/back.png")

            this._cardBacks[0].setRotation(-7)
            this._cardBacks[1].setRotation(10)
            this._cardNode.addChild(this._cardBacks[0], 5)
            this._cardNode.addChild(this._cardBacks[1], 6)
        }
        this.setShowIndex(this._showIndex)
        this._cardBacks[0].setVisible(false)
        this._cardBacks[1].setVisible(false)
    },
    forceShowHoleCards:function(cards)
    {
        if (cards == null)
        {
            return 
        }
        self = this
        self._cards = cards
        if (self._cardBacks[0])
        {
            self._cardBacks[0].removeFromParent()
        }
        if (self._cardBacks[1])
        {
            self._cardBacks[1].removeFromParent()
        }
        self._cardBacks[0] = new CardView(self._cards[0])
        self._cardBacks[0].setScale(0.8)
        self._cardBacks[1] = new CardView(self._cards[1])
        self._cardBacks[1].setScale(0.8)
        if (self._showIndex == 1)
        {
            self._cardBacks[0].setPosition(cc.p(-95, -50))
            self._cardBacks[1].setPosition(cc.p(-50, -50))
        }
        else if (self._showIndex == 9)
        {
            self._cardBacks[0].setPosition(cc.p(85, -50))
            self._cardBacks[1].setPosition(cc.p(130, -50))
        }
        else if (self._showIndex == 3 || self._showIndex == 4)
        {
            self._cardBacks[0].setPosition(cc.p(-110, -50))
            self._cardBacks[1].setPosition(cc.p(-65, -50))
        }
        else if (self._showIndex == 2 || self._showIndex == 8)
        {
            self._cardBacks[0].setPosition(cc.p(-5, -120))
            self._cardBacks[1].setPosition(cc.p(40, -120))
        }
        else if (self._showIndex == 6 || self._showIndex == 7)
        {
            self._cardBacks[0].setPosition(cc.p(100, -50))
            self._cardBacks[1].setPosition(cc.p(145, -50))
        }
        else if (self._showIndex == 5)
        {
            self._cardBacks[0].setPosition(cc.p(-5, 80))
            self._cardBacks[1].setPosition(cc.p(40, 80))
        }

        self._cardNode.addChild(self._cardBacks[0], 5)
        self._cardNode.addChild(self._cardBacks[1], 6)
        //this:showQuickCardType()
        return true
    },
    doPreChip:function(preChip,chips)
    {
        this._chip = chips
        this._chipNode.refresh(preChip)
        this._lbl_chip.setString(chips)
        this._round_chip = preChip
    },
    doBlind:function(chip,chips)
    {
        this._chip = chips
        this._chipNode.refresh(chip)
        this._lbl_chip.setString(chips)
        this._round_chip += chip
    },
    addOneCard:function()
    {
        if(this._cardBacks.length < 2)
        {
            if(!this.checkIsSelf())
            {
                //this.refreshCards(true)
            }
        }
        if(this._cardBacks.length < 2)
        {
            return
        }
        if(this._cardBacks[0].isVisible())
        {
            this._cardBacks[1].setVisible(true)
        }
        else
        {
            this._cardBacks[0].setVisible(true)
        }
    },
    onDoBegin:function(timeout)
    {
        var self = this
        this._avatar_shadow.setTexture("image/room/avatar_shadow.png")
        this._bg_light.setVisible(true)
        var time = 15//timeout

        if(this._cd)
        {
            this._cd.removeFromParent()
            this._cd = null
        }

        this._cd = new SpecialNumView()
        time = Math.floor(time)
        if(time <= 99)
        {
            if(time <= 1)
            {
                this._cd.init(0, 2)
            }
            else
            {
                this._cd.init(time - 1, 2)
            }
        }
        else
        {
            this._cd.init(99, 2)
        }
        var action = cc.sequence(
            cc.delayTime(1),
            cc.callFunc( function()
            {
                --time
                if(time <= 0)
                {
                    self._cd.stopAllActions()
                    return
                }
                if(time <= 99)
                {
                    self._cd.changeTo(time - 1)
                }
                else
                {
                    self._cd.changeTo(99)
                }
                if(time == 7)
                {
                    self.shake()
                }
                if(time <= 1)
                {
                    self._cd.stopAllActions()
                }
            } )
        )
        if(time <= 7)
        {
            this.shake()
        }
        this.addChild(this._cd, 10)
        this._cd.runAction(action.repeatForever())
        if(!this.checkIsSelf())
        {
            this._cd.setScale(0.875)
            this._cd.setPosition(cc.p(-17.5+35, -1))
        }
        else
        {
            this._cd.setPosition(cc.p(-19.5+40, -1))
        }
        if(!this.checkIsSelf())
        {
            this._title.setVisible(true)
            this._spTitle.setVisible(false)
        }
            
        this._light.stopAllActions()
        this._light.runAction(cc.fadeTo(0.3, 255))
    },
    onDoEnd:function()
    {
        this.stopShake()
        if(this._cd)
        {
            this._cd.removeFromParent()
            this._cd = null
        }
        this._light.runAction(cc.fadeTo(0.3, 0));
        this._bg_light.setVisible(false)
    },
    shake:function()
    {

    },
    stopShake: function ()
    {

    },
    doBet:function(round_chip,chip)
    {
        if(!this.checkIsSelf())
        {
            this._title.setVisible(false)
            this._spTitle.setVisible(true)
            this._spTitle.setTexture("image/room/bet.png")
        }
        this._chip = chip
        this._chipNode.refresh(round_chip)
        this._lbl_chip.setString(chip)
        this._round_chip = round_chip
        this.onDoEnd()
    },
    doFollow:function(round_chip,chip)
    {
        if (!this.checkIsSelf())
        {
            this._title.setVisible(false)
            this._spTitle.setVisible(true)
            this._spTitle.setTexture("image/room/follow.png")
        }
        this._chip = chip
        this._chipNode.refresh(round_chip)
        this._lbl_chip.setString(chip)
        this._round_chip = round_chip
        this.onDoEnd()
    },
    doCheck:function()
    {
        if (!this.checkIsSelf())
        {
            this._title.setVisible(false)
            this._spTitle.setVisible(true)
            this._spTitle.setTexture("image/room/check.png")
        }
        this.onDoEnd()
    },
    doGiveUP:function()
    {
        if (!this.checkIsSelf())
        {
            this._title.setVisible(false)
            this._spTitle.setVisible(true)
            this._spTitle.setTexture("image/room/giveup.png")
        }
        this.onDoEnd()
    },
    doRaise:function(round_chip,chip)
    {
        if (!this.checkIsSelf())
        {
            this._title.setVisible(false)
            this._spTitle.setVisible(true)
            this._spTitle.setTexture("image/room/more.png")
        }
        this._chip = chip
        this._chipNode.refresh(round_chip)
        this._lbl_chip.setString(chip)
        this._round_chip = round_chip
        this.onDoEnd()
    },
    doAllIn: function (round_chip)
    {
        if (!this.checkIsSelf())
        {
            this._title.setVisible(false)
            this._spTitle.setVisible(true)
            this._spTitle.setTexture("image/room/all_in.png")
        }
        this._chip = 0
        this._chipNode.refresh(round_chip)
        this._lbl_chip.setString(0)
        this._round_chip = round_chip
        this.onDoEnd()
    },
    onRoundEnd:function()
    {
        this._chipNode.refresh(0)
        if(this._sp_title)
        {
            this._sp_title.setVisible(false)
        }
        if (this._lbl_title)
        {
            this._lbl_title.setVisible(true)
        }
    },
    doEnd:function(cards)
    {
        if(!this.checkIsSelf())
        {
            this._title.setString(this._name)
            this._title.setVisible(true)
            this._spTitle.setVisible(false)
        }
        this._chipNode.setVisible(false)
        this.forceShowHoleCards(cards)
        if(this._cd)
        {
            this._cd.removeFromParent()
            this._cd = null
        }
    },
    /*
    10皇家同花顺
    9同花顺
    8四条
    7满堂彩（葫芦）
    6同花
    5顺子
    4三条
    3两对
    2一对
    1单牌
    */
    getCardEnd:function()
    {
        var cards = []
        core.foreach(this._cards,function(index,card)
        {
            cards.push(card)
        })
        if(cards.length!=2)
        {
            return [ - 1 ]
        }
        var fivecards = GPage_Room.getCards()
        core.foreach(fivecards,function(index,card)
        {
            cards.push(card)
        })
        return GCardTool.getCardEnd(cards)
    },
    doWin:function(chip)
    {
        if(this._cd)
        {
            this._cd.removeFromParent()
            this._cd = null
        }
        if(!chip || chip <= 0)
        {
            return
        }
        if(this.isStandUp() == true)
        {
            return
        }

        this._winchip = this._winchip || 0
        this._winchip = this._winchip + chip

        if(!this._lbl_winchip)
        {
            this._lbl_winchip = new cc.LabelTTF(0,"fonts/AGENCYB.TTF",30)
            this._lbl_winchip.enableStroke(new cc.Color(0, 0, 0, 153), 1)
            this._lbl_winchip.setColor(new cc.Color(255, 255, 255))
            this.addChild(this._lbl_winchip, 1000000000)

            this._lbl_winchip.setAnchorPoint(cc.p(0.5, 0.5))
        }
        this._lbl_winchip.setPositionY(0)
        this._lbl_winchip.stopAllActions()
        this._lbl_winchip.setString(chip)
        if(this._showIndex == 1 || this._showIndex == 9)
        {
            this._lbl_winchip.runAction(cc.moveTo(1, cc.p(0, 20)))
        }
        else
        {
            this._lbl_winchip.runAction(cc.moveTo(1, cc.p(0, 95)))
        }

        this._lbl_chip.setString(GHelper.convertChipNumToStr(this._chip + this._winchip))
        var fiveCards = GPage_Room.getCards()

        if(GWin_Ani && GWin_Ani.aaa)
        {
            GWin_Ani:removeFromParent()
        }
        GWin_Ani = null
        ccs.armatureDataManager.addArmatureFileInfo("animation/paizhuoshengli/paizhuoshengli.json")
        GWin_Ani = new ccs.Armature("paizhuoshengli")
        var end_code = -1
        var endResult = this.getCardEnd(fiveCards)
        if(endResult)
        {
            end_code = endResult[0]
        }
        GWin_Ani.aaa = 1
        var end_bone = GWin_Ani.getBone("end")
        if(end_code > 0)
        {
            end_bone.addDisplay(new cc.Sprite("image/room/" + end_code + ".png"), 0)
        }
        else
        {
            end_bone.addDisplay(new cc.Sprite("image/alpha.png"), 0)
        }
        GWin_Ani.getAnimation().setFrameEventCallFunc( function(bone, evt, originFrameIndex, currentFrameIndex)
        {
            if(evt == "end")
            {
                GWin_Ani.getAnimation().play("xunhuan")
            }
        } )
        GWin_Ani.getAnimation().play("ks")
        this.addChild(GWin_Ani, 99)
    }
})