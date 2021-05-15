const {db} = require('../db')


//用户模块的数据持久化操作
const user= {
    //根据手机号获取用户信息
    getUserByPhone:async (phone)=>{
        const sql = `select id,phone,password,nickname,head_img,personal_sign,level_id, from t_user where phone = ${phone} and is_del =0`;
        return await db(sql)
    },
    //添加用户信息
    add:async (user)=>{
        //{name:'',phone:'',password:''}
        const sql = `insert into t_user (name, phone, password) VALUES (${user.name}, ${user.phone}, ${user.password})`
        return await db(sql)
    },
    //更新用户信息
    update:async (arr)=>{
        //[user,id]==>[{nickname:'',age:''},id]
        const sql = `updata t_user set nickname = ${arr[0].nickname}, age =  ${arr[0].age} where id =${arr[1]}`
        return await db(sql)
    },
    //伪删除用户信息
    del:async (id)=>{
        const sql = `updata t_user set is_del = 1 where id =${id}`
        return await db(sql)
    },
    //查询所有用户信息
    getAll:async ()=>{
        const sql ='select * where is_del =0'
        return await db(sql)
    }
}

module.exports  = user