const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const { face, body, background } = require("./traits.js");
const { saveMetadataUri } = require("./file.js");

const {NFTStorage, File } = require("nft.storage");

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJhMTJlMDYxQzlEMDA1OURCOTMxMmNGYkNjRjI0M2VmREI1YjgxNzAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0OTU1NDc3MTI3NywibmFtZSI6IlBMUy1ORlQifQ.4Rh1O3Q6gRcD85e_s5SxukSyhzBJiyEqZkAaq8CnBHU"; // NFT Storage에서 받은 API 키를 넣는다.

const client = new NFTStorage({ token: apiKey })


const canvas = createCanvas(500, 500);
const ctx = canvas.getContext('2d');

const FILE_PATH = "./images";


const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('04c56984522e244e4eb9', '4c76cc639d498c6c908114884f082bc906ea92f144cbff232bb7bcf7152ea9f0');
const IPFS_URL = "https://gateway.pinata.cloud/ipfs";
const IPFS_IMAGE_HASH = "QmW37aryUbLg4sptTM4qw9T8nm4mzHSyR5upxtvnvNRJru";


//
const getAttributes = (v, k) => {
    
    let attributes = {};
    let trait_type = "";
    let value = "";
    
    switch (k) {
        case 0:
            trait_type = "Face";
            value = face[v-1].name;
            break;
        case 1:
            trait_type = "Body";
            value = body[v-1].name;
            break;
        case 2:
            trait_type = "Background";
            value = background[v-1].name;
            break;
        default:
            trait_type = "";
            value = "";
    }
    
    attributes.trait_type = trait_type;
    attributes.value = value;
    
    return attributes;
}



// 생성된 배열을 하나씩 받아서 하나의 이미지를 생성한다.
// 이미지 파일명은 N001.png 형식으로 저장한다.
const saveImage = (canvas, index) => {
    const filename = `N${index.toString().padStart(3,0)}`;
    fs.writeFileSync(`${FILE_PATH}/_Final/${filename}.png`, canvas.toBuffer("image/png"));
    //console.log(filename);
};

// 메타데이터를 생성하고 IPFS 에 업로드
// t=토큰 조합(배열), i=인덱스
const uploadMetaData = async (t, i) => {
    
    let metadata = {
        description: "PLS::Park Loves Sea NFT",
        name: `PLS-${i}`,
        type: "Collectable",
        image: "https://",
        attributes: [],
    };

    // 토큰 조합은 배열, 속성은 3개
    for (let k=0; k<3; k++) {
        metadata.attributes.push(getAttributes(t[k], k));
    }
    
    const filename = `N${i.toString().padStart(3,0)}`;
    metadata.image = new File([await fs.promises.readFile(`${FILE_PATH}/_Final/${filename}.png`)], `${filename}.png`, {
        type: 'image/png',
    })
    // metadata.image = `${IPFS_URL}/${IPFS_IMAGE_HASH}/${filename}.png`;
    
    const result = await client.store(metadata); // NFT Storage 서비스에 업로드한다.
    console.log(`${i}=${result.url}`);
    saveMetadataUri(`${i}=${result.url}`); // 나중에 토큰 발행할 때 사용하기 위해 파일에 저장한다.
}


const create = async (t, i) => {

    const face = await loadImage(`${FILE_PATH}/Face/${t[0]}.png`);
    const body = await loadImage(`${FILE_PATH}/Body/${t[1]}.png`);
    const background = await loadImage(`${FILE_PATH}/Background/${t[2]}.png`);

    // 아래서 부터 위로 순서를 지켜야 한다.
    // 각 요소의 위치를 이미 맞추어 이미지를 만들었으므로 좌표는 (0,0)에 맞춘다.
    await ctx.drawImage(background, 0, 0, 500, 500);
    await ctx.drawImage(body, 0, 0, 500, 500);
    await ctx.drawImage(face, 0, 0, 500, 500);

    saveImage(canvas, i+1); // 배열의 인덱스는 0부터 시작하고 토큰 번호는 1부터 시작

    await uploadMetaData(t, i+1);

};

module.exports = {
    create
}
