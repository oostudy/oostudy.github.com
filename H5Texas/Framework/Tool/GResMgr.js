GResMgr=
{

    init:function()
    {
        if(!this.initArmature())
        {
            return false
        }
        cc.log("success for ResourecManager init!")
        return true
    },

    initArmature:function()
    {
        ccs.armatureDataManager.addArmatureFileInfo(GCfg.ArmatureFolder+"Hero/Hero.ExportJson");
        cc.log("load "+GCfg.ArmatureFolder+"Hero/Hero.ExportJson!");
        return true;
    }
}