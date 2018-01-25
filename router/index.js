var light=require("ueklight");
var router=light.Router();
var mysql=require("./mysql");
var md5=require("./md5");
var access=require("./access");
var fs=require("fs");
var path=require("path");

router.get("/",function (req,res) {
    res.render("index.html",{});
})
router.get("/api/showAdmin",function(req,res){
    var aid=req.query.aid;
    var rid=req.query.rid;


    if(rid==3) {
        mysql.query("select admin.*,role.rname as rname from admin,role where admin.rid=role.rid", function (err, result){
                var data={data:result};
                res.send(JSON.stringify(data));
        })
    }else{
        mysql.query("select admin.*,role.rname as rname from admin,role where admin.rid=role.rid and admin.aid="+aid, function (err, result) {

            mysql.query("select lid from role where rid="+rid,function (err,result1) {
                var data={data:result,lid:result1[0].lid};
                res.send(JSON.stringify(data));
            })

        })

    }
})
router.post("/api/checkLogin",function (req,res) {
     var user=req.body.user.replace(/['"]/g,"");
     var pass=md5(req.body.pass);
     var sql=`select aid,aname,rid from admin where aname='${user}' and apass='${pass}'`;
     mysql.query(sql,function (err,result) {
         if(err){
             var obj={message:"err",data:{}}
             res.end(JSON.stringify(obj));
         }else{
             if(result.length>0){
                 var obj={message:"ok",data:result}
                 res.end(JSON.stringify(obj));
             }else{
                 var obj={message:"err",data:{}}
                 res.end(JSON.stringify(obj));
             }
         }
     })

})

/*

  添加权限

*/
router.get("/api/addLevel",function (req,res) {
    var lname=(req.query.lname);
    var lnum=(req.query.lnum);
    mysql.query(`insert into level (lname,lnum) values ('${lname}','${lnum}')`,function (err,result) {
        if(err){
            res.end("err")
        }else{
            if(result.affectedRows>0){
                res.send("ok")
            }else{
                res.send("err");
            }
        }
    })

})

/*查看权限*/

router.get("/api/showLevel",function (req,res) {

    mysql.query("select * from level",function (err,result) {
        if(err){
            var obj={message:"err",data:{}};
            res.end(JSON.stringify(obj))
        }else{
            var obj={message:"ok",data:result};
            res.send(JSON.stringify(obj));
        }
    })
})

/*添加角色的信息*/

router.get("/api/addRoleInfo",function (req,res) {
    var rname=req.query.lname;
   var lnum=req.query.lnum.slice(1,-1);
   mysql.query(`insert into role (rname,lid) values ('${rname}','${lnum}')`,function (err,result) {
       if(err){
           res.end("err");
       }else{
           if(result.affectedRows>0){
               res.end("ok");
           }else{
               res.end("err");
           }
       }
   })

})


/*获取角色的信息
*
*  nodejs  异步  javascript
*
*    需要耗费时间
*    不确定时间
*
*    非阻塞  异步的代码 执行的顺序不确定
*
*    队列  promise  async
*
*    result
*
*    [
*    {rid:1,rname:"超级"，lid:"1,2,3,4"},
*    {rid:2,rname:"编辑"，lid:"1,2"},
*    {rid:3,rname:"普通"，lid:"1"},
*
*    ]
*
*    levels
*
*    [

*    {lid:10,lname:"删除",lnum:1},
*    {lid:12,lname:"编辑",lnum:2},
*    {lid:13,lname:"查询",lnum:3},
*    {lid:13,lname:"添加",lnum:4},
*    ]
*
*
*
* */

router.get("/api/showRole",function (req,res) {
    var sql="select * from role";
    mysql.query(sql,function (err,result) {
        if(err){
            res.end("err");
        }else{

             mysql.query("select * from level",function(err,levels){
                 if(err){
                     res.end("err");
                 }else{

                     for(var i=0;i<result.length;i++){
                         var lids=result[i].lid.split(",");

                        for(var j=0;j<lids.length;j++){
                            for(var k=0;k<levels.length;k++){

                                if(lids[j]==levels[k].lnum){
                                    var obj={lid:levels[k].lnum,lname:levels[k].lname}
                                    lids[j]=obj;
                                }
                            }
                            result[i].lid=lids;
                            result[i].levels=levels;
                        }



                     }

                 }

                 res.send(JSON.stringify(result));
             })



        }
    })

})

/*获取简单的role的信息*/

router.get("/api/selectRole",function (req,res) {
    var sql="select rid,rname from role";
    mysql.query(sql,function (err,result) {
        if(err){
            res.end("err");
        }else{
            res.send(JSON.stringify(result));
        }
    })
})

/*修改角色信息*/

router.get("/api/editRole",function (req,res) {
    var rname=(req.query.rname);
    var lid=(req.query.lid);
    var rid=(req.query.rid);
    var sql=`update role set rname='${rname}',lid='${lid}' where rid=${rid}`;
    mysql.query(sql,function (err,result) {
        if(err){
            res.end("err");
        }else{
            if(result.affectedRows>0){
                res.end("ok");
            }else{
                res.send("err");
            }
        }
    });
});

/*
*
* 删除 角色信息
*
*
*   编辑 角色
*
*   用户  张三
*
* */

router.get("/api/delRole",function (req,res) {

    var rid=req.query.rid;
    var aid=req.query.aid;


    access(aid,1,function(){

        //1. 看角色里面有没有用户,数据库里面查询 异步  回调地狱  队列  promise  async light
        //2. 用户删掉  异步
        //3. 删除角色  异步
        //4.  删除照片 异步
        //5.php 同步  阻塞 多线程  消耗资源
        //  nodejs  开启多线程 多进程  单线程 异步机制

        // 线程   进程

        //  河流 1条  洪水

        //1.  5河流

        //2. promise  回调

        //1. 查用户的信息
        mysql.query("select * from admin where rid="+rid,function (err,result) {
            if(err){
                res.end("err");
            }else{
                if(result.length>0){
                    //1. 把数据删掉 照片删掉

                    //10.  10用户  10个回调函数

                    for(var i=0;i<result.length;i++){
                        var photo=result[i].photo;
                        fs.unlinkSync(path.resolve(photo))
                    }
                    mysql.query("delete from admin where rid="+rid,function (err,result1) {
                        if(err){
                            res.end("err")
                        }else{
                            if(result1.affectedRows>0){


                                mysql.query("delete from role where rid="+rid,function (err,result3) {
             if(err){
                 res.end("err")
             }else{
                if(result3.affectedRows>0){
                    res.end("ok")
                }else{
                    res.end("err");
                }
             }
                                })
                            }else{
                                res.end("err");
                            }
                        }
                    })
                }else{
                    mysql.query("delete from role where rid="+rid,function (err,result2) {
                        if(err){
                            res.end("err")
                        }else{
                            if(result2.affectedRows>0){
                                res.end("ok");

                            }else{
                                res.send("err");
                            }
                        }
                    })
                }
            }
        })






        /*
        mysql.query("delete from role where rid="+rid,function (err,result) {
            if(err){
                res.end("err");
            }else{
                if(result.affectedRows>0){
                    res.end("ok");
                }else{
                    res.end("err");
                }
            }
        })
        */
    },function () {
        res.end("err");
    })

})



