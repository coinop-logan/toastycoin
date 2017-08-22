var states = {
  0: 'Open',
  1: 'Committed',
  2: 'Expended'
}

function logCallResult(err, res) {
    if (err) {
        alert("Error calling BOP method: " + err.message);
    }
    else {
        return res;
    }
}

function callCancel() {
    console.log("calling BOP cancel()");
    BOP.contractInstance.recoverFunds(logCallResult);
}

function callGetFullState() {
    console.log("calling BOP getFullState()");
    BOP.contractInstance.payer(logCallResult);
}

window.addEventListener('load', function() {
    window.address = "0xababcf2e5aa5fc100c44d7f9f6bbda24e61f7eed" //prompt("BOP address");

    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    }
    else {
        alert("metamask/mist not detected. This site probably won't work for you. Download the metamask addon and try again!");
    }
    web3.version.getNetwork((err, netID) => {
        if (netID != 1) {
            alert("You aren't on the Ethereum main net! Try changing your metamask options to connect to the main network.");
        }
    });

    window.BOP = {
        "address": address,
        "ABI": BOP_ABI,
    };

    BOP.contract = web3.eth.contract(BOP.ABI);
    BOP.contractInstance = BOP.contract.at(BOP.address);

    $('.insertAddress').text(BOP.address);
    $('#etherscanLink').attr("href", `https://etherscan.io/address/${BOP.address}`);

    BOP.contractInstance.burn
    BOP.contractInstance.getFullState(function(err, res){
      if (err) {
          alert("Error calling BOP method: " + err.message);
      }
      else{
        console.log(res[4].toString());
        BOP['state'] = res[0].toString();
        BOP['payerString'] = res[1].toString();
        BOP['recipient'] = res[2].toString();
        BOP['recipientString'] = res[3].toString();
        BOP['amountDeposited'] = res[4].toString();
        BOP['amountBurned'] = res[5].toString();
        BOP['amountReleased'] = res[6].toString();
        BOP['defaultTriggerTime'] = res[7].toString();
      }
      insertInstanceStatsInPage();
      console.log(states[Number(BOP.state)]);
      if (states[Number(BOP.state)] == 'Open') $('#BOPTable').css("background-color", "rgb(204, 255, 204)");
      if (states[Number(BOP['state'])] == "Committed") $('#BOPTable').css("background-color", "lightblue");
      if (states[Number(BOP['state'])] == "Expended") $('#BOPTable').css("background-color", "red");
    });

});

function insertInstanceStatsInPage(){
  $('#BOPInfoOutput').text(states[BOP['state']]);
  web3.eth.getBalance(BOP.address, function(err, res){
    $('#BOPBalanceOutput').text(web3.fromWei(res, 'ether') + ' ETH'); // stimmt nicht
  });
  $('#BOPFundsDepositedOutput').text(web3.fromWei(BOP['amountDeposited'], 'ether') + ' ETH');
  $('#BOPFundsBurnedOutput').text(web3.fromWei(BOP['amountDeposited'], 'ether') + ' ETH');
  $('#BOPFundsReleasedOutput').text(web3.fromWei(BOP['amountReleased'], 'ether') + ' ETH');
  BOP.contractInstance.commitThreshold(function(err, res){
    if (err) {
        alert("Error calling BOP method: " + err.message);
    }
    else {
      $('#BOPCommitThresholdOutput').text(web3.fromWei(res,'ether') + ' ETH');
    }
  })
  BOP.contractInstance.payer(function(err, res){
    if (err) {
        alert("Error calling BOP method: " + err.message);
    }
    else {
      $('#BOPPayerOutput').text(res)
    }
  })
  $('#BOPRecipientOutput').text(BOP['recipient']);
  $('#BOPPayerStringOutput').text(BOP['payerString']);
  $('#BOPRecipientStringOutput').text(BOP['recipientString'], 'ether');
}
