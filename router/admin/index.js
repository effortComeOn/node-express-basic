const express = require('express');

module.exports = function (){
  var router = express.Router()

  // 检查登陆状态
  router.use((req, res, next)=>{
    if(!req.session['admin_id'] && req.url != '/login'){//没有登陆
      res.redirect('/admin/login');
    }else{
      next();
    }
  })

  router.get('/', (req, res)=>{
    res.render('admin/index.ejs', {});
  })

  router.use('/banner', require('./banner')());
  router.use('/login', require('./login')());
  router.use('/custom', require('./custom')());

  return router;
};