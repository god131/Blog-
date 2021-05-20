//博客板块的数据持久化操作
module.exports = {
    //添加博客
    add:(blog)=>{

    },
    //更新博客
    update:(arr)=>{

    },
    //删除博客
    del:(id)=>{
        this.update([{ id_del: 1 },id])
    },
    //获取指定用户博文
    getUserBlog:(userId)=>{

    },
    //获取所有博文
    getBlog:()=>{

    }
}