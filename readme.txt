HEXO+Github,搭建属于自己的博客
1 安装git 和 node.js 
2 npm install -g hexo 安装hexo
3 hexo init 初始化
4 hexo generate 生成
5 hexo deploy 发布
6 hexo server 启动 访问 localhost：4000
7 修改_config.yml 
  翻到最下面，改成我这样子的
  deploy:
  type: git
  repo:https://github.com/yourname/yourname.github.io.git
  branch:master
  然后执行命令：
  npm install hexo -deployer -git --save
  hexo deploy然后再浏览器中输入http://yourname.github.io/就行了