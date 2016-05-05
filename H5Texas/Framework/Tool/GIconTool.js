
GIconTool = 
{
    getItemIconPath:function(param)
    {
        var name;
        if(cc.isString(param))
        {
            name = param;
        }
        else
        {
            var itemDataItem = GCfg.getItemById(param);
            if(!itemDataItem)
            {
                return "";
            }
            name = itemDataItem.IconName;
        }

        return "Icon/Item/"+name+".png"
    },
    getHeroIconPath:function(param)
    {
        var name;
        if(cc.isString(param))
        {
            name = param;
        }
        else
        {
            var heroDataItem = GCfg.getHeroById(param);
            if(!heroDataItem)
            {
                return "";
            }
            name = heroDataItem.IconName;
        }
    
        return "Icon/Hero/" + name + ".png";
    },
    getOtherIconPath:function(name)
    {
        return "Icon/Other/" + name + ".png";
    },
    getItemIconTexture:function(param)
    {
        var spr = cc.Sprite.create(this.getItemIconPath(param));
        if(!spr){
            return nil;
        }
        return spr.getTexture();
    },
    getHeroIconTexture:function(param)
    {
        var spr = cc.Sprite.create(this.getHeroIconPath(param));
        if(!spr){
            return nil;
        }
        return spr.getTexture();
    },
    getOtherIconTexture:function(name)
    {
        var spr = cc.Sprite.create(this.getOtherIconPath(name));
        if(!spr){
            return nil;
        }
        return spr.getTexture();
    },
    getItemIconSprite:function(param)
    {
        return cc.Sprite.create(this.getItemIconPath(param));
    },
    getHeroIconSprite:function(param)
    {
        return cc.Sprite.create(this.getHeroIconPath(param));
    },
    getOtherIconSprite: function (name)
    {
        return cc.Sprite.create(this.getOtherIconPath(name));
    }
}