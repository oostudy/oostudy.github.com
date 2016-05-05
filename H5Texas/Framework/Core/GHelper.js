
GHelper =
{
    random: function (min, max)
    {
        switch (arguments.length)
        {
            case 1: return parseInt(Math.random() * min + 1);
            case 2: return parseInt(Math.random() * (max - min + 1) + min);
            default: return Math.random();
        }
        return Math.random();
    },
    clone: function (obj)
    {
        if (cc.isUndefined(obj))
        {
            return null;
        }
        if (cc.isArray(obj))
        {
            var newArray = new Array();
            for (var i = 0, length = obj.length; i < length; ++i)
            {
                newArray[i] = this.clone(obj[i]);
            }
            return newArray;
        }
        if (cc.isObject(obj))
        {
            var newObj = new Object();
            for (var i in obj)
            {
                newObj[i] = this.clone(obj[i]);
            }
            return newObj;
        }
        return obj;
    },
    merge: function (dest, src)
    {
        if (!src)
        {
            return dest;
        }
        dest = dest || {};
        for (var key in src)
        {
            dest[key] = this.clone(src[key]);
        }
        return dest;
    },
    dump: function (data)
    {
        var strSpace = "    ";
        var _dump = function (data, intent)
        {
            if (cc.isUndefined(data))
            {
                return;
            }
            var startIntentStr = "";
            for (var i = 0; i < intent; ++i)
            {
                startIntentStr += strSpace;
            }
            var contentStr = "";
            if (cc.isArray(data))
            {
                contentStr += "\n" + startIntentStr + "[\n";
                for (var i = 0, length = data.length; i < length; ++i)
                {
                    if (!cc.isArray(data[i]) && !cc.isObject(data[i]) && !cc.isFunction(data[i]))
                    {
                        contentStr += startIntentStr + strSpace + _dump(data[i], intent + 1) + ",\n";
                    }
                    else
                    {
                        contentStr += startIntentStr + _dump(data[i], intent + 1) + ",\n";
                    }
                }
                contentStr += startIntentStr + "]";
            }
            else if (cc.isObject(data))
            {
                contentStr += startIntentStr + "{\n";
                for (var key in data)
                {
                    contentStr += startIntentStr + strSpace + key + ":" + _dump(data[key], intent + 1) + ",\n";
                }
                contentStr += startIntentStr + "}";
            }
            else if (!cc.isFunction(data))
            {
                if (cc.isString(data))
                {
                    return "\"" + data + "\"";
                }
                return data;
            }
            if (contentStr == "")
            {
                return "";
            }
            return contentStr;
        }
        cc.log(_dump(data, 0));
    },
    convertChipNumToStr: function (num)
    {
        if (!num)
        {
            return ""
        }
        if (num <= 9999)
        {
            return "" + num
        }
        else if (num > 9999 && num <= 999999)
        {
            return Math.floor(num / 1000) + "K"
        }
        else
        {
            return Math.floor(num / 1000000) + "M"
        }
        return ""
    },
    /*[[server format
        0-52
        0-12 ���� 12 ��A
        13-25 ����
        26-38 ÷��
        39-51 ����
        ]]
        --[[client format
        ---14,2-13,����14λA����0��1��2��3 = �ڡ��졢÷����
        ---����{0,14}�������A
        ]]
    */
    serverCardToClientCard:function(num)
    {
        if(!num)
        {
            return null
        }
        if(core.isObject(num))
        {
            var cards = []
            core.foreach(num,function(index,n)
            {
                var card = []
                card.push(Math.floor(n / 13))
                card.push((n % 13) + 2)
                cards.push(card)
            })
            return cards
        }
        else
        {
            var card = []
            card.push(Math.floor(num / 13))
            card.push((num % 13) + 2)
            return card
        }
        return null
    }
}