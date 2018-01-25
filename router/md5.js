var crypto=require("crypto");

function md5(str){
    var md5obj=crypto.createHash("md5");
    md5obj.update(str);
    return (md5obj.digest("hex"));
}

module.exports=md5;
