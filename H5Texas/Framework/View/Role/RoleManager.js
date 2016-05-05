GRoleMgr=
{
    _bossRole:[],
    _enemyRole:[],
    _hero:null,
    init:function()
    {
        this._bossRole={};
        this._enemyRole={};
        this._hero=null;
        return true;
    },

    createRole:function(roleDataModel)
    {
        if (!HeroRole)
        {
            return null;
        }
        this._hero = new HeroRole(roleDataModel);
        return this._hero;
    }
}