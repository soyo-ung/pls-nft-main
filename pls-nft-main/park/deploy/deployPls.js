// PLS 토큰 배포 스크립트
//
module.exports = async ({deployments, getNamedAccounts}) => {
    
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    
     const PLS = await deploy("PLSnft", {from: deployer, log: true});
     //console.log(`Contract address = ${PLS.address}`);
     //log(`GasUsed=${PLS.receipt.gasUsed}`);
     
};

module.exports.tags = ['PLS'];
