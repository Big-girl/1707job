var light = require("ueklight");
var router = light.Router();
var mysql = require("../mysql");
var md5 = require("../md5");

router.get("/api/clientUserPart", function (req, res) {
    var pid = req.query.pid;
    mysql.query("select * from part where parentid=" + pid, function (err, result) {
        if (err) {
            res.end("err")
        } else {
            for (var i = 0; i < result.length; i++) {
                (function (i) {
                    mysql.query("select * from part where parentid=" + result[i].pid, function (err, result1) {
                        if (err) {
                            res.end("err");
                        } else {
                            if (result1.length > 0) {
                                result[i].son = true;
                            } else {
                                result[i].son = false;
                            }
                            result[i].style = {};
                            if (i == result.length - 1) {
                                res.end(JSON.stringify(result));
                            }
                        }

                    })

                })(i)
            }
        }
    })
})

router.get("/api/clientSelectUser",function (req,res) {
    var pid=req.query.pid;
    mysql.query("select * from user where pid="+pid,function (err,result) {
        if(err){
            res.end("err")
        }else{
            for(var i=0;i<result.length;i++){

                result[i].style={};
            }
            res.end(JSON.stringify(result));
        }
    })
})