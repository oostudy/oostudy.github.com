var IWebSocketNode = cc.Node.extend("IWebSocketNode", {
    _websocket: null,
    _addr: "",
    ctor: function (addr)
    {
        this._super();
        this._addr = addr;
        this.init();
    },
    init: function ()
    {
        this._websocket = new WebSocket(this._addr);
        this._websocket.onopen = this.onOpen.bind(this);
        this._websocket.onclose = this.onClose.bind(this);
        this._websocket.onerror = this.onError.bind(this);
        this._websocket.onmessage = this.onMessage.bind(this);
    },
    onOpen: function (evt)
    {
        cc.log("WebSocket onOpen");
    },
    onClose: function (evt)
    {
        cc.log("WebSocket onClose");
        this._websocket = null;
        this.init();//断线重连
    },
    onError: function (evt)
    {
        cc.log("WebSocket onError");
    },
    onMessage: function (evt)
    {
        if (!evt || !evt.data)
        {
            cc.log("Error receive msg: none data!");
            return;
        }
        var jsonData = JSON.parse(evt.data);
        if (!jsonData.cmd || jsonData.cmd == "")
        {
            cc.log("Error receive msg no cmd:" + evt.data);
            return;
        }
        GHelper.dump(jsonData);
        if (!jsonData.isSuccess)
        {
            cc.log(jsonData.tip);
            return;
        }
        if (this["receive_" + jsonData.cmd])
        {
            this["receive_" + jsonData.cmd](jsonData);
        }
    },
    getNewMsg:function(cmd)
    {
        var msg =
        {
            cmd:cmd
        }
        return msg;
    },
    send: function (data)
    {
        if (!this._websocket)
        {
            return;
        }
        if (!data)
        {
            console.log("Send Message warning:null data!")
            return;
        }
        var strData = "";
        if (cc.isString(data))
        {
            strData = data;
        }
        else
        {
            strData = JSON.stringify(data);
        }
        this._websocket.send(strData);
    }
});