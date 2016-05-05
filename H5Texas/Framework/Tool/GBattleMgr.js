GBattleMgr =
{
    _mapData: null,
    _current: -1,
    _heros: [],
    _monsters: [],
    _bosses: [],
    startBattle: function (mapData)
    {
        this._current = -1;
        this._heros = [];
        this._monsters = [];
        this._bosses = [];
        this._mapData = mapData;

        this._triggers = [];
        var triggercode = GTriggerMgr.addConditionTriggerEvent(EConditionType.Die, this.onDie.bind(this));
        this._triggers.push(triggercode)

        this.gotoNextBattle();
    },
    gotoNextBattle: function ()
    {
        if (!this._mapData)
        {
            cc.log("----------error---------gotoNextBattle->mapData can not null!");
            return false;
        }
        this._current += 1;
        if (this._current < 0)
        {
            return false;
        }
        if (this._current >= this._mapData.levels.length)
        {
            return false;
        }
        GMapMgr.openMap(this._mapData.levels[this._current]);
        this._onMapInitDone();
        return true;
    },
    onDie: function (obj)
    {
        if (!obj)
        {
            return;
        }
        for (var i = 0, length = this._monsters.length; i < length; ++i)
        {
            if (this._monsters[i] === obj)
            {
                this._monsters.removeAt(i);
                if (this._monsters.length <= 0 && this._bosses.length <= 0)
                {
                    this._onWin();
                }
                return;
            }
        }
        for (var i = 0, length = this._bosses.length; i < length; ++i)
        {
            if (this._bosses[i] === obj)
            {
                this._bosses.removeAt(i);
                if (this._monsters.length <= 0 && this._bosses.length <= 0)
                {
                    this._onWin();
                }
                return;
            }
        }
        for (var i = 0, length = this._heros.length; i < length; ++i)
        {
            if (this._heros[i] === obj)
            {
                this._heros.removeAt(i);
                if (this._heros.length <= 0)
                {
                    this._onLose();
                }
                return;
            }
        }
    },
    _onWin: function ()
    {
        if (!this.gotoNextBattle())
        {
            this._onBattleEnd(true);
        }
    },
    _onLose: function ()
    {
        this._onBattleEnd(false);
    },
    _onBattleEnd: function (isWin)
    {
        if(isWin)//通关
        {
            
        }
        else//失败
        {

        }
    },
    addHero: function (hero)
    {
        this._heros.push(hero)
    },
    createMonster: function (mapMonsterData)
    {
        var monster = new MonsterRole(new RoleDataModel(mapMonsterData.baseData, mapMonsterData.extraData));
        this._monsters.push(monster);
        return monster;
    },
    createBoss: function (mapBossData)
    {
        var boss = new MonsterRole(new RoleDataModel(mapBossData.baseData, mapBossData.extraData));
        this._bosses.push(boss);
        return boss;
    },
    _onMapInitDone: function ()
    {
        if (this._heros.length <= 0)
        {
            return;
        }
        for (var i = 0, length = this._monsters.length; i < length; ++i)
        {
            for (var j = 0, num = this._heros.length; j < num; ++j)
            {
                this._monsters[i].addTarget(this._heros[j]);
                this._heros[j].addTarget(this._monsters[i]);
            }
        }
        for (var i = 0, length = this._bosses.length; i < length; ++i)
        {
            for (var j = 0, num = this._heros.length; j < num; ++j)
            {
                this._bosses[i].addTarget(this._heros[j]);
                this._heros[j].addTarget(this._bosses[i]);
            }
        }
    }
};