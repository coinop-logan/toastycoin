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
  buildBOPRow();
}

function buildBOPRow(){
  if(BOPs.length !== 1) $("tbody").append($(".mainTableRow").first().clone());
  // console.log(STATES_MAPPING[BOPs[bopCount].state]);
  switch(STATES_MAPPING[BOPs[BOPs.length-1].state]){
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
  $(`.state:eq(${BOPs.length-1})`).text(STATES_MAPPING[BOPs[BOPs.length-1].state]);
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
  $(`.defaultAction:eq(${BOPs.length-1})`).text(DEFAULTACTION_MAPPING[Number(BOPs[BOPs.length-1].defaultAction)]);
  $(`.defaultTimeoutLength:eq(${BOPs.length-1})`).text(BOPs[BOPs.length-1].defaultTimeoutLength/60/60 + " hours");
  if(BOPs[BOPs.length-1].defaultTriggerTime != 0){
    $(`.defaultTriggerTime:eq(${BOPs.length-1})`).text(new Date(BOPs[BOPs.length-1].defaultTriggerTime * 1000));
  }
  else{
    $(`.defaultTriggerTime:eq(${BOPs.length-1})`).text(0 );
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
        // window.recoverEvent = BOPFactory.contractInstance.FundsRecovered({}, {"fromBlock": 1558897});

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
                (function(currentAddress){
                    web3.eth.getCode(currentAddress, function(errorGetcode, resultGetcode){
                      if(errorGetcode){
                        console.log("Error calling BOP method: " + err.message);
                      }
                      else{
                        if(resultGetcode !== "0x"){
                          currentBOP.contractInstance = currentBOP.contract.at(currentAddress);
                          currentBOP.contractInstance.getFullState(function(err,res){
                            onGetFullState(err, res, currentAddress);
                          });
                        }
                      }
                });
              })(currentAddress);
              }
            }
        });
    });
});

function secondsToHms(d) {
	d = Number(d);
  var days = Math.floor(d / 86400)
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((days > 0 ? days + " d " + h > 0 ? h + " h " + " und " + (m < 10 ? "0" : "") : "") + m +" min" + " " + (s < 10 ? "0" : "") + s + " sec");
}
