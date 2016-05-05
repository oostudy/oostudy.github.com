/**
 * Created by chengang on 2015/7/9.
 */

Array.prototype.removeAt = function (index)
{
    if (this.length <= index || index < 0)
    {
        return;
    }
    for (var i = index + 1, n = index; i < this.length; ++i, ++n)
    {
        this[n] = this[i];
    }
    this.pop();
}
