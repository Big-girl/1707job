var light=require("ueklight");
var router=light.Router();
var mysql=require("../mysql");
var md5=require("../md5");

router.get("/",function (req,res) {
    res.render("index.html",{});
})

router.post("/api/checkClientLogin",function (req,res) {
    var uname=req.body.uname.replace(/['"]/g,"");
    var upass=md5(req.body.upass);
    var sql=`select uid,uname from user where uname='${uname}' and upass='${upass}'`;
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



router.get("/api/newSelect",function (req,res) {
    var page=req.query.page;
    var num=req.query.num;
    var pages=page*num;
    mysql.query(`select * from news limit ${pages},${num}`,function (err,result) {
        if(err){
            res.end("err")
        }else{
            res.end(JSON.stringify(result));
        }
    })
})

router.get("/api/conSelect",function (req,res) {
    var nid=req.query.nid;
    mysql.query("select * from news where nid="+nid,function (err,result) {
        if(err){
            res.end("err")
        }else{
            res.end(JSON.stringify(result[0]));
        }
    })
})

router.get("/api/selectPhone",function (req,res) {

    mysql.query("select * from user",function (err,result) {
        res.end(JSON.stringify(result));
    })
})


router.get("/api/saveLog",function (req,res) {
   var uid1=(req.query.uid1);
   var uid2=(req.query.uid2);
   var title=(req.query.title);
   var con=(req.query.con);

   mysql.query(`insert into logs (uid1,uid2,title,con) values (${uid1},${uid2},'${title}','${con}')`,function (err,result) {
       if(err){
           res.end("err")
       }else{
           res.end("ok");
       }
   })

})

router.get("/api/selectLogs",function (req,res) {
    var uid=req.query.uid;
    var type=req.query.type;
    console.log(type);

    var sql="";
    if(type=="send"){
       sql="select * from logs where uid1="+uid;
    }else{
        sql="select * from logs where uid2="+uid;
    }
    mysql.query(sql,function (err,result) {

        res.send(JSON.stringify(result));
    })
})