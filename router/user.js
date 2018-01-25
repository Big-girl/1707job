var light = require("ueklight");
var router = light.Router();
var mysql = require("./mysql");
var md5 = require("./md5");
var xlsx = require('node-xlsx');
var async = require("async");

router.get("/api/userPart", function (req, res) {
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


router.get("/api/addUserCon", function (req, res) {
    var uname = req.query.uname;
    var phone = req.query.phone;
    var pid = req.query.pid;
    var upass = md5("123456");

    mysql.query(`replace into user (uname,phone,upass,pid,photo) values ('${uname}','${phone}','${upass}',${pid},'')`, function (err1, result1) {
        if (err1) {
            red.end("err");
        } else {
            if (result1.affectedRows > 0) {
                res.end("ok")
            } else {
                res.end("err");
            }
        }
    })

})

// 1. 检查 数据的格式是不是合理  2. 合理的数据放到数据库

router.post("/api/upUser", function (req, res) {

    var obj = xlsx.parse(res.upInfo.path);

    //上传的数据
    var tableData = obj[0].data;

    //上传的数据的部门的信息 就业部
    var tablePartData = [];

    for (var i = 1; i < tableData.length; i++) {
        tablePartData.push(tableData[i][2]);
    }
    //
    var obj=new Set(tablePartData);
    tablePartData=Array.from(obj);

    // 数据库的数据  约定的东西
    var datas = [];
    async.series([
        //1.  找所有的信息
        function (next) {
            mysql.query("select * from part", function (err, result) {
                if (err) {
                    res.end("err");
                    next()
                } else {
                    datas = result;
                    next(null);
                }
            })
        },
        //2 找最小单位
        function (next) {
            function tree(data) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    var flag = true;
                    for (var j = 0; j < data.length; j++) {
                        if (data[i].pid == data[j].parentid) {

                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        arr.push(data[i]);
                    }
                }
                return arr;
            }

            next(null, tree(datas));
        }

    ], function (err, data) {
        //3. 上传的数据比对
        var data = data[1];
        // 当前出错的数据的容器
        var current=[];
        // 数据字典容器
        var same={};
        for (var i = 0; i < tablePartData.length; i++) {
            var flag=true;
            for (var j = 0; j < data.length; j++) {
                if (data[j].pname == tablePartData[i]) {
                    same[data[j].pname]=data[j].pid;
                    flag=false;
                    break;
                }
            }
            if(flag){
                current.push(tablePartData[i])
            }


        }

        //映射  数据字典


        if(current.length>0){
            res.end(JSON.stringify(current));
        }else{
            // 放到数据库
            var final=[];
            for(var i=1;i<tableData.length;i++){
                var arr=[];
                arr.push(md5('123456'));
                arr.push(tableData[i][0]);
                arr.push(tableData[i][1]);
                arr.push(same[tableData[i][2]]);
                final.push(arr);

            }

            mysql.query("replace into user (upass,uname,phone,pid) values ?",[final],function (err,result) {
             if(err){
                 res.end("err");
             }else{
                 res.end("ok");
             }
            })


        }

    })

})