
var ChipView = cc.Node.extend("ChipView",{
    ctor:function(chip)
    {
        this._super()
        this._sp = new cc.Sprite("image/room/followBg.png")
        this.addChild(this._sp)
        this._chip = chip
        this._text = new cc.LabelTTF(GHelper.convertChipNumToStr(chip),"fonts/AGENCYB.TTF",24)
        this._text.setFontFillColor(new cc.Color(248,171,91))
        this._text.setPositionY(1)
        this.addChild(this._text)

        this._offsetY = 0
        this._text.setPositionX(23)
        this._sp.setPositionX(15)
        this.refresh(this._chip)
    },

    getChipPos:function()
    {
        var x = -19
        var y = 0
        var posl = this.getPosition()
        var dty = this._offsetY
        if(dty>=3)
        {
            dty=dty-3
        }
        return { x: posl.x + x, y: posl.y + y + dty }
    },

    refresh:function(chip)
    {
        this._chip = chip
        if(this._chip<=0)
        {
            this.setVisible(false)
            return
        }
        this.setVisible(true)
        this._text.setString(GHelper.convertChipNumToStr(this._chip))
    }
})