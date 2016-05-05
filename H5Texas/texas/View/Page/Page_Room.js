GPage_Room = null
GRoomSeats = []
var Page_Room = BasePage.extend("Page_Room", {
    _node_roles: [],
    _role_views: {},
    _btn_Seats:[],
    ctor: function ()
    {
        this._super()
        GPage_Room = this
        this.rid = this.getQueryString("rid")
    },
    onOpen: function (params)
    {
        this._super();
        this._dy_node = this._getWidget("topNode/dy_node")
        this._node_roles = this._getWidget("node_roles")
        for(var i = 0;i<9;++i)
        {
            this._btn_Seats.push(this._getWidget("node_seat/btn_Seat" + (i + 1)))
            this._btn_Seats[i].setVisible(false)
            this._btn_Seats[i].seat_index = i
            GRoomSeats.push(this._btn_Seats[i].getPosition())
        }
        this._totalChip = new cc.Node()
        this.addChild(this._totalChip, 10000)
        this._totalChip.setPosition(568, 400)

        this._randomHeap = new RandomHeapView(0)
        this._randomHeap.setPositionY(34)
        this._totalChip.addChild(this._randomHeap, 1)
        this._total_chip = 0
        GServerMonitor.init()
    },
    /*
        .GameInfo {
            #桌子配置信息
            table_id 0 : integer
            table_room_type 1 : integer
            small_blinds 2 : integer
            big_blinds 3 : integer
            max_player_num 4 : integer #桌子座位数
            min_carry 5 : integer
            max_carry 6 : integer
            table_name 7 : string    	
            prop_price 8 : integer

        #桌子的状态信息
            table_state 9 : integer
            button_index 10 : integer	#庄家位置
            small_blinds_index 11 : integer #小盲注位置
            small_blinds_num 12 : integer   #小盲注筹码
            big_blinds_index 13 : integer   #大盲注位置
            big_blinds_num 14 : integer     #大盲注筹码
            community_cards 15 : *integer   #公共牌
            action_index 16 : integer       #当前操作玩家的座位号
            action_timeout 17 : integer        #当前操作玩家到期时间
            round_count 31 : integer       #桌子的当前轮数

        #桌子座位信息
            seats 18 : *SeatInfo
        #桌位上玩家的信息
            tableplayerinfos 19 : *TablePlayerInfo(rid)
        #奖金池
            table_pots 20 : *TablePot
        #单桌游戏开始的最小人数
            min_player_num 21 : integer
            action_internal_time 22 : integer

        #比赛相关
            match_template_id 23 : integer  #比赛配置模本id
            match_start_time 24 : integer	#比赛开始时间
            match_state 25 : integer		#当前比赛状态
            match_instance_id 26 : string
            matchsvr_id 27 : string

            identify_code 28 : string      #朋友桌验证码
        }
        #通知游戏开始
        gamestart 16 {
            response {
                gameinfo 0 : GameInfo
            }
        }
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
    beginGame:function(jsonData)
    {
        this.creatRoles(jsonData.gameinfo.seats,jsonData.gameinfo.tableplayerinfos)
    },
    
    getQueryString:function (name)
    {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
    },
    creatRoles:function(seats,tableplayerinfos)
    {
        var self = this
        self.offset_seat = 0
        core.foreach(seats, function (index, seat) {
            if (seat.rid == 0)
            {
                return
            }
            if (seat.rid == self.rid)
            {
                self.offset_seat = 5 - seat.seat_index
            }
        })

        core.foreach(seats, function (index, seat) {
            if (seat.rid == 0)
            {
                return 
            }
            seat.showIndex = seat.seat_index + self.offset_seat
            if (seat.showIndex > 9)
            {
                seat.showIndex = seat.showIndex - 9
            }
            if (seat.showIndex < 1)
            {
                seat.showIndex = seat.showIndex + 9
            }
            
            var rv = new RoleView(seat, tableplayerinfos[seat.rid])
            self._node_roles.addChild(rv)
            var showIndex = self.offset_seat + seat.seat_index
            rv.setPosition(GRoomSeats[seat.showIndex - 1])
            self._role_views[seat.seat_index] = rv
            if (rv._rid == self.rid)
            {
                self._self_role_view = rv
            }
        })
        
        self.onPreChip(seats)
    },
    refreshTotalChip:function()
    {
        var rs = this.createNumNode(this._total_chip, 7, 4)
        this._allChipView = rs[0]
        var _w = rs[1]
        this._totalChip.addChild(this._allChipView, 1000000)
        this._allChipView.setPosition(cc.p(- _w / 2, 69))
    },
    createNumNode:function(num, numType, forcenum, offsetX)
    {
        //返回整数数字node，左对齐;,numType 图片种类,默认是0,1为小字体
        numType = numType || 0
        offsetX = offsetX || 0
        if(numType == 8 || numType == 9)
        {
            offsetX = -3
        }
        if(numType == 7 || numType == 11)
        {
            offsetX = -1.1
        }
        var numStr = ""+num
        var length = numStr.length
        if(forcenum && length < forcenum)
        {
            core.foreach(forcenum - length,function(i)
            {
                numStr = "0" + numStr
            })
            length = numStr.length
        }
        var node = new cc.Node()
        node.setAnchorPoint(cc.p(0.5, 0.5))
        var key = "image/nums/" + numType + "_"
        var width = 0
        var height = 0
        core.foreach(length, function (i)
        {
            var s = numStr[i]
            if(s == "/")
            {
                s = "X"
            }
            var sp = new cc.Sprite(key + s + ".png")
            node.addChild(sp)
            sp.setAnchorPoint(cc.p(0, 0.5))
            sp.setPosition(cc.p(width, 0))
            var size = sp.getContentSize()
            width = size.width + width + 2 * offsetX
            var h = size.height
            if (height < h)
            {
                height = h
            }
        })
        return [node, width, height]
    },
    //下前注
    onPreChip:function(seats)
    {
        var self = this
        core.foreach(seats, function (i, seat)
        {
            var rv = self._role_views[seat.seat_index]
            if (!rv || seat.bet_chips<=0)
            {
                return
            }
            self._total_chip += seat.bet_chips
            rv.doPreChip(seat.bet_chips, seat.chips)
            var aniChipView = new AnimationChipView()
            aniChipView.goto_center(rv, self._randomHeap, 1)
            self.addChild(aniChipView)
        })
        this.refreshTotalChip()
    },
    onBlindChip:function(seats)
    {
        var self = this
        core.foreach(seats, function (i, seat)
        {
            var rv = self._role_views[seat.seat_index]
            if (!rv)
            {
                return
            }
            self._total_chip += seat.bet_chips
            rv.doBlind(seat.bet_chips, seat.chips)
        })
        this.refreshTotalChip()
    },
    onHoleCard:function(cards)
    {
        this._self_role_view.showHoleCards(cards)
        this.dealCards()
    },
    onLightCard:function(cards)
    {
        var roleviews = this._role_views
        core.foreach(roleviews, function (seat_index, role) {
            if ( cards[seat_index] ) {
                role.forceShowHoleCards(cards[seat_index])
            }})
    },
    _dealCards:function(j,roleview,time)
    {
        var sp = new cc.Sprite("image/room/back.png")
        this._deal_cards.addChild(sp)
        sp.setVisible(false)
        sp.setScale(0.8)
        var index = this.offset_seat + j
        if (index > 9)
        {
            index = index - 9
        }
        if (index < 1)
        {
            index = index + 9
        }
        var targetPos = cc.p(GRoomSeats[index - 1].x, GRoomSeats[index - 1].y)
        var action = cc.sequence(
            cc.delayTime(time),
            cc.show(),
            cc.spawn(
                cc.moveTo(0.4, targetPos).easing(cc.easeExponentialOut()),
                cc.rotateBy(0.3, 360)
            ),
            cc.hide(),
            cc.callFunc(function ()
            {
                roleview.addOneCard()
                sp.removeFromParent()
            })
        )
        sp.setPosition(cc.p(568, 424))
        sp.runAction(action)
    },
    dealCards:function()
    {
        var self = this
        if(!this._deal_cards)
        {
            this._deal_cards = new cc.Node()
            this._dy_node.addChild(this._deal_cards, 1000000)
        }
        this._deal_cards.removeAllChildren()
        var k = 1
        for (var i = 0; i < 2; ++i)
        {
            for (var j = 1; j <= 9; ++j)
            {
                var rv = this._role_views[j]
                if (!rv)
                {
                    continue
                }
                this._dealCards(j,rv, (k - 1) * 0.15)
                k = k + 1
            }
        }
    },
    /*
        {
            "allow_actions" : [2,5,6,4],
            "bet_max"       : 195,
            "bet_min"       : 15,
            "call_num"      : 5,
            "cmd"           : "doaction",
            "rid"           : 2000180,
            "seat_index"    : 5,
            "timeout"       : 1458541790
        }
    */
    doAction: function (jsonData)
    {
        var rv = this._role_views[jsonData.seat_index]
        if (!rv)
        {
            return
        }
        rv.onDoBegin(jsonData.timeout)
    },
    /*
        GCommonConst.PLAYER_ACTION_BET    = 1 -- 押注
        GCommonConst.PLAYER_ACTION_CALL   = 2 -- 跟注
        GCommonConst.PLAYER_ACTION_CHECK  = 3 -- 看牌
        GCommonConst.PLAYER_ACTION_FOLD   = 4 -- 弃牌
        GCommonConst.PLAYER_ACTION_RAISE  = 5 -- 加注
        GCommonConst.PLAYER_ACTION_ALL_IN = 6 -- 全押
        {
            "time":6,
            "action_num"  : 5,
            "action_type" : 2,
            "bet_chips"   : 10,
            "chips"       : 190,
            "cmd"         : "actionresult",
            "rid"         : 2000180,
            "seat_index"  : 5
        }
    */
    OnDoAction: function (jsonData)
    {
        this._total_chip += jsonData.action_num
        var rv = this._role_views[jsonData.seat_index]
        if (!rv)
        {
            return
        }
        switch (jsonData.action_type)
        {
            case 1: //押注
                {
                    rv.doBet(jsonData.bet_chips,jsonData.chips)
                }
                break
            case 2: //跟注
                {
                    rv.doFollow(jsonData.bet_chips,jsonData.chips)
                }
                break
            case 3: //看牌
                {
                    rv.doCheck()
                }
                break
            case 4: //弃牌
                {
                    rv.doGiveUP()
                }
                break
            case 5: //加注
                {
                    rv.doRaise(jsonData.bet_chips,jsonData.chips)
                }
                break
            case 6: //全押
                {
                    rv.doAllIn(jsonData.bet_chips)
                }
                break
        }
        this.refreshTotalChip()
    },
    onRoundEnd:function(pots)
    {
        var self = this
        core.foreach(this._role_views, function (seat_index, rv)
        {
            if (!rv)
            {
                return
            }
            else if (rv._round_chip <= 0)
            {
                rv.onRoundEnd()
                return
            }
            var aniChipView = new AnimationChipView()
            aniChipView.goto_center(rv, self._randomHeap, 0)
            self.addChild(aniChipView)
        })
        self._total_chip = 0
        core.foreach(pots,function(index,chip)
        {
            self._total_chip+=chip
        })
        this.refreshTotalChip()
    },
    addFlopCards:function(cards)
    {
        this._cards = []
        var self = this
        core.foreach(cards,function(index,cd)
        {
            self._cards.push(cd)
            var card = new CardView(cd)
            self._dy_node.addChild(card, 1000)
            card.setPosition(cc.p(380 + (index + 1) * 70, 300))
            card.doTurn(index * 0.15 + 1)
        })
    },
    addTurnCard:function(cd)
    {
        this._cards.push(cd)
        var index = 4
        var card = new CardView(cd)
        this._dy_node.addChild(card, 1000)
        card.setPosition(cc.p(380 + index * 70, 300))
        card.doTurn(index * 0.15 + 1)
    },
    addRiverCard: function (cd)
    {
        this._cards.push(cd)
        var index = 5
        var card = new CardView(cd)
        this._dy_node.addChild(card, 1000)
        card.setPosition(cc.p(380 + index * 70, 300))
        card.doTurn(index * 0.15)
    },
    getCards: function()
    {
        return this._cards
    },
    onGameEnd: function (gameresult)
    {
        var self = this
        var cards = self._self_role_view.getCards()
        core.foreach(self._role_views, function (seat_index, rv)
        {
            if (!rv.isGiveUp() && !rv.isStandUp())
            {
                var role = gameresult.roles[seat_index]
                var hole_cards = null
                if (role)
                {
                    hole_cards = role.hole_cards
                }
                rv.doEnd(hole_cards)
            }
        })

        // win by people
        var roleWin = {}
        var potnum = gameresult.pots.length
        for (var index = 0; index < potnum; ++index)
        {
            var pot = gameresult.pots[index]
            core.foreach(pot.seats, function (index,seat_index)
            {
                roleWin[seat_index] = roleWin[seat_index] || 0
                roleWin[seat_index] += Math.floor(pot.chip / potnum)
            })
        }
        var rw = []
        core.foreach(roleWin, function (seat_index, chip)
        {
            var r = {}
            r.chip = chip
            r.seat_index = seat_index
            r.card_type = gameresult.roles[seat_index].card_type
            r.card_result = gameresult.roles[seat_index].card_result
            r.hole_cards = gameresult.roles[seat_index].hole_cards
            rw.push(r)
        })
        // sort by people card_result
        rw.sort(function (a, b)
        {
            if (!a.chip || !b.chip)
            {
                return true
            }
            if (a.card_result[0] != b.card_result[0])
            {
                return a.card_result[0] > b.card_result[0]
            }
            var i = 1
            while (a.card_result[i] && b.card_result[i] && a.card_result[i][1] == b.card_result[i][1])
            {
                i = i + 1
            }
            if (a.card_result[i] && b.card_result[i])
            {
                return a.card_result[i][1] > b.card_result[i][1]
            }
            else
            {
                return true
            }
        })
        // animation
        var pre = null
        var time = 0
        core.foreach(rw, function (index, info)
        {
            time = index * 2.5
            if (self._role_views[info.seat_index])
            {
                var x, y = self._role_views[info.seat_index].getPosition()
                var sx, sy = self._totalChip.getPosition()
                var animationChipView = new AnimationChipView(info.chip, cc.p(x, y), time, self._role_views[info.seat_index], true)
                self._dy_node.addChild(animationChipView)
                animationChipView.setPosition(cc.p(sx, sy))
                //self.showTypeCard(self._role_views[info.seat_index], pre, info.card_result, time, potnum)
                pre = self._role_views[info.seat_index]
            }
        })
    }
});