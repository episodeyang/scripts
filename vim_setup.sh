cp .vimrc.default ~/.vimrc

mkdir ~/.vim
mkdir ~/.vim/syntax
cp vimFiles/python.vim ~/.vim/syntax/

mkdir ~/.vim/ftplugin
mkdir ~/.vim/ftplugin/python
cp vimFiles/SimpylFold.vim ~/.vim/ftplugin/python

mkdir ~/.vim/colors
cp vimFiles/blackboard.vim ~/.vim/colors/
cp vimFiles/zenburn.vim ~/.vim/colors/
cp vimFiles/codeschool.vim ~/.vim/colors/

mkdir -p ~/.vim/autoload ~/.vim/bundle; \
    curl -LSso ~/.vim/autoload/pathogen.vim \
    https://raw.githubusercontent.com/tpope/vim-pathogen/master/autoload/pathogen.vim

cd ~/.vim/bundle
git clone https://github.com/scrooloose/syntastic.git

