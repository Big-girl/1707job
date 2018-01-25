var light=require("ueklight");
var router=light.Router();
var mysql=require("./mysql");
var md5=require("./md5");

router.get("/api/addPart",function (req,res) {
    var parentid=req.query.parentid;
    var pname=req.query.pname;
    mysql.query(`insert into part (parentid,pname) values ('${parentid}','${pname}')`,function (err,result) {
        if(err){
            res.end("err");
        }else{
            if(result.affectedRows>0){


                res.end(result.insertId.toString());
            }else{
                res.end("err");
            }
        }
    })
})

router.get("/api/selectPart",function (req,res) {
    mysql.query("select * from part",function (err,result) {
        res.end(JSON.stringify(result));
    })
})

router.get("/api/delPart",function (req,res) {
     var pid=(req.query.pid);
     mysql.query("delete from part where pid="+pid,function (err,result) {
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

router.get("/api/editPart",function (req,res) {
    var parentid=req.query.parentid;
    var pname=req.query.pname;
    var pid=req.query.pid;
    mysql.query(`update part set parentid='${parentid}',pname='${pname}' where pid=${pid}`,function (err,result) {
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