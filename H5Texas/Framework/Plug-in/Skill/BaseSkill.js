
var BaseSkill=cc.Class.extend("BaseSkill",{

    ctor:function()
    {
        this._attackRange=0;
        this._damageRange=0;
        this._coolTime=0.0;
        this._singTime=0.0;
        this._vecBuff=[];
        return true
    },

    beginSkill:function(targetRole)
    {
        return true;
    },

    endSkill:function(targetRole)
    {
        return true;
    }

});