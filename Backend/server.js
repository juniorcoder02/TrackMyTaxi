const http = require("http"); //http
const app = require("./app"); //require app
const port = process.env.PORT || 3000; //default port


const server = http.createServer(app); //create server

server.listen(port,()=>{ //listen on port
    console.log(`Server is running on port ${port}`);
}); 