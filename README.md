A responsive one page web application build for my football team. Used to keep track of players, game stats and fines. To see the full page: holdet.tk

The page is build in Angular with a Express Node.js server and the data is saved in a MongoDB. Everything is hosted in the cloud, delivered using containerisation (Docker).

docker run -d --name fodbold -p 8080:80 -p 27017:27017  lalan/fodbold:latest  sh /webpage/start.sh
