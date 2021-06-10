const express = require('express');
const {db} = require('./db');
const app = express();
/*const util = require('./util');*/
const user = require('./manage/user');
/*const blog = require('./manage/blog');*/
const path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');


app.use('/static',express.static(__dirname+'/static'));
//引入ejs
app.engine('.html',require('ejs').__express);
//设置具体路由
app.set('views',path.join(__dirname,'pages'));
app.set('view engine','html');

/*1.负责页面跳转
2.负责数据处理*/


//发送get请求
app.get('/index',(res,resp)=>{
  resp.render('index',{
    title:'首页'
  })
})
app.get ('/getUserMain', (req, res) => {
  res.render ('Data', {
    tltle: '我的朋友'
  })
})
app.get('/toMine',(req,res)=>{
  res.render('mine',{
    title :'个人简介'
  })
})
//登入界面
app.get('/', (req, res) =>{
  res.render('login',{
    title:"登入界面"
  })
})

//评论回复
app.get('/toSpeak',(req,res)=>{
  res.render('speak',{
    title :'论坛天地'
  })
})
//注册界面
app.get('/toRegister',(req,res)=>{
  res.render('register',{
    title :'注册界面'
  })
})
//后台管理
app.get('/toAdmin',(res,resp)=> {
  resp.render ('admin', {
    title: '后台管理'
  })
})
//获取数据库
  app.get ('/getUser', (req, res) => {
    let sql = `select * from friends`;
	if (req.query.page) {
		sql = `select * from friends limit ${(req.query.page - 1) * 10}, 20`;
	}
    console.log (sql)
    db (sql, null,).then (res1 => {
		console.log(res1)
      res.send (res1)
    })
  })
app.get ('/getUser2', (req, res) => {
  let sql = `select * from user`;
  if (req.query.page) {
    sql = `select * from user limit ${(req.query.page - 1) * 10}, 10`;
  }
  console.log (sql)
  db (sql, null,).then (res1 => {
    console.log(res1)
    res.send (res1)
  })
})
  // 注册
  app.get ('/register', (req, res) => {
    const sql = 'INSERT INTO user (`username`, `password`) VALUES ' + `('${req.query.userName}', '${req.query.password}');`
    console.log(sql)
    db (sql, null,).then (res1 => {
      res.send (res1)
    })
  })
  // 登录
  app.get ('/login', (req, res) => {
    console.log(req.query)
    const sql = `select * from user WHERE username = '${req.query.username}' and password = '${req.query.password}'`
    console.log(sql)
    db (sql, null,).then (res1 => {
      console.log(res1)
      res.send (res1)
    })
  })
  // 根据名字搜索用户
  app.get ('/searchUser', (req, res) => {
    const sql = `select * from friends WHERE name like '%${req.query.name}%'`;
    db (sql, null,).then (res1 => {
      res.send (res1)
    })
  })
app.get ('/searchUser2', (req, res) => {
  const sql = `select * from user WHERE username like '%${req.query.name}%'`;
  db (sql, null,).then (res1 => {
    res.send (res1)
  })
})
  // 删除用户
  app.get ('/deleteUser', (req, res) => {
    const sql = `DELETE FROM friends WHERE id = ${req.query.id}`;
    console.log (db)
    db (sql, null,).then (res1 => {
      res.send (res1)
    })
  })
// 删除用户
app.get ('/deleteUser2', (req, res) => {
  const sql = `DELETE FROM user WHERE id = ${req.query.id}`;
  console.log (db)
  db (sql, null,).then (res1 => {
    res.send (res1)
  })
})
//判断用户信息是否已经存在
  app.get ('/user/getUserPhone', async (req, resp) => {
    //调用该方法返回数据库数据
    const use = await user.getUserByPhone ()
    console.log ('user:', use)
  })
//添加数据
  app.get ('/addUser', (req, res) => {
    user.del ('15').then (res => {
      console.log (res)
    })
  })
// 修改数据
app.get ('/saveInfo', (req, res) => {
  const sql = `UPDATE friends SET ${req.query.name} = '${decodeURI(req.query.value)}' WHERE id = ${req.query.id}`;
  console.log(sql)
  db (sql, null,).then (res1 => {
    res.send (res1)
  })
})
app.get ('/saveInfo2', (req, res) => {
  const sql = `UPDATE user SET ${req.query.username} = '${decodeURI(req.query.value)}' WHERE id = ${req.query.id}`;
  console.log(sql)
  db (sql, null,).then (res1 => {
    res.send (res1)
  })
})

app.get ('/addInfo', (req, res) => {
  const sql = `INSERT INTO friends (name, sex, birthday, type) VALUES (${decodeURI(req.query.name)}, ${decodeURI(req.query.sex)}, ${decodeURI(req.query.birthday)}, ${decodeURI(req.query.type)});`
  console.log(sql)
  db (sql, null,).then (res1 => {
    console.log (res1)
    res.send (res1)
  })
})

app.get ('/addInfo2', (req, res) => {
  const sql = `INSERT INTO user (username, password) VALUES (${decodeURI(req.query.username)}, ${decodeURI(req.query.password)});`
  console.log(sql)
  db (sql, null,).then (res1 => {
    res.send (res1)
  })
})
// 配置修改数据库用户名、及密码及数据库名
var config = {
  "dataBase": {
      "server": "127.0.0.1",
      "port": 3306,
      "user": "root",
      "password": "111",
      "name": "demo"
  }
}

//监听服务端端口
  app.listen (3000, () => {
    /*  var host = server.address().address
      var port = server.address().port*/
    console.log ('server is start');
  })
module.exports=app;



























/*//页面跳转
app.get('/',(req,resp)=>{
  fs.readFile('pages/index.html',(err, data) => {
    if (!err){
      resp.end(data);
    }else {
      console.log (err);
    }
  });
})

//跳转到登入页面
app.get('/toLogin',(req, resp) =>{
  fs.readFile('pages/login.html',(err, data) => {
    if (!err){
      resp.end(data);
    }else {
      console.log (err);
    }
  });
})*/

/*
//执行sql,查询
var user_sql = 'SELECT * FROM friends';
connection.query(user_sql,function(err,result) {
  if (err) {
    console.log ('[query]-:' + err);
  } else {
    //拿到result将其作为data渲染给模板引擎，比如这里的index页面
    app.get ('/toData', function (req, resp) {
      resp.render ('Data', {
        title: '我的朋友们',
        data: result
      });
    });
  }
  })
 */