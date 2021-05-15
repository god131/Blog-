const mysql = require('mysql')

var config = {
  "dataBase": {
      "server": "127.0.0.1",
      "port": 3306,
      "user": "root",
      "password": "111",
      "name": "demo"
  }
}

//[],{},[{},id]
exports.db = (sql)=>{
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection({
      host     : config.dataBase.server,
      port     : config.dataBase.port,
      user     : config.dataBase.user,
      password : config.dataBase.password,
      database : config.dataBase.name
    });
    connection.connect();
    connection.query(sql, function (error, results, fields) {
      connection.end();
      if (error) {
        reject(error)
      }
      resolve(results)
    })
  })
}

