EAIState = {
    Idle: "Idle",
    Patrol: "Patrol",
    Persue: "Persue",
    Attack: "Attack",
    Die: "Die",
}
var BaseAI = cc.Class.extend("BaseAI", {
    _state: EAIState.Idle,
    _centerPos: { x: 0, y: 0 },
    _patrolLength: 0,
    _persueLength: 0,
    _obj: null,
    _targetObjs: [],
    _triggers: [],
    ctor: function (obj, targetObjs)
    {
        this._super();
        this._state = EAIState.Idle;
        this._obj = obj;

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

        this._centerPos = this._obj.getPosition();

        this._triggers = [];
        var code = GTriggerMgr.addConditionTriggerEvent(EConditionType.Die, this.onDie.bind(this));
        this._triggers.push({ type: EConditionType.Die, code: code })

    },
    start: function ()
    {
        this._changeState(EAIState.Idle);
    },
    end: function ()
    {
        for (var i = 0, length = this._triggers.length; i < length; ++i)
        {
            GTriggerMgr.removeConditionTriggerEvent(this._triggers[i].type, this._triggers[i].code);
        }
        this._triggers = [];
    },
    _changeState: function (state)
    {
        this._state = state;
        this["_do" + this._state]();
    },
    _doIdle: function ()
    {
        this._changeState(EAIState.Patrol);
    },
    _doPatrol: function ()
    {

    },
    _doPersue: function ()
    {

    },
    _doAttack: function ()
    {

    },
    _doDie: function ()
    {

    },


    onDie: function (obj)
    {
        if (!obj)
        {
            return;
        }
        if (obj === this._obj)
        {
            this.end();
            return;
        }
        for (var i = 0, length = this._targetObjs.length; i < length; ++i)
        {
            if (this._targetObjs[i] === obj)
            {
                this._targetObjs.removeAt(i);
                return;
            }
        }
        return;
    },
    _getNearestTarget: function ()
    {
        var targetNum = this._targetObjs.length;
        if (targetNum <= 0)
        {
            return null;
        }

        if (targetNum == 1)
        {
            return this._targetObjs[0];
        }
        var objPos = this._obj.getPosition();
        var maxIndex = 0;
        var maxdis = cc.pDistance(objPos, this._targetObjs[0].getPosition());
        for (var i = 1; i < targetNum; ++i)
        {
            var dis = cc.pDistance(objPos, this._targetObjs[i].getPosition());
            if (maxdis < dis)
            {
                maxdis = ids;
                maxIndex = i;
            }
        }
        return { target: this._targetObjs[maxIndex], distance: maxdis };
    },
    addTarget: function (target)
    {
        if (!target)
        {
            return;
        }
        this._targetObjs.push(target);
    }
})