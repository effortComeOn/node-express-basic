const express = require('express');
const mysql   = require('mysql')

var db = mysql.createPool({
  host:'localhost',
  user: 'root',
  password: 'wuzeyu...520',
  database: 'learn'
});

module.exports = function (){
  var router = express.Router()
  
  router.get('/', (req, res)=>{
    switch(req.query.act){
      case 'mod':
        db.query(`SELECT * FROM banner_table WHERE id=${req.query.id}`, (err,data)=>{
          if(err){
            console.error(err)
            res.status(500).send('database error').end();
          }else if(data.length == 0){
            res.status(400).send('data error').end();
          }else{
            db.query(`SELECT * FROM banner_table`, (err,banners)=>{
              if(err){
                console.error(err)
                res.status(500).send('database error').end();
              }else{
                res.render('admin/banner.ejs', {banners, mod_data: data[0]});        
              }
            })
          }
        })
        break;
      case 'del':
        db.query(`DELETE FROM banner_table WHERE ID=${req.query.id}`, (err,data)=>{
          if(err){
            console.error(err)
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/banner');        
          }
        })
        break;
      default:
        db.query(`SELECT * FROM banner_table`, (err,banners)=>{
          if(err){
            console.error(err)
            res.status(500).send('database error').end();
          }else{
            res.render('admin/banner.ejs', {banners});        
          }
        })
        break;
    }
    
  })
  router.post('/', (req, res)=>{
    var title = req.body.title
    var description = req.body.description
    var href = req.body.href

    if(!title || !description || !href){
      res.status(400).send('arg error').end();
    }else{
      if(req.body.mod_id){//修改
        db.query(`UPDATE banner_table SET \
          title="${req.body.title}",\
          description="${req.body.description}",\
          href="${req.body.href}" \
          WHERE ID=${req.body.mod_id}`, (err, data)=>{
          if(err) {
            console.error(err);
            res.status(400).send('arg error').end();
          }else{
            res.redirect('/admin/banner')
          }
        })
      
      }else{              //添加
        db.query(`INSERT INTO banner_table (title, description, href) VALUE('${title}', '${description}', '${href}')`, (err, date)=>{
          if(err){
            console.error(err)
            res.status(400).send('arg error').end();
          }else{
            res.redirect('/admin/banner')
          }
        })
      }
    }
  })

  return router;
}