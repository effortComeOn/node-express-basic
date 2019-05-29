const crypto = require('crypto');

var obj = crypto.createHash('md5');
let MD5_SUFFIX = 'fnskdnmsdkjNAJKskSi90w8(IW(AO*)(fmdnsmfu08IOJnm,n,msdknfjkdfgjkdf';
obj.update('wuzeyu' + MD5_SUFFIX)

let str = obj.digest('hex')
console.log(str);