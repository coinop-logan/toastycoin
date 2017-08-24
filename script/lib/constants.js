//Declare global abi variables
var bopFactoryAbi;
var bopAbi;

//get JSON data
$.getJSON('../js/abiDefinitions/bop_factory_abi.json', function(data){
   bopFactoryAbi = data;
   const BOP_FACTORY_ABI = bopFactoryAbi;
});

$.getJSON('../js/abiDefinitions/bop_abi.json', function(data){
   bopAbi = data;
});

//intialize global constants from variables
  
const BOP_ABI = bopAbi;
console.log(BOP_FACTORY_ABI);
const BOP_FACTORY_ADDRESS = '0x1953da4bceBC9579156586C4528aF151381d6Bb6';