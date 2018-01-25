var light=require("ueklight");
var router=light.Router();
var mysql=require("./mysql");
var md5=require("./md5");

router.get("/admin",function (req,res) {
    res.render("admin.html",{});
})
router.post("/api/addAdmin",function (req,res) {
    var aname=(req.body.aname);
    var apass=md5((req.body.apass));
    var rid=(req.body.rid);
    var photo=(req.body.photo);
    var sql=`insert into admin (aname,apass,rid,photo) values ('${aname}','${apass}','${rid}','${photo}')`;

    mysql.query(sql,function (err,result) {
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

router.get("/api/editPass",function (req,res) {
    var old=req.query.old;
    var news=req.query.news;
    var aid=req.query.aid;
    //1. 判断提交的旧密码对否  语法的解析  变量和函数

    mysql.query(`select apass from admin where aid=${aid}`,function (err,result) {
        if(result[0].apass==md5(old)){

            var newes=md5(news);


            mysql.query(`update admin set apass='${newes}' where aid=${aid}`,function (err,result) {
                res.end("修改成功");
            })

        }else{
            res.end("旧密码输入错误");
        }
    })



})