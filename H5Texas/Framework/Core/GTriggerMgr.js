ETriggerType = {
    Region: 0,
    Condition: 1
}
EConditionType = {
    Die: 0,
    Hit: 1,
    HP: 2,
    MP: 3,
}

_GTriggerCode = 0

GTriggerMgr =
{
    _regionTriggers: {},
    _conditionTriggers: {},
    //触发器的单个个体必须包含x,y,width,height,其他参数为各自需要添加
    init: function ()
    {
        this.clearAll();
    },
    clearAll: function ()
    {
        this.clearRegionTrigger();
        this.clearConditionTrigger();
    },
    clear: function (triggertype)
    {
        if (cc.isUndefined(triggertype))
        {
            this.clearAll();
        }
        else if (triggertype == ETriggerType.Region)
        {
            this.clearRegionTrigger();
        }
        else
        {
            this.clearConditionTrigger();
        }
    },




    ////////////////////////////////////////////区域触发器//////////////////////////////////////////////////////
    //objs 需要检查的对象，regions触发起区域，callBackObj回调的对象
    initRegionTrigger: function (objs, triggers, callBackObj)
    {
        this.clearRegionTrigger();
        if (!triggers || triggers.length <= 0)
        {
            return;
        }
        for (var i = 0, length = triggers.length; i < length; ++i)
        {
            this._regionTriggers.triggerInfos[i] = { trigger: triggers[i] };
        }
        if (cc.isArray(objs))
        {
            for (var i = 0, length = objs.length; i < length; ++i)
            {
                this._regionTriggers.objInfos[i] = { obj: objs[i] };
            }
        }
        else
        {
            this._regionTriggers.objInfos[0] = { obj: objs };
        }
        if (typeof callBackObj !== "undefined")
        {
            this._regionTriggers.callBackObj = callBackObj;
        }
        this._checkRegion();//初始化check
    },
    clearRegionTrigger: function ()
    {
        this._regionTriggers = { triggerInfos: [], objInfos: [], callBackObj: null };
    },

    addObjToRegionTrigger: function (obj)
    {
        this._regionTriggers.objInfos[this._regionTriggers.objInfos.length] = { obj: obj };
    },

    removeObjInRegionTrigger: function (obj)
    {
        for (var i = 0; i < this._regionTriggers.objInfos.length; ++i)
        {
            var o = this._regionTriggers.objInfos[i].obj;
            if (o === obj)
            {
                this._regionTriggers.objInfos.removeAt(i);
                return;
            }
        }
    },

    //是否在触发器内
    _isInTrigger: function (pos, region)
    {
        if (!pos || typeof region === "undefined")
        {
            return false;
        }
        cc.log("pos.x" + pos.x + "  pos.y=" + pos.y);
        cc.log("region.x" + region.x + "  region.y=" + region.y);
        if (pos.x < (region.x - region.width / 2))
        {
            return false;
        }
        if (pos.x > (region.x + region.width / 2))
        {
            return false;
        }
        if (pos.y < (region.y - region.height / 2))
        {
            return false;
        }
        if (pos.y > (region.y + region.height / 2))
        {
            return false;
        }
        return true;
    },
    //外部需要调用改接口
    check: function ()
    {
        this._checkRegion();
    },
    _checkRegion: function ()
    {
        for (var i = 0, length = this._regionTriggers.objInfos.length; i < length; ++i)
        {
            var info = this._regionTriggers.objInfos[i];
            if (!info)
            {
                continue;
            }
            var obj = info.obj;
            if (!obj || !obj.getPosition)
            {
                this.removeObjInRegionTrigger(obj);//改对象已经无效
                continue;
            }
            var pos = obj.getPosition();

            //优化检查频率，，10个像素差之后才进行检测
            if (!info.prePos || !cc.pFuzzyEqual(pos, info.prePos, 10))
            {
                info.prePos = pos;
                for (var i = 0, length = this._regionTriggers.triggerInfos.length; i < length; ++i)
                {
                    var triggerInfo = this._regionTriggers.triggerInfos[i];
                    if (this._isInTrigger(pos, triggerInfo.trigger.region))
                    {
                        //原本在外面或首次检测，触发进入事件
                        if (triggerInfo[obj] && triggerInfo[obj] == -1)
                        {
                            this._triggerIn(obj, triggerInfo.trigger);
                            triggerInfo[obj] = 1;
                        }
                    }
                    else
                    {
                        //原本在里面或者首次检测，现在不在了，触发走出触发器事件
                        if (triggerInfo[obj] && triggerInfo[obj] == 1)
                        {
                            this._triggerOut(obj, triggerInfo.trigger);
                        }
                        triggerInfo[obj] = -1;
                    }
                }
            }
        }
    },


    //从外面进入时触发
    _triggerIn: function (obj, trigger)
    {
        if (!this._regionTriggers.callBackObj || !this._regionTriggers.callBackObj.onTriggerIn)
        {
            return
        }
        cc.log("some one triggered in")
        this._regionTriggers.callBackObj.onTriggerIn(obj, trigger)
    },

    //从里面走出去的时候触发
    _triggerOut: function (obj, trigger)
    {
        if (!this._regionTriggers.callBackObj || !this._regionTriggers.callBackObj.onTriggerOut)
        {
            return
        }
        cc.log("some one triggered out")
        this._regionTriggers.callBackObj.onTriggerOut(obj, trigger)
    },














    //////////////////////////////////////条件触发器//////////////////////////////////////////////////
    initConditionTrigger: function ()
    {
        this._conditionTriggers = {};
        for (var condition in EConditionType)
        {
            this._conditionTriggers[conditiontype] = {}
        }
    },
    clearConditionTrigger: function ()
    {
        this._conditionTriggers = []
        for (var conditiontype in EConditionType)
        {
            this._conditionTriggers[EConditionType[conditiontype]] = {};
        }
    },
    triggerCondition: function (conditiontype, params, conditions)
    {
        params = params || {};
        conditions = conditions || {};
        for (var code in this._conditionTriggers[conditiontype])
        {
            var info = this._conditionTriggers[conditiontype][code];
            for (var key in info.conditions)
            {
                if (info.conditions[key] !== conditions[key])
                {
                    return false;
                }
            }
            info.callback(params);
        }
        return true;
    },
    addConditionTriggerEvent: function (conditiontype, callback, conditions)
    {
        conditions = conditions || {};
        _GTriggerCode += 1;
        this._conditionTriggers[conditiontype][_GTriggerCode] = { callback: callback, conditions: conditions };
        return { type: conditiontype, code: _GTriggerCode };
    },
    removeConditionTriggerEvent: function (conditiontype, code)
    {
        if (typeof code === "undefiended")
        {
            this._conditionTriggers[conditiontype] = {};
        }
        else
        {
            delete this._conditionTriggers[conditiontype][code];
        }

    }
}