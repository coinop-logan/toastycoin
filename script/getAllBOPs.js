function onNewBOP(error, result) {
    if (!error) {
        console.log(result);
    }
}

window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    }
    else {
        alert("metamask/mist not detected. This site probably won't work for you. Download the metamask addon and try again!");
    }
    web3.version.getNetwork((err, netID) => {
        if (netID == 1) {
            console.log("You are on the Ethereum main net!");
        }
        else if (netID == 3) {
            console.log("You are on the Ropsten net!");
            BOP_FACTORY_ADDRESS = '0x9B9a993A36AcD108F251308AE28A82f8E41D01f8';
        }
        else{
          alert("You aren't on the Ethereum main or Ropsten net! Try changing your metamask options to connect to the main network.");
        }
        window.BOPFactory = {
            "address": BOP_FACTORY_ADDRESS,
            "ABI": BOP_FACTORY_ABI
        };
        BOPFactory.contract = web3.eth.contract(BOPFactory.ABI);
        BOPFactory.contractInstance = BOPFactory.contract.at(BOPFactory.address);
        
        //get all newBOP events
        window.BOPs = [];
        window.event = BOPFactory.contractInstance.NewBOP({}, {"fromBlock":0});//NewBOP is an event, not a method; it returns an event object.
        event.get(onNewBOP);
    });
});
