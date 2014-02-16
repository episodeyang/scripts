cd ~/.ssh
ssh-keygen -t rsa -C "yangge1987@gmail.com"
eval "$(ssh-agent)"
ssh-add ~/.ssh/id_rsa
