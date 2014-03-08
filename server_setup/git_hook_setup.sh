sudo apt-get install git

mkdir ~/www
mkdir ~/repo

cd ~/repo
git clone https://github.com/episodeyang/SpruceQuizJunior.git
cd SpruceQuizJunior/
cat > hooks/post-receive
#!/bin/sh
GIT_WORK_TREE=~/www
export GIT_WORK_TREE
git checkout -f

chmod +x hooks/post-receive

