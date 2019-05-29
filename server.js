const express       = require('express')
const static        = require('express-static')
const bodyParser    = require('body-parser')
const multer        = require('multer')
const multerObj     = multer({dest: './static/upload'})
const mysql         = require('mysql')
const cookieParser  = require('cookie-parser')
const cookieSession = require('cookie-session')
const consolidate   = require('consolidate')
const expressRoute  = require('express-route')

var server = express()
server.listen(3000)

// 1、获取到请求数据
// get自带
server.use(bodyParser.urlencoded());
server.use(multerObj.any());

// 2、cookie，session
server.use(cookieParser());
(function (){
  var keys = [];
  for(let i=0; i<10000;i++){
    keys[i]='a_'+Math.random();
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000 //20min
  }));
})();

// 3、模版
server.engine('html', consolidate.ejs);
server.set('views', 'templete');
server.set('view engine', 'html');

// 4、router

server.use('/admin/', require('./router/admin')());
server.use('/', require('./router/web')());

// 5、default： static
server.use(static('./static/'));