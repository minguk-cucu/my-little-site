const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript'};
http.createServer((req,res)=>{
  const pathname = new URL(req.url,'http://localhost').pathname;
  const file = pathname === '/' ? 'index.html' : pathname.slice(1);
  if(!['index.html','style.css','app.js','logic.mjs'].includes(file)){res.writeHead(404);res.end();return;}
  fs.readFile(path.join(__dirname,file),(err,data)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(file)] || 'text/javascript'});res.end(err?'Not found':data);});
}).listen(3000,'127.0.0.1',()=>console.log('나의 루틴 트래커: http://localhost:3000'));
