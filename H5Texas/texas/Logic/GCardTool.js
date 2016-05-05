GCardTool = {
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
    getCardEnd:function(allCards)
    {
        if(!allCards)
        {
            return [-1]
        }
        var totalNum = allCards.length
        if(totalNum < 5)
        {
            return [ - 1 ]
        }

        core.foreach(allCards,function(index,card)
        {
            if(card[1] == 0)
            {
                card[1] = 13
            }
        })

        // 遍历所有五张牌组合情况
        var cards = []
        for(var i1 = 0;i1<totalNum - 4;++i1)
        {
            for(var i2 = i1 + 1;i2<totalNum - 3;++i2)
            {
                for(var i3 = i2 + 1;i3<totalNum - 2;++i3)
                {
                    for(var i4 = i3 + 1;i4<totalNum - 1;++i4)
                    {
                        for(var i5 = i4 + 1;i5<totalNum;++i5)
                        {
                            cards.push([
                                allCards[i1],
                                allCards[i2],
                                allCards[i3],
                                allCards[i4],
                                allCards[i5],
                            ])
                        }
                    }
                }
            }
        }

        // 对每一种排列组合判断牌型
        var preResult = this._getCardResult(cards[0])
        var preIndex = 0
        for(var i = 1, length = cards.lenghth;i<length;++i)
        {
            var result = this._getCardResult(cards[i])
            var j = 1
            if(result[0] == preResult[0])
            {
                while(result[j] && preResult[j] && result[j][1] == preResult[j][1])
                {
                    j = j + 1
                }
                if(result[j] && preResult[j] && result[j][1] > preResult[j][1])
                {
                    preResult = result
                    preIndex = i
                }
            }
            else if(result[0] > preResult[0])
            {
                preResult = result
                preIndex = i
            }
        }
        preResult.cards = cards[preIndex]
        preResult.index = self._index
        return preResult
    },

    _getCardResult:function(fiveCards)
    {
        fiveCards = this._sortCards(fiveCards)
        // 9同花顺
        var result = this._isTongHuaShun(fiveCards)
        if(result[0])
        {
            if(result[1] < 14)
            {
                result[0] = 9
                return result
            }
            else
            {
                result[0] = 10
                return result
            }
        }
        // 8四条
        var result = this._isSiTiao(fiveCards)
        if(result[0])
        {
            result[0] = 8
            return result
        }
        // 7满堂彩（葫芦）
        var result = this._isHuLu(fiveCards)
        if(result[0])
        {
            result[0] = 7
            return result
        }
        // 6同花
        result = this._isTongHua(fiveCards)
        if(result[0])
        {
            result[0] = 6
            return result
        }
        // 5顺子
        result = this._isShunZi(fiveCards)
        if(result[0])
        {
            result[0] = 5
            return result
        }
        // 4三条
        result = this._isSantiao(fiveCards)
        if(result[0])
        {
            result[0] = 4
            return result
        }
        // 3两对
        result = this._isLiangDui(fiveCards)
        if(result[0])
        {
            result[0] = 3
            return result
        }
        // 2一对
        result = this._isYiDui(fiveCards)
        if(result[0])
        {
            result[0] = 2
            return result
        }
        // 1单牌
        var cards = this._sortCards(fiveCards)
        result = [ 1 ]
        var i = 1
        core.foreach(cards,function(_,c)
        {
            i = i + 1
            result[i] = c
        })
        return result
    },

    _sortCards:function(cards)
    {
        var temp = []
        core.foreach(cards,function(index,card)
        {
            temp.push(card)
        })
        temp.sort(function(a, b)
        {
            return a[1] > b[1]
        } )
    
        return temp
    },
    // 是否同花顺
    _isTongHuaShun:function(fiveCards)
    {
        var tongHua = this._isTongHua(fiveCards)
        if(!tongHua[0])
        {
            // 不是同花
            return [ false ]
        }
        return this._isShunZi(fiveCards)
    },

    // 是否同花
    _isTongHua:function(fiveCards)
    {
        var preType = null
        for (var i = 0; i < 5;++i)
        {
            var card = fiveCards[i]
            if(!preType)
            {
                preType = card[0]
            }
            else if(preType != card[0])
            {
                return [false]
            }
        }
        var result = [ true ]
        core.foreach(5,function(i)
        {
            result.push(fiveCards[i])
        })
        return result
    },

// 是否顺子
    _isShunZi:function(fiveCards)
    {
        for(var i = 1; i<4;++i) 
        {
            var dt = fiveCards[i][1] - fiveCards[i + 1][1]
            if(dt != 1)
            {
                return [ false ]
            }
        }
        if(fiveCards[0][1] == 14)
        {
            if(fiveCards[4][1] != 2 && fiveCards[1][1] != 13)
            {
                return [ false ]
            }
            else if(fiveCards[4][1]==2)
            {
                return [ true, fiveCards[1], fiveCards[2], fiveCards[3], fiveCards[4], fiveCards[0] ]
            }
            else
            {
                return [ true, fiveCards[0], fiveCards[1], fiveCards[2], fiveCards[3], fiveCards[4] ]
            }
        }
        else if(fiveCards[0][1] - fiveCards[1][1] != 1)
        {
            return [ false ]
        }
        return [ true, fiveCards[1], fiveCards[2], fiveCards[3], fiveCards[4], fiveCards[4] ]
    },

// 是否四条
    _isSiTiao:function(fiveCards)
    {
        var cards = fiveCards
        if(cards[1][1] != cards[2][1] || cards[2][1] != cards[3][1])
        {
            return [ false ]
        }
        if( cards[0][1] == cards[1][1])
        {
            return [ true, cards[0], cards[1], cards[2], cards[3], cards[4] ]
        }
        if(cards[2][1] == cards[3][1])
        {
            return [ true, cards[1], cards[2], cards[3], cards[4], cards[0] ]
        }
        return [ false ]
    },

    // 是否满堂彩（葫芦）
    _isHuLu:function(fiveCards)
    {
        var sanTiao = this._isSantiao(fiveCards)
        if(!sanTiao[0])
        {
            // 不是满堂彩
            return [ false ]
        }
        if(sanTiao[4][1] != sanTiao[5][1])
        {
            return [ false ]
        }
        return [ true, sanTiao[1], sanTiao[2], sanTiao[3], sanTiao[4], sanTiao[5] ]
    },
    // 是否三条
    _isSantiao:function(fiveCards)
    {
        for(var i=0;i<3;++i)
        {
            var j = i + 1
            var k = j + 1
            if(fiveCards[i][1] == fiveCards[j][1] && fiveCards[j][1] == fiveCards[k][1])
            {
                var card1 = null
                var card2 = null
                if(i==0)
                {
                    card1=fiveCards[3]
                    card2=fiveCards[4]
                }
                else if(i==1 )
                {
                    card1=fiveCards[0]
                    card2=fiveCards[4]
                }
                else if(i==2)
                {
                    card1=fiveCards[0]
                    card2=fiveCards[1]
                }
                if(card1[1] > card2[1])
                {
                    return [ true, fiveCards[i], fiveCards[j], fiveCards[k], card1, card2 ]
                }
                return [ true, fiveCards[i], fiveCards[j], fiveCards[k], card2, card1 ]
            }
        }
        return [ false ]
    },

    // 是否两对
    _isLiangDui:function(fiveCards)
    {
        var yidui = this._isYiDui(fiveCards)
        if(!yidui[0])
        {
            return [ false ]
        }

        if(yidui[3][1] == yidui[4][1])
        {
            if(yidui[1][1] > yidui[3][1])
            {
                return yidui
            }
            return [ true, yidui[3], yidui[4], yidui[1], yidui[2], yidui[5] ]
        }
        else if(yidui[4][1] == yidui[5][1])
        {
            if(yidui[1][1] > yidui[4][1])
            {
                return [ true, yidui[1], yidui[2], yidui[4], yidui[5], yidui[3] ]
            }
            return [ true, yidui[4], yidui[5], yidui[1], yidui[2], yidui[3] ]
        }
        return [ false ]
    },

    // 是否一对
    _isYiDui:function(fiveCards)
    {
        for(var i = 0;i< 5 - 1;++i)
        {
            var j = i + 1
            if(fiveCards[j] && fiveCards[i][1] == fiveCards[j][1])
            {
                var card = fiveCards[i]
                var tmp = []
                core.foreach(fiveCards,function( index, cd)
                {
                    if(cd[1] != card[1])
                    {
                        tmp.push(cd)
                    }
                })
                var result = [ true, fiveCards[i], fiveCards[j] ]
                var cards = this._sortCards(tmp)
                for(var i=0;i<3;++i)
                {
                    result.push(cards[i])
                }
                return result
            }
        }
        return [ false ]
    }
}