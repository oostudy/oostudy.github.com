GAudioTool=
{
    playMusic:function(path,loop)
    {
        if(!path)
        {
            return
        }
        cc.audioEngine.playMusic(path, loop)
        cc.log("play----------"+path)
    }
}