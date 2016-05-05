GSkillMgr = 
{

    getNewSkill:function(skillId)
    {
        var skillDataItem = GCfg.getBuffById(skillId);
        if(skillDataItem)
        {
            return null;
        }
        var skill = eval(skillDataItem.Type);
        return new skill(skillDataItem);
    }
}