const express = require('express');
const common  = require('../../libs/common');
const mysql   = require('mysql')

var db = mysql.createPool({
  host:'localhost',
  user: 'root',
  password: 'wuzeyu...520',
  database: 'learn'
});

module.exports = function (){
  var router = express.Router()
  
  router.get('/get_banners', function(req, res){
    db.query(`SELECT * FROM banner_table`,(err,data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{//数据库请求成功
        res.send(data).end();
      }
    })
  })

  router.post('/user_login', function(req, res){
    let user = req.body.user, pass = req.body.pass;

    db.query(`SELECT * FROM user_table WHERE user='${user}'`,(err,data)=>{//查询是否有这个用户
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{//数据库请求成功
        if(data.length == 0){// 没有此用户
          db.query(`INSERT INTO user_table (user, pass) VALUE('${user}', '${pass}')`, (err, data)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{//数据库请求成功
              res.send({
                msg: '注册成功',
                status: 200
              }).end();
            }
          })
        }else{// 登陆
          if(data[0].pass == pass){
            // 成功
            req.session['user_id']=data[0].ID;
            res.send({
              msg: '登陆成功',
              status: 200
            }).end();
          }else{
            res.status(400).send('password or username error').end()
          }
        }
      }
    })
  })

  return router;
}