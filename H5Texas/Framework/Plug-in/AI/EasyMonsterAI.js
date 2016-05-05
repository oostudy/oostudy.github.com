var EasyMonsterAI = BaseAI.extend("EasyMonsterAI", {
    ctor: function (obj, targetObjs)
    {
        this._super(obj, targetObjs);
    },
    _doPatrol: function ()
    {
        var targetInfo = this._getNearestTarget();
        if (!targetInfo || targetInfo.length > this._persueLength)//继续巡逻
        {

        }
        else//
        {
            this._changeState(EAIState.Persue);
        }
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
});