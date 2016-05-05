var Buff=cc.Class.extend("Buff",{
    _buffType: "",
    _timeCircle: "",
    _info:"",
    ctor:function(buffDataItem)
    {
        if (!buffDataItem)
        {
            return
        }
        this._buffType = buffDataItem.Type
        this._timeCircle = buffDataItem.TimeCircle
        this._info = buffDataItem.Info
    }
});