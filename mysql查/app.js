const Koa=require('koa')
const app=new Koa()
const static=require('koa-static')
const router=require('koa-router')()
const path=require('path')
const bodyparser=require('koa-bodyparser')
app.use(static(path.join(process.cwd(),'./public')))
app.use(bodyparser())
app.use(router.routes())
app.use(router.allowedMethods())
let query=require('./db/index')
router.get('/api/user',async(ctx,next)=>{
    let data=await query('select * from test')
    console.log(data)
    ctx.body={
        code:1,
        data
    }
})
router.post('/api/add',async(ctx)=>{
    let {name,age,sex}=ctx.request.body
    if(name&&age&&sex){
        let data=await query('select * from test where name=?',[name])
        if(data.length){
            ctx.body={
                code:2,
                msg:'用户名已存在'
            }
        }else{
            try{
                await query('insert into test (name,age,sex) values (?,?,?)',[name,age,sex])
                ctx.body={
                    code:1,
                    msg:'添加成功'
                }
            }catch(e){
                ctx.body={
                    code:0,
                    msg:e
                }
            }
        }
    }else{
        ctx.body={
            code:2,
            msg:'参数丢失'
        }
    }
})
router.delete('/api/del',async(ctx)=>{
    let {id}=ctx.query
    if(id){
        try{
            await query('delete from test where id=?',[id])
            ctx.body={
                code:1,
                msg:'删除成功'
            }
        }catch(e){
            ctx.body={
                code:0,
                msg:e
            }
        }
    }else{
        ctx.body={
            code:2,
            msg:'参数丢失'
        }
    }
})
router.put('/api/update',async(ctx)=>{
    let {name,age,sex,id}=ctx.request.body
    if(name&&age&&sex&&id){
        try{
            await query('update test set name=?,age=?,sex=? where id=?',[name,age,sex,id])
            ctx.body={
                code:1,
                msg:'更新成功'
            }
        }catch(e){
            ctx.body={
                code:0,
                msg:e
            }
        }
    }else{
        ctx.body={
            code:2,
            msg:'参数丢失'
        }
    }
})
router.get('/api/fenye',async(ctx)=>{
    let {pagenum=1,limit=2}=ctx.query
    let startIndex=(pagenum-1)*limit
    let data=await query(`select * from test where sex=? limit ${startIndex},${limit}`,['女'])
    ctx.body={
        code:1,
        data
    }
})
app.listen(3000,()=>{
    console.log("服务启动")
})