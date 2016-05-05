_GMax_Local_Z_Order = 10000

var BaseRole = cc.Node.extend("BaseRole", {

    _actionState: EActionState.Idle,
    faceDirection: EDirection.Right,
    _roleDM: null,
    _ai: null,
    _triggers: [],
    ctor: function (roleDataModel)
    {
        this._super();
        this._triggers = [];
        this._actionState = EActionState.Idle;
        this.faceDirection = EDirection.Right;
        this._ai = null;
        this._roleDM = roleDataModel;
        return true;
    },
    getCode:function()
    {
        return this._roleDM.code;
    },
    init: function ()
    {
        this._updateAnimation();
    },
    onEnter: function ()
    {
        this._super();
        this.scheduleUpdate();
        this.init();
        var pos = this.getPosition();
        this.setLocalZOrder(_GMax_Local_Z_Order - pos.y);

        this._triggers = [];
    },
    onExit: function ()
    {
        this._super();
        for (var i = 0, length = this._triggers.length; i < length; ++i)
        {
            GTriggerMgr.removeConditionTriggerEvent(this._triggers[i].type, this._triggers[i].code);
        }
        this._triggers = [];
    },
    update: function (dt)
    {
        if (!this._prePos)
        {
            this._prePos = this.getPosition();
            return;
        }
        var pos = this.getPosition();
        if (Math.abs(this._prePos.y - pos.y) < 10)
        {
            return;
        }
        this.setLocalZOrder(_GMax_Local_Z_Order - pos.y);
        this._prePos = pos;
    },
    changeDirection: function (dir)
    {
        if (dir == this._faceDirection)
        {
            return false;
        }
        this._faceDirection = dir;

        if (this._faceDirection == EDirection.Right)
        {
            this.setScaleX(1);
        }
        else
        {
            this.setScaleX(-1);
        }
        return true;
    },

    changeActionState: function (actionState)
    {
        if (actionState == this._actionState)
        {
            return false;
        }
        this._actionState = actionState;
        this._updateAnimation();
        return true;
    },

    _getActionName: function ()
    {
        return this._actionState;
    },

    _updateAnimation: function (animation_name, is_loop)
    {
        if (cc.isUndefined(is_loop))
        {
            is_loop = true;
        }
        if (cc.isUndefined((animation_name)))
        {
            animation_name = this._actionState;
        }
        this._showAnimation(animation_name, is_loop);
        return true;
    },

    _convertToLegalPos: function (pos)
    {
        var curMap = GMapMgr.getCurMap();

        pos.x = pos.x < curMap.minX ? curMap.minX : pos.x;
        pos.x = pos.x > curMap.maxX ? curMap.maxX : pos.x;
        pos.y = pos.y < curMap.minY ? curMap.minY : pos.y;
        pos.y = pos.y > curMap.maxY ? curMap.maxY : pos.y;

        return pos;
    },

    moveTo: function (dstPosition, callback)
    {
        var curPos = this.getPosition();

        if (cc.pFuzzyEqual(curPos, dstPosition, 10))
        {
            if (callback)
            {
                cc.log("-----------------" + this._roleDM.baseData.nickname)
                callback();
            }
            return;
        }
        var bDiffDirection = true;
        if (curPos.x < dstPosition.x)
        {
            bDiffDirection = this.changeDirection(EDirection.Right);
        }
        else
        {
            bDiffDirection = this.changeDirection(EDirection.Left);
        }

        this.stopAllActions();

        if (this._actionState != EActionState.Walk || this._actionState != EActionState.Run)
        {
            this._actionState = EActionState.Walk;
            this._updateAnimation();
        }

        var moveAction = cc.moveTo(cc.pDistance(dstPosition, curPos) / this._roleDM.getMoveSpeed(), dstPosition);
        var pCallback = cc.CallFunc(this.stop.bind(this));
        if (callback)
        {
            this.runAction(new cc.Sequence(moveAction, pCallback, cc.CallFunc(callback)));
        }
        else
        {
            this.runAction(new cc.Sequence(moveAction, pCallback));
        }
    },

    stop: function ()
    {
        this._actionState = EActionState.Idle;
        this._updateAnimation();
    },


    addTarget: function (target)
    {
        if (!target || !this._ai)
        {
            return;
        }
        this._ai.addTarget(target);
    },
    behaviorAnimation: function (name, isloop, callback)
    {
        this.stopAllActions();
    },
    //随意走走
    behaviorWalkAny: function ()
    {
        var pos = this.getPosition();
        var rdis = GHelper.random(50, 500);
        var rangle = GHelper.random(0, 360);
        var tpos = cc.p(rdis, 0);
        tpos = this._convertToLegalPos(cc.pRotateByAngle(tpos, pos, rangle));
        this.moveTo(tpos, this.behaviorWalkAny.bind(this));
    },
    behaviorPersue: function (target)
    {
        if (!target)
        {
            return;
        }
        var pos = this.getPosition();
        var tpos = this._convertToLegalPos(target.getPosition());
        if (cc.pFuzzyEqual(pos, tpos, 20))
        {
            return;
        }
        this.moveTo(tpos, this.behaviorPersue.bind(this, target));
    },

    behaviorDie: function ()
    {

    },
    _showAnimation: function (name, isloop, callback)
    {
    },
    //播放动画
    behaviorAnimation: function (name, isloop, callback)
    {
        this._showAnimation(name, isloop, callback);
    },
    doSkill: function (skill_name)
    {
        var self = this;
        this._showAnimation(skill_name, false, function ()
        {
            self._ai.goto("idle");
        });
        var skill_cfg = this._roleDM.baseData.skills[skill_name];
        if (!skill_cfg)
        {
            return;
        }
        var rect = this.getPosition();
        rect.width = skill_cfg.range.width;
        rect.height = skill_cfg.range.height;
        var targets = this._ai.getTargets();
        for (var i = 0, length = targets.length; i < length; ++i)
        {
            var pos = targets[i].getPosition();
            if (pos.x > rect.x
                && pos.x < rect.x + rect.width
                && pos.y > rect.y - rect.height / 2
                && pos.y < rect.y + rect.height / 2
                )
            {
                targets[i].onHit(this._roleDM);
            }
        }
    },
    onHit: function (srcDM)
    {
        cc.log(this._roleDM.getNickName() + "  on hit!");
        var damage = GGameTool.getDamage(srcDM, this._roleDM, "attack");
        this._roleDM.addHP(-damage);
        if (!this._ai)
        {
            return;
        }
        this._ai.goto("hit");
    }
});