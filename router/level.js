var light=require("ueklight");
var router=light.Router();
var mysql=require("./mysql");
var md5=require("./md5");

/*
*   获取leval的信息
* */
router.get("/api/editLevelCon/:id",function (req,res) {
    var lid=req.params.id;
    mysql.query("select * from level where lid="+lid,function (err,result) {
        if(err){
            var obj={message:"err"};
            res.send(JSON.stringify(obj));
        }else{
            var obj={message:"ok",data:result};
            res.send(JSON.stringify(obj));
        }
    })

})

router.get("/api/editLevelSubmitCon",function (req,res) {
   var lid=(req.query.lid);
   var lname=(req.query.lname);
   var lnum=(req.query.lnum);

   mysql.query(`update level set lname='${lname}',lnum='${lnum}' where lid=`+lid,function (err,result) {
       if(err){
           res.end("err")
       }else{
           if(result.affectedRows>0){
               res.end("ok");
           }else{
               res.end("err");
           }
       }
   })

})

/*
* 删除 leval
* */

router.get("/api/delLevel/:id",function (req,res) {
    var lid=req.params.id;
    mysql.query("delete from level where lid="+lid,function (err,result) {
        if(err){
            res.end("err")
        }else{
            if(result.affectedRows>0){
                res.end("ok")
            }else{
                res.end("err");
            }
        }
    })
})