HEXO+Github,������Լ��Ĳ���
1 ��װgit �� node.js 
2 npm install -g hexo ��װhexo
3 hexo init ��ʼ��
4 hexo generate ����
5 hexo deploy ����
6 hexo server ���� ���� localhost��4000
7 �޸�_config.yml 
  ���������棬�ĳ��������ӵ�
  deploy:
  type: git
  repo:https://github.com/yourname/yourname.github.io.git
  branch:master
  Ȼ��ִ�����
  npm install hexo -deployer -git --save
  hexo deployȻ���������������http://yourname.github.io/������