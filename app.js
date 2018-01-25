var light=require("ueklight");
require("./router/index");
require("./router/level");
require("./router/upload");
require("./router/admin");
require("./router/part");
require("./router/user");
require("./router/client/index");
require("./router/client/clientUserPart");
var query=require("uekquery");
var body=require("uekpost");
var cookie=require("uekcookie");
var multer=require("uekmulter");
var app=light();
app.use(query());
app.use(body());
app.use(cookie("12312"));
app.use(multer({filename:function () {
    return new Date().getTime()
}}))
app.get("/download",function (req,res) {
    res.download("./1707work.apk","1707work.apk")
})
app.listen(18080);
