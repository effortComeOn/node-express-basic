const express = require('express');
const common  = require('../../libs/common');
const mysql   = require('mysql')
const pathLib= require('path')
const fs= require('fs')


var db = mysql.createPool({
  host:'localhost',
  user: 'root',
  password: 'wuzeyu...520',
  database: 'learn'
});

module.exports = function (){
  var router = express.Router()
  
  router.get('/', function(req, res){
    switch(req.query.act){
      case 'del'://删除
        db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${req.query.id}`, (err, data)=>{
          console.log(data)
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            if(data.length == 0){
              console.error(err)
              res.status(404).send('no this custom envaluation error').end();
            }else{
              fs.unlink('static/upload/'+data[0].src, (err,data)=>{
                console.log('=====')
                if(err){
                  console.error(err)
                  res.status(500).send('file operation error').end();
                }else{
                  db.query(`DELETE FROM custom_evaluation_table WHERE ID=${req.query.id}`, (err, data)=>{
                    if(err){
                      console.error(err);
                      res.status(500).send('database error').end();
                    }else{
                      res.redirect('/admin/custom');
                    }
                  });
                }
              })
            }
          }
        });
        break;
      case 'mod':
        db.query(`SELECT * FROM custom_evaluation_table WHERE id=${req.query.id}`, (err,data)=>{
          if(err){
            console.error(err)
            res.status(500).send('database error').end();
          }else if(data.length == 0){
            res.status(400).send('no this evaluation error').end();
          }else{
            db.query(`SELECT * FROM custom_evaluation_table`, (err,evaluation)=>{
              if(err){
                console.error(err)
                res.status(500).send('no this evaluation error').end();
              }else{
                res.render('admin/custom.ejs', {evaluation, mod_data: data[0]});        
              }
            })
          }
        })
        break;
      default: 
        db.query(`SELECT * FROM custom_evaluation_table`, (err, evaluation)=>{
          if(err){
            console.error(err)
            res.status(500).send('database error').end();
          }else{
            res.render('admin/custom.ejs',{evaluation})
          }
        })
        break;
    }
    
  })
  router.post('/', function(req, res){
    var title = req.body.title
    var description = req.body.description
    if(req.files[0]){
      var ext = pathLib.parse(req.files[0].originalname).ext
      var oldPath = req.files[0].path
      var newPath = req.files[0].path+ext

      var newFileName = req.files[0].filename + ext;

    }else{
      var newFileName = null;
    }

    if(newFileName){// 有头像
      fs.rename(oldPath, newPath, (err)=>{
        if(err){
          console.error(err)
          res.status(500).send('file operate error').end();
        }else{
          if(req.body.mod_id){ //修改
            // 删除老的头像，添加新的头像
            db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${req.body.mod_id}`, (err, data)=>{
              if(err){
                console.error(err);
                res.status(500).send('database error').end();
              }else if(data.length == 0){
                console.error(err);
                res.status(404).send('old file not found').end();
              }else{
                fs.unlink('static/upload/' + data[0].src, err=>{
                  if(err){
                    console.error(err)
                    res.status(500).send('file operations error').end();
                  }else{
                    db.query(`UPDATE custom_evaluation_table SET \
                    title='${title}',\
                    description='${description}' ,\
                    src='${newFileName}' \
                    WHERE ID=${req.body.mod_id}`,
                      (err,data)=>{
                        if(err){
                          console.error(err);
                          res.status(500).send('database error').end();
                        }else{
                          res.redirect('/admin/custom');
                        }
                      });
                  }
                })
              }
            })
          }else { //添加
            db.query(`INSERT INTO custom_evaluation_table (title, description, src) VALUES('${title}', '${description}', '${newFileName}')`,
            (err,data)=>{
              if(err){
                console.error(err);
                res.status(500).send('database error').end();
              }else{
                res.redirect('/admin/custom');
              }
            });
          }
        }
      });
    }else{// 没有头像
      if(req.body.mod_id){ //修改
        // 直接改
        db.query(`UPDATE custom_evaluation_table SET \
        title='${title}',\
        description='${description}' WHERE ID=${req.body.mod_id}`,
        (err,data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/custom');
          }
        });
      }else { 
        db.query(`INSERT INTO custom_evaluation_table (title, description) VALUES('${title}', '${description}')`,
            (err,data)=>{
              if(err){
                console.error(err);
                res.status(500).send('database error').end();
              }else{
                res.redirect('/admin/custom');
              }
            });
      }
    }
  })

  return router
}