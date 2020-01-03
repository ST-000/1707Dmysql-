const mysql=require('mysql')
module.exports=(sql,params=[])=>{
    let connection=mysql.createConnection({
        host:"localhost",
        port:"3306",
        user:"root",
        password:"root",
        database:"test"
    })
    connection.connect((error)=>{
        if(error){
            console.log('连接失败')
        }else{
            console.log("连接成功")
        }
    })
    return new Promise((resolve,reject)=>{
        connection.query(sql,params,(error,data)=>{
            if(error){
                reject(error)
            }else{
                resolve(data)
            }
            connection.end()
        })
    })
}