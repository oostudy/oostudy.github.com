if (typeof (game) === 'undefined')
{
    game = {}
}
if (typeof (core) === 'undefined')
{
    core = {}
}
core.isUndefined = function (param)
{
    return typeof (param) === "undefined";
}
core.isObject = function (param)
{
    return typeof (param) === "object";
}
core.isArray = function (param)
{
    return typeof (param) === "Array" || param instanceof Array;
}
core.isNumber = function (param)
{
    if (core.isArray(param))
    {
        return false;
    }
    return !isNaN(param);
}
core.isFunction = function (param)
{
    return typeof (param) === "function";
}
core.isString = function (param)
{
    return typeof (param) === "string";
}
core.random = function (min, max)
{
    switch (arguments.length)
    {
        case 1: return parseInt(Math.random() * min + 1);
        case 2: return parseInt(Math.random() * (max - min + 1) + min);
        default: return math.random();
    }
    return Math.random();
}
core.clone = function (obj)
{
    if (core.isUndefined(obj))
    {
        return null;
    }
    if (core.isArray(obj))
    {
        var newArray = new Array();
        for (var i = 0, length = obj.length; i < length; ++i)
        {
            newArray[i] = this.clone(obj[i]);
        }
        return newArray;
    }
    if (core.isObject(obj))
    {
        var newObj = new Object();
        for (var i in obj)
        {
            newObj[i] = this.clone(obj[i]);
        }
        return newObj;
    }
    return obj;
}
//合并但是不改变dest
core.merge = function (dest, src)
{
    var t = core.clone(dest);
    if (!src)
    {
        return t;
    }
    if (core.isArray(src))
    {
        t = t || [];
        var tlen = t.length;
        for (var i = 0, len = src.length; i < len; ++i)
        {
            var value = src[i];
            if (core.isFunction(value))
            {
                continue;
            }
            if (core.isArray(value) || core.isObject(value))
            {
                if (i < tlen)
                {
                    t[i] = core.merge(null, value);
                }
                else
                {
                    t.push(core.merge(null, value));
                }
                
            }
            else
            {
                if (i < tlen)
                {
                    t[i] = value;
                }
                else
                {
                    t.push(value);
                }
            }
        }
    }
    else if (core.isObject(src))
    {
        t = t || {};
        for (var key in src)
        {
            var value = src[key];
            if (core.isFunction(value))
            {
                continue;
            }
            if (core.isArray(value) || core.isObject(value))
            {
                t[key] = core.merge(null, value);
            }
            else
            {
                t[key] = value;
            }
        }
    }
    else
    {
        t = src;
    }
    return t;
}
//只是取出template里面已经有的部分
core.getExit = function (template, src)
{
    if (!src || !template)
    {
        return {};
    }
    var t = {};
    for (var key in src)
    {
        if (core.isUndefined(template[key]))
        {
            continue;
        }
        var value = src[key];
        if (core.isFunction(value))
        {
            continue;
        }
        if (core.isArray(value) || core.isObject(value))
        {
            t[key] = core.getExit(template[key], value);
        }
        else
        {
            t[key] = value;
        }
    }
    return t;
}
core.dump = function (data)
{
    var strSpace = "    ";
    var _dump = function (data, intent)
    {
        var startIntentStr = "";
        for (var i = 0; i < intent; ++i)
        {
            startIntentStr += strSpace;
        }
        var contentStr = "";
        if (core.isArray(data))
        {
            contentStr += "\n" + startIntentStr + "[\n";
            for (var i = 0, length = data.length; i < length; ++i)
            {
                if (!core.isArray(data[i]) && !core.isObject(data[i]) && !core.isFunction(data[i]))
                {
                    contentStr += startIntentStr + strSpace + _dump(data[i], intent + 1) + ",\n";
                }
                else
                {
                    contentStr += startIntentStr + _dump(data[i], intent + 1) + ",\n";
                }
            }
            contentStr += startIntentStr + "]";
        }
        else if (core.isObject(data))
        {
            contentStr += startIntentStr + "{\n";
            for (var key in data)
            {
                contentStr += startIntentStr + strSpace + key + ":" + _dump(data[key], intent + 1) + ",\n";
            }
            contentStr += startIntentStr + "}";
        }
        else if (!core.isFunction(data))
        {
            if (core.isString(data))
            {
                return "\"" + data + "\"";
            }
            return data;
        }
        if (contentStr == "")
        {
            return "";
        }
        return contentStr;
    }
    console.log(_dump(data, 0));
}

core.toArray = function (table)
{
    var array = [];
    for (var key in table)
    {
        if (core.isFunction(table[key]))
        {
            continue;
        }
        array.push(key);
        array.push(table[key]);
    }
    return array;
}
try{
    var crypto = require('crypto');
    core.md5 = function (data)
    {
        var str = data;
        if (!core.isString(data))
        {
            str = JSON.stringify(data);
        }
    
        return crypto.createHash('md5').update(str).digest('hex');
    }
}
catch(e)
{

}

core.foreach = function (items,callback) 
{
    if(!items|| !callback)
    {
        return;
    }
    if(core.isNumber(items))
    {
        for(var i=0;i<items;++i)
        {
            callback(i);
        }
    }
    else if(core.isString(items))
    {
        for(var i=0,length=items.length;i<length;i++)
        {
            callback(i,items.charAt(i));
        } 
    }
    else if(core.isArray(items))
    {
        for(var i=0,length=items.length;i<length;++i)
        {
            callback(i,items[i]);
        }
    }
    else if(core.isObject(items))
    {
        for(var key in items)
        {
            callback(key,items[key]);
        } 
    }
    return;
}

core.find = function(items,callback)
{
    if(!items|| !callback)
    {
        return;
    }
    if(core.isArray(items))
    {
        for(var i=0,length=items.length;i<length;++i)
        {
            if(callback(items[i])===true)
            {
                return items[i];
            }
        }
    }
    else if(core.isObject(items))
    {
        for(var key in items)
        {
            if(callback(items[key])===true)
            {
                return items[key];
            }
        } 
    }
}

core.indexOf = function (items, value)
{
    if (!items || !value)
    {
        return;
    }
    if (core.isArray(items))
    {
        for (var i = 0, length = items.length; i < length; ++i)
        {
            if (items[i] === value)
            {
                return i;
            }
        }
    }
    else if (core.isObject(items))
    {
        for (var key in items)
        {
            if (items[key] === value)
            {
                return key;
            }
        }
    }
    return;
}