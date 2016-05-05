
GCommonConst =
{
    PLAYER_ACTION_BET: 1, //押注
    PLAYER_ACTION_CALL: 2, //跟注
    PLAYER_ACTION_CHECK: 3, //看牌
    PLAYER_ACTION_FOLD: 4, //弃牌
    PLAYER_ACTION_RAISE: 5, //加注
    PLAYER_ACTION_ALL_IN: 6, //全押
}
GServerMonitor =
{
    sendRequest: function (url, params, isPost, callback, errorcallback) {
        self = this
        if(url == null || url == '')
            return;
            
        var xhr = cc.loader.getXMLHttpRequest();
        if(isPost){
            xhr.open("POST",url);
        }else{
            xhr.open("GET",url);
        }
        xhr.timeout = 100
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status <= 207) {
                    strData = xhr.responseText;
                    self._msgs = JSON.parse(strData)
                    
                    if (typeof (callback) == "function") {
                        callback()
                    }
                } else {
                    if (typeof (errorcallback) == "function") {
                        errorcallback()
                    }
                }
            }
        };
    
        if(params == null || params == ""){
            xhr.send();
        }else{
            xhr.send(params);
        }
    },
    downUrl:function(url)   
    {
        if ( url == null ) { return }
        var str = "http://7xsgwr.com1.z0.glb.clouddn.com/" + url
        var errcall = function () { }
        this.sendRequest(str,null,false,this.run.bind(this),errcall)
    },
    save :function(response)   
    {   
        this._msgs = JSON.parse(response)
    },

    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    init:function()
    {
        this._msgs = []
        this._rid = this.getQueryString("rid") 
        this._record_id = this.getQueryString("record_id")
        this.downUrl(this._record_id)
       
    },
    _runOne: function ()
    {
        var self = this
        var length = this._msgs.length
        if (this.nextIndex >= length)
        {
            return
        }
        var time = 0
        if (this.nextIndex == 0)
        {
            time = this._msgs[this.nextIndex].time - this._msgs[0].time
        }
        else
        {
            time = this._msgs[this.nextIndex].time - this._msgs[this.nextIndex-1].time
        }
        var actions = []
        actions.push(cc.delayTime(time))
        actions.push(cc.callFunc(function ()
        {
            var msg = self._msgs[self.nextIndex]
            self["receive_" + msg.cmd](msg.msg)
            ++self.nextIndex
            self._runOne()
        }))
        cc.director.getRunningScene().runAction(cc.sequence(actions))
    },
    run: function () {
        self = this
        self.nextIndex = 0
        self._runOne()
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
    */
    receive_gamestart: function (jsonData)
    {
        GPage_Room.beginGame(jsonData)
    },
    /*
        {
            "cmd"   : "seatsinfo",
            "seats" : {
                1 : {
                    "bet_chips"  : 5,
                    "chips"      : 195,
                    "is_tuoguan" : false,
                    "rid"        : 2000180,
                    "seat_index" : 4,
                    "sng_rank"   : 0,
                    "state"      : 2,
                    },
                2 : {
                    "bet_chips"  : 10,
                    "chips"      : 190,
                    "is_tuoguan" : false,
                    "rid"        : 2000193,
                    "seat_index" : 5,
                    "sng_rank"   : 0,
                    "state"      : 2,
                }
             }
        }
    */
    receive_seatsinfo: function (jsonData)
    {
        GPage_Room.onBlindChip(jsonData.seats)
    },
    /*
        #通知发底牌
        holecard 17 {
            response {
                hole_cards 0 : *integer
            }
        }
        0-52
        0-12 黑桃 12 是A
        13-25 红桃
        26-38 梅花
        39-51 方块
    */
    receive_holecard: function (jsonData)
    {
        var rid = this._rid
        core.foreach(jsonData, function (index, card) {
            if (rid == index) {
                var player = GHelper.serverCardToClientCard(card)
                GPage_Room.onHoleCard(player)
                
            }
            
        })
        //var cards = GHelper.serverCardToClientCard(jsonData.hole_cards)
        //GPage_Room.onHoleCard(cards)
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
    receive_doaction:function(jsonData)
    {
        GPage_Room.doAction(jsonData)
    },
    /*
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
    receive_actionresult:function(jsonData)
    {
        GPage_Room.OnDoAction(jsonData)
    },
    /*
        #通知翻牌
        flopcardinfo 19 {
            response {
                flop_cards 0 : *integer
            }
        }
    */
    receive_flopcardinfo: function (jsonData)
    {
        GPage_Room.addFlopCards(GHelper.serverCardToClientCard(jsonData.flop_cards))
    },

    /*
        #通知转牌
        turncardinfo 20 {
            response {
                turn_card 0 : integer
        }

        }
    */
    receive_turncardinfo: function (jsonData)
    {
        GPage_Room.addTurnCard(GHelper.serverCardToClientCard(jsonData.turn_card))
    },

    /*
        #通知河牌
        rivercardinfo 21 {
            response {
                river_card 0 : integer
        }	
        }
    */

    receive_rivercardinfo: function (jsonData)
    {
        GPage_Room.addRiverCard(GHelper.serverCardToClientCard(jsonData.river_card))
    },

    /*
        #奖金池信息
        .TablePot {
                total_bet 0 : integer #总下注额
            sub_chips_curround 1 : integer #本轮每人扣除的最大注额
        }
        #通知奖金池
        potsinfo 18 {
            response {
                pots 0 : *TablePot
            }
        }
    */
    receive_potsinfo: function (jsonData)
    {
        var pots = []
        core.foreach(jsonData.pots, function (index,pot)
        {
            pots.push(pot.total_bet)
        })
        GPage_Room.onRoundEnd(pots)
    },
    /*
        #通知玩家量牌
        .Cards {
            seat_index 0 : integer
            cards 1 : *integer
        }

        lightcard 83 {
            response {
                cards_list 0 : *Cards(seat_index)
            }
        }
    */
    receive_lightcard: function (jsonData)
    {
        var page = GPageMgr.getPage("Page_Room")
        var list_cards = {}
        core.foreach(jsonData.cards_list, function (seat_index, item)
        {
            list_cards[seat_index] = GHelper.serverCardToClientCard(item.cards)
        })
        page.onLightCard(list_cards)
    },
    /*
        .TablePlayerResult {
            state 0 : integer #座位状态
            index 1 : integer #座位索引
            rid 2 : integer   #玩家rid
            chips 3 : integer #拥有筹码
            card_form 4 : integer #牌型
            hole_cards 5 : *integer #底牌
            form_cards 6 : *integer #牌型对应的牌
            win_chips 7 : integer  #单局赢得筹码
            rolename 8 : string
        }

        .TablePotResult {
            total_bet 0 : integer #总下注额
            win_player_indexes 1 : *integer #赢得奖池玩家座位号索引
        }

        gameresult 24 {
            response {
                player_results 0 : *TablePlayerResult #玩家结算信息
                pot_results 1 : *TablePotResult	      #奖池结算信息
            }
        }
    */
    receive_gameresult: function (jsonData)
    {
        var pots = []
        core.foreach(jsonData.pot_results, function (index, pot)
        {
            var p =
            {
                chip: pot.total_bet,
                seats:[]
            }
            core.foreach(pot.win_player_indexes,function(i,seat_index)
            {
                p.seats.push(seat_index)
            })
            pots.push(p)
        })
        var roles = {}
        core.foreach(jsonData.player_results, function (index, role)
        {
            if (role.rid > 0)
            {
                roles[role.index]={
                    state: role.state,
                    seat_index: role.index,
                    rid: role.rid,
                    chip: role.chips,
                    giveup: role.state == 4,//弃牌
                    card_type: role.card_form,
                    card_result: GCardTool.getCardEnd(GHelper.serverCardToClientCard(role.form_cards)),
                    hole_cards: GHelper.serverCardToClientCard(role.hole_cards),
                }
            }
        })
        var gameresult =
        {
            pots: pots,
            roles: roles
        }
        GPage_Room.onGameEnd(gameresult)
    }
}