//排座中随机堆的
var step = 15
GRamdonPoints=
[
    //1
    [0,0],
    //3
    [step,0],
    [step,step],
    [0,step],
    [-step,step],
    [-step,0],
    [-step,-step],
    [0,-step],
    [step,-step],
    //5
    [2*step,0],
    [2*step,step],
    [2*step,2*step],
    [step,2*step],
    [0,2*step],
    [-step,2*step],
    [-2*step,2*step],
    [-2*step,step],
    [-2*step,0],
    [-2*step,-step],
    [-2*step,-2*step],
    [-step,-2*step],
    [0,-2*step],
    [step,-2*step],
    [2*step,-2*step],
    [2*step,-step],
    //left 1
    [-3*step,1.5*step],
    [-3*step,0.5*step],
    [-3*step,-0.5*step],
    [-3*step,-1.5*step],
    //right 1
    [3*step,1.5*step],
    [3*step,0.5*step],
    [3*step,-0.5*step],
    [3*step,-1.5*step],
    //left 2
    [-4*step,step],
    [-4*step,0],
    [-4*step,-step],
    //right 2
    [4*step,step],
    [4*step,0],
    [4*step,-step],
    //left 3
    [-5*step,0.5*step],
    [-5*step,-0.5*step],
    //right 3
    [5*step,0.5*step],
    [5*step,-0.5*step],
    //left 3
    [-6*step,0.5*step],
    [-6*step,-0.5*step],
    //right 3
    [6*step,0.5*step],
    [8*step,-0.5*step],
    //left 4
    [-6*step,0],
    //right 4
    [6*step,0],
    //left 4
    [-7*step,0],
    //right 4
    [7*step,0],
]

var RandomHeapView = cc.Node.extend("ChipHeapView",{
    ctor:function(chip)
    {
        this._super()
        this._chip = chip
        this._curIndex = 1
    },

    addRandomChipPath:function(path,pos)
    {
        if (!this._root)
        {
            this._root = new cc.Node()
            this.addChild(this._root)
        }
        if(path && pos)
        {
            var sp = new cc.Sprite(path)
            sp.setPosition(cc.p(pos[0],pos[1]))
            this._root.addChild(sp)
            sp.setScale(0.58)
            if(!this._min_x || this._min_x>pos[1])
            {
                this._min_x = pos[1]
            }
            if(!this._max_x || this._max_x<pos[1])
            {
                this._max_x = pos[1]
            }
        }
    },
    getRandomPos:function()
    {
        var total = GRamdonPoints.length
        var rd = core.random(1, total)
        var pos=[0,0]
        if(rd<=this._curIndex)
        {
            pos = GRamdonPoints[rd]
        }
        else
        {
            pos = GRamdonPoints[this._curIndex]
            this._curIndex = this._curIndex + 1
        }
        var offsetx = core.random(-5,5)
        var offsety = core.random(-5, 5)
        pos[0] += offsetx
        pos[1] += offsety
        if(pos[1]>20 || pos[1]<-20)
        {
            var n = Math.floor(10*20/pos[2])
            if(n<0)
            {
                n = -n
            }
            var r = core.random(-n, n)
            pos[1] = pos[1]*r/10
        }
        return pos
    }
})