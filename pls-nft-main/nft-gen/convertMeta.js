// ipfs 형식의 URI를 http URL 로 변환하여 파일을 생성
// const fs = require("fs");
// const { convertGatewayUrl } = require("./file.js");
// const META_FILE = "./meta.href.txt";

// const TOTAL_NUMBER = 5;

// for (let k=1; k<=TOTAL_NUMBER; k++) {
//     convertGatewayUrl(k).then(uri => {
//         fs.writeFileSync(META_FILE, uri + "\r\n", { flag: "a+" });
//     });
// }


const fs = require("fs");
const { toGatewayURL } = require("nft.storage");
const META_FILE = "./meta.href.txt";
const convertGatewayUrl = async (index) => {
    const buffer = await fs.readFileSync(META_FILE);
    let tokenUri = "";
    let regexp = new RegExp("(\r?\n)?" + index + "=(.*)\/metadata\.json", "g");
    let result = buffer.toString().match(regexp);
    if (result != null) {
       tokenUri = result[0].slice(result[0].indexOf("=")+1);
}
    return `${index}=${toGatewayURL(tokenUri).href}`;
}
for (let k=1; k<=5; k++) {
    convertGatewayUrl(k).then(uri => {
       fs.writeFileSync(META_FILE, uri + "\r\n", { flag: "a+" });
     });
}