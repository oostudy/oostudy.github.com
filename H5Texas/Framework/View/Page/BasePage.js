var BasePage = cc.Layer.extend("BasePage",{

    ctor:function()
    {
        this._super();
        cc.log(this.__classname + " ctor.......................");
    },

    _addTouchEvent:function(targetNameORtagORwidget,fun,touchEnable,eventType)
    {
        var widget = null;
    
        if(cc.isObject(targetNameORtagORwidget))
        {
            widget = targetNameORtagORwidget;
        }
        else
        {
            widget = this._getWidget(targetNameORtagORwidget);
        }

        if(!widget )
        {
            return;
        }
        if(touchEnable!=null )
        {
            widget.setTouchEnabled(touchEnable);
        }
        eventType = eventType || ccui.Widget.TOUCH_ENDED;
        if(widget)
        {
            widget.addTouchEventListener(function (sender,type)
            {
                if(eventType==-1 )
                {
                    fun(sender,type);
                }
                else if (type == eventType)
                {
                    fun(sender, type);
                }
            },null);
        }
        return widget;
    },

    _getWidget:function(nameORtag,isall)
    {
        if (!this._widget)
        {
            return null;
        }
        if (isall)
        {
            var children = [];
            this._widget.enumerateChildren(nameORtag, function (child) {
                children.push(child);
            })
            return children;
        }
        if(cc.isString(nameORtag))
        {
            var index=nameORtag.indexOf("/");
            if(index>0)
            {
                var children = [];
                this._widget.enumerateChildren(nameORtag,function(child)
                {
                    children.push(child);
                })
                return children[0];
            }
            else
            {
                return this._widget.getChildByName(nameORtag);
            }
        }
        else
        {
            return this._widget.getChildByTag(nameORtag);
        }
        return null
    },

    refresh:function(params)
    {
    },
    //选择在onOpen中加载页面的原因是因为，方便在之类里面重写
    //如果在onEnter中重写的话，那么会因为onEnter必须调用this._super()而导致问题
    onOpen:function(params)
    {
        cc.log(this.__classname + " has entered!");

        var pagePath = "Page/layout/" + this.__classname + ".json";

        var json = ccs.load(pagePath);
        if (!json)
        {
            cc.log(pagePath + " loaded failed!");
            return
        }

        this._widget = json.node;

        if (!this._widget)
        {
            cc.log(pagePath + " loaded failed!");
            return
        }

        this.addChild(this._widget);
        cc.log(pagePath + " loaded success!");
    },

    onClose:function(params)
    {
        cc.log(this.__classname + " has exited!");
    },

    onShow:function(params)
    {
        cc.log(this.__classname + " on show!");
    },

    onHide:function(params)
    {
        cc.log(this.__classname + " on hide!");
    }
});