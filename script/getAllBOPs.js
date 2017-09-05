function onGetFullState(err, res, addresse) {
  var bopObject = {};
  if (err) {
      alert("Error calling BOP method: " + err.message);
  }
  else {
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
  }
  BOPs.push(bopObject);
}

function buildBOPRows(){
  for(var bopCount = 0; bopCount < BOPs.length; bopCount++){
      if(bopCount !== 0) $("tbody").append($(".mainTableRow").first().clone());
      // console.log(STATES_MAPPING[BOPs[bopCount].state]);
      switch(STATES_MAPPING[BOPs[bopCount].state]){
        case("Open"):
          $(`.state:eq(${bopCount})`).parent().css("background-color", "aquamarine");
          break;
        case("Committed"):
          $(`.state:eq(${bopCount})`).parent().css("background-color", "cyan");
          break;
        case("Expended"):
          $(`.state:eq(${bopCount})`).parent().css("background-color", "grey");
          break;
      }
      $(`.state:eq(${bopCount})`).text(STATES_MAPPING[BOPs[bopCount].state]);
      $(`.contractAddress:eq(${bopCount})`).text(BOPs[bopCount].contractAddress);
      $(`.contractAddress:eq(${bopCount})`).attr("href", `../layout/interact.html?contractAddress=${BOPs[bopCount].contractAddress}`);
      $(`.payerAddress:eq(${bopCount})`).html(`\n <a href='${window.etherscanURL}${BOPs[bopCount].payer}'>${BOPs[bopCount].payer}</a>`);
      // $(`.payerAddress:eq(${bopCount})`).text(BOPs[bopCount].payer);
      if(BOPs[bopCount].recipient !== "0x0000000000000000000000000000000000000000"){
        // $(`.recipientAddress:eq(${bopCount})`).text("Recipient: \n" + );
        $(`.recipientAddress:eq(${bopCount})`).html(`Recipient \n <a href='${window.etherscanURL}${BOPs[bopCount].recipient}'>${BOPs[bopCount].recipient}</a>`);
      }else{
        $(`.recipientAddress:eq(${bopCount})`).html(`No Recipient! <a href='../layout/interact.html?contractAddress=${BOPs[bopCount].contractAddress}'> Commit ether to become the recipient.</a>`);
      }
      $(`.balance:eq(${bopCount})`).text(web3.fromWei(BOPs[bopCount].balance, 'ETHER'));
      $(`.commitThreshold:eq(${bopCount})`).text(web3.fromWei(BOPs[bopCount].commitThreshold, 'ETHER'));
      $(`.fundsDeposited:eq(${bopCount})`).text(web3.fromWei(BOPs[bopCount].amountDeposited, 'ETHER'));
      $(`.fundsBurned:eq(${bopCount})`).text(web3.fromWei(BOPs[bopCount].amountBurned, 'ETHER'));
      $(`.fundsReleased:eq(${bopCount})`).text(web3.fromWei(BOPs[bopCount].amountReleased, 'ETHER'));
      $(`.defaultAction:eq(${bopCount})`).text(DEFAULTACTION_MAPPING[Number(BOPs[bopCount].defaultAction)]);
      $(`.defaultTimeoutLength:eq(${bopCount})`).text(BOPs[bopCount].defaultTimeoutLength/60/60 + " hours");
      if(BOPs[bopCount].defaultTriggerTime != 0){
        $(`.defaultTriggerTime:eq(${bopCount})`).text(new Date(BOPs[bopCount].defaultTriggerTime * 1000));
      }
      else{
        $(`.defaultTriggerTime:eq(${bopCount})`).text(0 );
      }
      $(`.payerString:eq(${bopCount})`).text(BOPs[bopCount].payerString);
      $(`.recipientString:eq(${bopCount})`).text(BOPs[bopCount].recipientString);
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
            window.etherscanURL = "https://etherscan.io/address/"
        }
        else if (netID == 3) {
            console.log("You are on the Ropsten net!");
            BOP_FACTORY_ADDRESS = '0xf26083e4BeFc752DF93fa0402D5804649f0046C0';
            window.etherscanURL = "https://ropsten.etherscan.io/address/";
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
        window.event = BOPFactory.contractInstance.NewBOP({}, {"fromBlock": 1558897});//NewBOP is an event, not a method; it returns an event object.


        currentBOP = {
            "address": "",
            "ABI": BOP_ABI
        };

        currentBOP.contract = web3.eth.contract(currentBOP.ABI);

        event.get(function(error, result) {
            if(error){
              console.log(error);
            }
            else{
              for(var bopCount = 0; bopCount < result.length; bopCount++){
                var currentAddress = result[bopCount].args.newBOPAddress;
                currentBOP.contractInstance = currentBOP.contract.at(currentAddress);
                (function(currentAddress){
                currentBOP.contractInstance.getFullState(function(err,res){
                  onGetFullState(err, res, currentAddress);
                  if(result.length === BOPs.length){
                    buildBOPRows();
                  }
                });
              })(currentAddress);
              }
            }
        });
    });
});
