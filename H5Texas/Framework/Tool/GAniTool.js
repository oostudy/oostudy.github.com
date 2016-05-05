GAniTool=
{
    getArmature:function(armatureName)
    {
        return ccs.Armature.create(armatureName);
    },
    cacheArmature:function(path)
    {
        ccs.armatureDataManager.addArmatureFileInfo(path);
    },
    playArmature:function(target,path,name,action)
    {
        cc.log("prepare to get armature name="+path);
        var armature = target.getChildByTag(ETag.ArmatureRole);
        if(!armature)
        {
            this.cacheArmature(path);
            armature = this.getArmature(name);
            if(armature)
            {
                target.addChild(armature,0,ETag.ArmatureRole);
            }
        }
    
        if(!armature)
        {
            cc.log("===========error armature ["+name+"]");
            return null;
        }
        if (action)
        {
            armature.getAnimation().playWithNames([action]);
        }
        else
        {
            armature.getAnimation().playWithIndex(0);
        }
        
        return armature;
    },
    getSpriteFrameAnimationAction: function (animationObj, animationName)
    {
        if (!animationObj)
        {
            return null;
        }
        var animationObjData = null;
        if (cc.isString(animationObj))
        {
            animationObjData = GAnimationCfg[animationObj]
            if (!animationObjData)
            {
                return null;
            }
        }
        else
        {
            animationObjData = animationObj;
        }

        var animationData = animationObjData.animations[animationName];
        if (!animationData)
        {
            return null;
        }
        var fullAnimationName = animationObjData.id + "_" + animationName;
        var animation = cc.animationCache.getAnimation(fullAnimationName);
        if (!animation)
        {
            animation = new cc.Animation();
            var texture = cc.textureCache.addImage("animation/" + animationObjData.id + ".png");
            // frames
            var w = animationObjData.width;
            var h = animationObjData.height;
            var x = 0;
            var y = animationData.row * h;// + animationObjData.offset_y;
            for (var j = 0; j < animationData.length; j++)
            {
                x = j * w;// + animationObjData.offset_x;
                animation.addSpriteFrameWithTexture(texture, new cc.rect(x, y, w, h));
            }
            animation.setDelayPerUnit(1 / 8);
            animation.setRestoreOriginalFrame(true);
            cc.animationCache.addAnimation(animation, fullAnimationName);
        }
        if (!animation)
        {
            return null;
        }
        return cc.animate(animation);
    }
}