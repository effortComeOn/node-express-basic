const crypto = require("crypto")

module.exports={
  MD5_SUFFIX: 'fnskdnmsdkjNAJKskSi90w8(IW(AO*)(fmdnsmfu08IOJnm,n,msdknfjkdfgjkdf',
  md5: function(str){
    var obj = crypto.createHash('md5');
    
    obj.update(str);

    return obj.digest('hex');
  }
};

