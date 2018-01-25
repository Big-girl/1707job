var light=require("ueklight");
var router=light.Router();

router.post("/api/upload",function (req,res) {

     var relPath=(res.upInfo.relPath);
     res.end(relPath);
})