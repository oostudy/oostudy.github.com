var BehaviorAI = cc.Class.extend("BehaviorAI", {
    _obj: null,
    _targetObjs: [],
    _triggers: [],
    _behavior_data: null,
    _current_behavior_name: "",
    _current_check: [],
    _targetObj: null,
    //构造函数
    ctor: function (behavior_data, obj, targetObjs)
    {
        this._obj = obj;
        this._behavior_data = behavior_data;

        if (cc.isArray(targetObjs))
        {
            this._targetObjs = targetObjs;
        }
        else if (targetObjs)
        {
            this._targetObjs[0] = targetObjs;
        }
        else
        {
            this._targetObjs = [];
        }

        this._triggers = [];
        var code = GTriggerMgr.addConditionTriggerEvent(EConditionType.Die, this.onTriggerDie.bind(this), { code: this._obj.getCode() });
        this._triggers.push({ type: EConditionType.Die, code: code });
    },
    //启动行为树AI
    start: function ()
    {
        if (!this._behavior_data)
        {
            cc.log("------------error------------this._behavior_data  can not be null!");
            return;
        }
        this.goto(this._behavior_data.start);
    },
    //结束行为树AI
    end: function ()
    {
        for (var i = 0, length = this._triggers.length; i < length; ++i)
        {
            GTriggerMgr.removeConditionTriggerEvent(this._triggers[i].type, this._triggers[i].code);
        }
        this._triggers = [];
    },
    //帧检查
    //支持多条件check
    update: function (dt)
    {
        if (this._current_check.length < 0)
        {
            return;
        }

        for (var i = 0; i < this._current_check.length; ++i)
        {
            var current = this._current_check[i];
            //目前只支持同时存在一个update检查
            if (current.event_name == "target_insight")
            {
                var targetInfo = this._getNearestTarget();
                if (targetInfo)
                {
                    var target = targetInfo.target;
                    var distance = targetInfo.distance;
                    if (distance <= this._behavior_data.insight)//视野发现敌人
                    {
                        this._current_check.removeAt(i);
                        --i;
                        var forceReturn = this._doEvents(this._current_behavior.conditions[current.event_name]);
                        if (forceReturn)
                        {
                            return;//防止goto修改this._current_check后，做了立刻check
                        }
                    }
                }
            }
            else if (current.event_name == "sure")
            {
                this._current_check.removeAt(i);
                --i;
                var forceReturn = this._doEvents(this._current_behavior.conditions[current.event_name]);
                if (forceReturn)
                {
                    return;//防止goto修改this._current_check后，做了立刻check
                }
            }
            else if (current.event_name == "near")
            {
                if (this._targetObj)
                {
                    var objPos = this._obj.getPosition();
                    var tpos = this._targetObj.getPosition();
                    var distance = cc.pDistance(objPos, tpos);//目标和自己的距离
                    var dty = objPos.y - tpos.y;
                    dty = dty >= 0 ? dty : -dty;
                    if (distance <= current.distance && dty <= 10)//视野发现敌人
                    {
                        this._current_check.removeAt(i);
                        --i;
                        var forceReturn = this._doEvents(this._current_behavior.conditions[current.event_name]);
                        if (forceReturn)
                        {
                            return;//防止goto修改this._current_check后，做了立刻check
                        }
                    }
                }
                else
                {
                    this._current_check.removeAt(i);
                    --i;
                    var forceReturn = this._doEvents(this._current_behavior.conditions[current.event_name], true);
                    if (forceReturn)
                    {
                        return;//防止goto修改this._current_check后，做了立刻check
                    }
                }
            }
            else if (current.event_name == "timeout")
            {
                current.time -= dt;
                if (current.time <= 0)
                {
                    this._current_check.removeAt(i);
                    --i;
                    var forceReturn = this._doEvents(this._current_behavior.conditions[current.event_name]);
                    if (forceReturn)
                    {
                        return;//防止goto修改this._current_check后，做了立刻check
                    }
                }
            }
        }
    },
    //goto事件
    goto: function (behavior_name)
    {
        //cc.log("=====goto behavior=" + behavior_name);
        if (this._behavior_data && this._behavior_data.name == behavior_name)
        {
            return//拒绝相同行为跳转
        }
        this._current_check = [];
        this._current_behavior = this._behavior_data.behaviors[behavior_name];

        //全局条件
        if (this._behavior_data.conditions)
        {
            this._checkConditions(this._behavior_data.conditions);
        }
        //行为条件
        if (this._current_behavior.conditions)
        {
            this._checkConditions(this._current_behavior.conditions);
        }

        if (this._current_behavior.animation)
        {
            if (!this._current_behavior.conditions.animation_done)
            {
                this._obj.behaviorAnimation(this._current_behavior.animation.name, this._current_behavior.animation.loop);
            }
            else
            {
                var self = this;
                this._obj.behaviorAnimation(this._current_behavior.animation.name, this._current_behavior.animation.loop, function ()
                {
                    self._doEvents(self._current_behavior.conditions.animation_done)
                });
            }
        }
        else
        {
            cc.log("---------warning--------_goto->behavior_name=" + behavior_name + ".animaiton not exist!");
        }
    },
    //检查有没有已经达到的条件,又的话就执行他的相关事件
    _checkConditions: function (conditions)
    {
        if (!conditions)
        {
            return;
        }
        for (var key in conditions)
        {
            switch (key)
            {
                case "target_insight":
                    {
                        this._current_check.push({ event_name: key });
                    }
                    break;
                case "timeout":
                    {
                        this._current_check.push({ event_name: key, time: conditions[key].time });
                    }
                    break;
                case "sure":
                    {
                        this._current_check.push({ event_name: key });//下次update执行
                    }
                    break;
                case "near":
                    {
                        this._targetObj = null;
                        this._current_check.push({ event_name: key, distance: conditions[key].distance });
                        var targetInfo = this._getNearestTarget();
                        if (targetInfo)
                        {
                            if (this._behavior_data.name == "sm")
                                cc.log("distance" + targetInfo.distance);
                            this._targetObj = targetInfo.target;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    },
    //执行事件
    _doEvents: function (events, fail)
    {
        if (!events)
        {
            return false;
        }
        if (fail && events.failto)
        {
            this.goto(events.failto);
            return true;
        }
        var forceReturn = false;
        for (var key in events)
        {
            switch (key)
            {
                case "goto":
                    {
                        this.goto(events[key]);
                        forceReturn = true;
                    }
                    break;
                case "walk_any":
                    {
                        if (this._obj.behaviorWalkAny)
                        {
                            this._obj.behaviorWalkAny();
                        }
                    }
                    break;
                case "persue":
                    {
                        if (this._obj.behaviorPersue && this._targetObj)
                        {
                            this._obj.behaviorPersue(this._targetObj);
                        }
                    }
                    break;
                case "call":
                    {
                        if (events[key].fun && this._obj[events[key].fun])
                        {
                            this._obj[events[key].fun](events[key].params);
                        }
                    }
                    break;
                case "random":
                    {
                        var r = GHelper.random();
                        var rate = 0;
                        var done = false;
                        //最后一条不参与检测
                        for (var i = 0, length = events[key].length; i < length - 1; ++i)
                        {
                            rate += events[key][i].rate;
                            if (r <= rate)
                            {
                                forceReturn = this._doEvents(events[key][i].events);
                                done = true;
                                break;
                            }
                        }
                        //如果前面都没有成功，必须保证最后一条得到执行
                        if (!done)
                        {
                            forceReturn = this._doEvents(events[key][events[key].length - 1].events);
                        }
                    }
                default:
                    break;
            }
        }
        return forceReturn;
    },








    //角色死亡触发
    onTriggerDie: function (roleDM)
    {
        if (!roleDM)
        {
            return;
        }
        if (this._obj.getCode() === roleDM.code)
        {
            this.goto("die");
            this.end();
            return;
        }
        for (var i = 0, length = this._targetObjs.length; i < length; ++i)
        {
            if (this._targetObjs[i].getCode() === roleDM.code)
            {
                this._targetObjs.removeAt(i);
                if (this._targetObj.getCode() === roleDM.code)
                {
                    this._targetObj = null;
                }
                return;
            }
        }

        return;
    },
    //获取最近的target
    _getNearestTarget: function ()
    {
        var targetNum = this._targetObjs.length;
        if (targetNum <= 0)
        {
            return null;
        }

        var objPos = this._obj.getPosition();

        if (targetNum == 1)
        {
            return { target: this._targetObjs[0], distance: cc.pDistance(objPos, this._targetObjs[0].getPosition()) };
        }

        var minIndex = 0;
        var mindis = cc.pDistance(objPos, this._targetObjs[0].getPosition());
        for (var i = 1; i < targetNum; ++i)
        {
            var dis = cc.pDistance(objPos, this._targetObjs[i].getPosition());
            if (mindis > dis)
            {
                mindis = dis;
                minIndex = i;
            }
        }
        return { target: this._targetObjs[minIndex], distance: mindis };
    },
    //添加target
    addTarget: function (target)
    {
        if (!target)
        {
            return;
        }
        this._targetObjs.push(target);
    },
    getTargets: function ()
    {
        return this._targetObjs;
    }
})