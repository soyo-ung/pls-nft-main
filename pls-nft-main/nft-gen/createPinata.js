const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const { face, body, background } = require("./traits.js");
const { saveMetadataUri } = require("./file.js");
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('04c56984522e244e4eb9', '4c76cc639d498c6c908114884f082bc906ea92f144cbff232bb7bcf7152ea9f0');
const IPFS_URL = "https://gateway.pinata.cloud/ipfs";
const IPFS_IMAGE_HASH = "QmW37aryUbLg4sptTM4qw9T8nm4mzHSyR5upxtvnvNRJru";
const canvas = createCanvas(500, 500);
const ctx = canvas.getContext('2d');
const FILE_PATH = "./images";



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


const saveImage = (canvas, index) => {
    const filename = `N${index.toString().padStart(3,0)}`;
    fs.writeFileSync(`${FILE_PATH}/_Final/${filename}.png`, canvas.toBuffer("image/png"));
    //console.log(filename);
};


const create = async (t, i) => {
    const face = await loadImage(`${FILE_PATH}/Face/${t[0]}.png`);
    const body = await loadImage(`${FILE_PATH}/Body/${t[1]}.png`);
    const background = await loadImage(`${FILE_PATH}/Background/${t[2]}.png`);
    await ctx.drawImage(background, 0, 0, 500, 500);
    await ctx.drawImage(body, 0, 0, 500, 500);
    await ctx.drawImage(face, 0, 0, 500, 500);
    saveImage(canvas, i+1);
    await uploadMetaData(t, i+1);
};


const uploadMetaData = async (t, i) => {
    let metadata = {
       description: "PLS::Park Loves Sea NFT",
       name: `PLS-${i}`,
       type: "Collectable",
       image: "https://",
       attributes: [],
};
    for (let k=0; k<3; k++) {
       metadata.attributes.push(getAttributes(t[k], k));
    }
    const filename = `N${i.toString().padStart(3,0)}`;
    metadata.image = `${IPFS_URL}/${IPFS_IMAGE_HASH}/${filename}.png`;

    const options = {
        pinataMetadata: {name: "pls-nft-meta"},
        pinataOptions: {
            cidVersion: 0
        }
    };
    try { 
        const result = await pinata.pinJSONToIPFS(metadata, options);
        saveMetadataUri(`${i}=${IPFS_URL}/${result.IpfsHash}`);
    } catch (err){
        console.log(err);
    }
}

module.exports= {
    createPinata: create
}