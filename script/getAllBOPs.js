function onGetFullState(err, res, addresse, currentTime) {
  var bopObject = {};
  bopObject['contractAddress'] = addresse;
  bopObject['state'] = res[0].toString();
  bopObject['payer'] = res[1].toString();
  bopObject['payerString'] = res[2].toString();
  bopObject['recipient'] = res[3].toString();
  bopObject['recipientString'] = res[4].toString();
  bopObject['balance'] = res[5].toString();
  bopObject['commitThreshold'] = res[6].toString();
  bopObject['amountDeposited'] = res[7].toString();
  bopObject['amountBurned'] = res[8].toString();
  bopObject['amountReleased'] = res[9].toString();
  bopObject['defaultAction'] = res[10].toString();
  bopObject['defaultTimeoutLength'] = res[11].toString();
  bopObject['defaultTriggerTime'] = res[12].toString();
  bopObject['defaultTriggerTimePassed'] = (currentTime >= Number(res[12]));
  BOPs.push(bopObject);
  buildBOPRow();
}

function buildBOPRow(){
  if(BOPs.length !== 1) $("tbody").append($(".mainTableRow").first().clone());
  // console.log(BOP_STATES[BOPs[bopCount].state]);
  switch(BOP_STATES[BOPs[BOPs.length-1].state]){
    case("Open"):
      $(`.state:eq(${BOPs.length-1})`).parent().css("background-color", "aquamarine");
      break;
    case("Committed"):
      $(`.state:eq(${BOPs.length-1})`).parent().css("background-color", "cyan");
      break;
    case("Expended"):
      $(`.state:eq(${BOPs.length-1})`).parent().css("background-color", "grey");
      break;
  }
  $(`.state:eq(${BOPs.length-1})`).text(BOP_STATES[BOPs[BOPs.length-1].state]);
  $(`.contractAddress:eq(${BOPs.length-1})`).text(BOPs[BOPs.length-1].contractAddress);
  $(`.contractAddress:eq(${BOPs.length-1})`).attr("href", `../layout/interact.html?contractAddress=${BOPs[BOPs.length-1].contractAddress}`);
  $(`.payerAddress:eq(${BOPs.length-1})`).html(`\n <a href='${window.etherscanURL}${BOPs[BOPs.length-1].payer}'>${BOPs[BOPs.length-1].payer}</a>`);
  // $(`.payerAddress:eq(${BOPs.length-1})`).text(BOPs[BOPs.length-1].payer);
  if(BOPs[BOPs.length-1].recipient !== "0x0000000000000000000000000000000000000000"){
    // $(`.recipientAddress:eq(${BOPs.length-1})`).text("Recipient: \n" + );
    $(`.recipientAddress:eq(${BOPs.length-1})`).html(`Recipient \n <a href='${window.etherscanURL}${BOPs[BOPs.length-1].recipient}'>${BOPs[BOPs.length-1].recipient}</a>`);
  }else{
    $(`.recipientAddress:eq(${BOPs.length-1})`).html(`No Recipient! <a href='../layout/interact.html?contractAddress=${BOPs[BOPs.length-1].contractAddress}'> Commit ether to become the recipient.</a>`);
  }
  $(`.balance:eq(${BOPs.length-1})`).text(web3.fromWei(BOPs[BOPs.length-1].balance, 'ETHER'));
  $(`.commitThreshold:eq(${BOPs.length-1})`).text(web3.fromWei(BOPs[BOPs.length-1].commitThreshold, 'ETHER'));
  $(`.fundsDeposited:eq(${BOPs.length-1})`).text(web3.fromWei(BOPs[BOPs.length-1].amountDeposited, 'ETHER'));
  $(`.fundsBurned:eq(${BOPs.length-1})`).text(web3.fromWei(BOPs[BOPs.length-1].amountBurned, 'ETHER'));
  $(`.fundsReleased:eq(${BOPs.length-1})`).text(web3.fromWei(BOPs[BOPs.length-1].amountReleased, 'ETHER'));
  $(`.defaultAction:eq(${BOPs.length-1})`).text(BOPs[BOPs.length-1].defaultAction);
  $(`.defaultTimeoutLength:eq(${BOPs.length-1})`).text(BOPs[BOPs.length-1].defaultTimeoutLength/60/60 + " hours");
  if(BOPs[BOPs.length-1].defaultTriggerTime != 0){
    if(BOPs[BOPs.length-1].defaultTriggerTimePassed){
      $(`.defaultTriggerTime:eq(${BOPs.length-1})`).text(new Date(BOPs[BOPs.length-1].defaultTriggerTime * 1000).toLocaleString());
      $(`.defaultTriggerTime:eq(${BOPs.length-1})`).css("color","red");
    }
    else{
      $(`.defaultTriggerTime:eq(${BOPs.length-1})`).text(secondsToDhms(Number(BOPs[BOPs.length-1].defaultTriggerTime - currentTime)));
      $(`.defaultTriggerTime:eq(${BOPs.length-1})`).css("color","green");
    }
  }
  else{
    $(`.defaultTriggerTime:eq(${BOPs.length-1})`).text(0);
  }
  $(`.payerString:eq(${BOPs.length-1})`).text(BOPs[BOPs.length-1].payerString);
  $(`.recipientString:eq(${BOPs.length-1})`).text(BOPs[BOPs.length-1].recipientString);
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
        window.etherscanURL = "https://etherscan.io/address/"
        window.bopFactoryCreationBlock = 4207091;
    }
    else if (netID == 3) {
        console.log("You are on the Ropsten net!");
        //BOP_FACTORY_ADDRESS = '0xd8f2858612b05527ea41b5eb9d016c690e3a1b5d'//'0xf26083e4BeFc752DF93fa0402D5804649f0046C0';
        window.etherscanURL = "https://ropsten.etherscan.io/address/";
        window.bopFactoryCreationBlock = 0;
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
    window.event = BOPFactory.contractInstance.NewBOP({}, {"fromBlock": bopFactoryCreationBlock});//NewBOP is an event, not a method; it returns an event object.
    // window.recoverEvent = BOPFactory.contractInstance.FundsRecovered({}, {"fromBlock": 1558897});

    currentBOP = {
        "address": "",
        "ABI": BOP_ABI
    };

    currentBOP.contract = web3.eth.contract(currentBOP.ABI);

    web3.eth.getBlock("latest",function(err,res){
      if (err) {
          console.log("Error calling BOP method: " + err.message);
      }
      else{
        currentTime = res.timestamp;
        BOPFactory.contractInstance.getContractCount(function(err,res){
          if (err) {
              console.log("Error calling BOP method: " + err.message);
          }
          else {
            var contractArray = [];
            for(var conCounter = 0; conCounter < Number(res); conCounter++){
              BOPFactory.contractInstance.contracts(conCounter, function(err,res){
                if (err) {
                    console.log("Error calling BOP method: " + err.message);
                }
                else{
                  var currentAddress = res;
                  (function(currentAddress){
                    web3.eth.getCode(currentAddress, function(err, res){
                      if(err){
                        console.log("Error calling BOP method: " + err.message);
                      }
                      else if(res !== "0x"){
                        currentBOP.contractInstance = currentBOP.contract.at(currentAddress);
                        currentBOP.contractInstance.getFullState(function(err,res){
                          if(err){
                            console.log("Error calling BOP method: " + err.message);
                          }
                          else{
                            onGetFullState(err, res, currentAddress, currentTime);
                          }
                        });
                      }
                    });
                  })(currentAddress);
                }
              });
            }
          }
        });
      }
    });
  });
});
