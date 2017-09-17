window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
      window.web3 = new Web3(web3.currentProvider);
  }
  else {
      console.log("metamask/mist not detected. This site probably won't work for you. Download the metamask addon and try again!");
  }
  //get GET-Parameter from URL to decide on contract
  window.address = getUrlParameter('contractAddress');

  web3.version.getNetwork((err, netID) => {
    if (netID == 1) {
      console.log("You are on the Ethereum main net!");
      if(typeof window.address == "undefined") window.address = "0xcE153d0F8D51ab11AeD053E2bB8Fbc365C14A080";
      window.etherscanURL = "https://etherscan.io/address/"
    }
    else if (netID == 3) {
      console.log("You are on the Ropsten net!");
      // window.address = "0xf2713308b9d647424af113fc33d38628e0c3ea25";
      if(typeof window.address == "undefined") window.address = "0x06cF1055E741263276f7cDF9CC6EF4dD3161B87e";
      window.etherscanURL = "https://ropsten.etherscan.io/address/";
      $("h1").text($("h1").text() + " (ROPSTEN)");
    }
    else{
      console.log("You aren't on the Ethereum main or Ropsten net! Try changing your metamask options to connect to the main network.");
    }
    //Initialize the BOP object to interact with the smart contract(BOP)
    window.BOP = {
        "address": window.address,
        "ABI": BOP_ABI,
    };
    BOP.contract = web3.eth.contract(BOP.ABI);
    BOP.contractInstance = BOP.contract.at(BOP.address);
    getEventsAndParticipants('logs','getLogs','address=' + window.address);

    window.checkUserAddressesInterval = setInterval(checkForUserAddresses, 1000);
    window.getFullStateInterval = setInterval(function(){
      web3.eth.getCode(window.address,function(err,res){
        if(res == "0x"){
          console.log("This Contract doesn't exist or was destroyed.")
          document.getElementById('payerFundsInputGroup').hidden = true;
          document.getElementById('updatePayerStringInputGroup').hidden = true;
          document.getElementById('updateRecipientStringInputGroup').hidden = true;
          document.getElementById('commitInputGroup').hidden = true;
        	document.getElementById('recoverFundsInputGroup').hidden = true;
          document.getElementById('defaultActionInputGroup').hidden = true;
          document.getElementById('delayDefaultActionForm').hidden = true;
          $('.insertAddress').text(BOP.address);
          $('#etherscanLink').attr("href", `${window.etherscanURL}${BOP.address}`);
          $('#BOPInfoOutput').text("Doesn't exist/Destroyed");
          $('#BOPPayerOutput').text("None")
          $('#BOPRecipientOutput').text("None")
          $('#BOPPayerStringOutput').text("None");
          $('#BOPRecipientStringOutput').text("None");
          $('#BOPBalanceOutput').text("None");
          $('#BOPCommitThresholdOutput').text("None");
          $('#BOPFundsDepositedOutput').text("None");
          $('#BOPFundsBurnedOutput').text("None");
          $('#BOPFundsReleasedOutput').text("None");
          $('#BOPDefaultActionOutput').text("None");
          $('#BOPDefaultTimeoutLength').text("None");
          $('#BOPTable').css("background-color", "grey");
        }
        else{
          BOP.contractInstance.getFullState(function(err, res){
            if (err) {
              console.log("Error calling BOP method: " + err.message);
              ////workaournd////////////////////////////////////////////////////////
              console.log("This Contract doesn't exist or was destroyed.")
              document.getElementById('payerFundsInputGroup').hidden = true;
              document.getElementById('updatePayerStringInputGroup').hidden = true;
              document.getElementById('updateRecipientStringInputGroup').hidden = true;
              document.getElementById('commitInputGroup').hidden = true;
              document.getElementById('recoverFundsInputGroup').hidden = true;
              document.getElementById('defaultActionInputGroup').hidden = true;
              document.getElementById('delayDefaultActionForm').hidden = true;

              $('.insertAddress').text(BOP.address);
              $('#etherscanLink').attr("href", `${window.etherscanURL}${BOP.address}`);
              $('#BOPInfoOutput').text("Doesn't exist/Destroyed");
              $('#BOPPayerOutput').text("None")
              $('#BOPRecipientOutput').text("None")
              $('#BOPPayerStringOutput').text("None");
              $('#BOPRecipientStringOutput').text("None");
              $('#BOPBalanceOutput').text("None");
              $('#BOPCommitThresholdOutput').text("None");
              $('#BOPFundsDepositedOutput').text("None");
              $('#BOPFundsBurnedOutput').text("None");
              $('#BOPFundsReleasedOutput').text("None");
              $('#BOPDefaultActionOutput').text("None");
              $('#BOPDefaultTimeoutLength').text("None");
              $('#BOPTable').css("background-color", "grey");
              ////workaournd////////////////////////////////////////////////////////
            }
            else{
              BOP['state'] = res[0].toString();
              BOP['payer'] = res[1].toString();
              BOP['payerString'] = res[2].toString();
              BOP['recipient'] = res[3].toString();
              BOP['recipientString'] = res[4].toString();
              BOP['balance'] = res[5].toString();
              BOP['commitThreshold'] = res[6].toString();
              BOP['amountDeposited'] = res[7].toString();
              BOP['amountBurned'] = res[8].toString();
              BOP['amountReleased'] = res[9].toString();
              BOP['defaultAction'] = res[10].toString() === "true";
              BOP['defaultTimeoutLength'] = res[11].toString();
              BOP['defaultTriggerTime'] = res[12].toString();
              insertInstanceStatsInPage();
              if (BOP_STATES[Number(BOP.state)] == 'Open') $('#BOPTable').css("background-color", "rgb(204, 255, 204)");
              if (BOP_STATES[Number(BOP.state)] == "Committed") $('#BOPTable').css("background-color", "cyan");
              if (BOP_STATES[Number(BOP.state)] == "Expended") $('#BOPTable').css("background-color", "grey");
              updateExtraInput();
            }
          });
        }
      })
    }, 3000);
  });
});

function insertInstanceStatsInPage(){
    $('.insertAddress').text(BOP.address);
    $('#etherscanLink').attr("href", `${window.etherscanURL}${BOP.address}`);
    $('#BOPInfoOutput').text(BOP_STATES[BOP.state]);
    $('#BOPPayerOutput').text(BOP.payer)
    $('#BOPPayerStringOutput').text(BOP.payerString);
    BOP.recipient == '0x0000000000000000000000000000000000000000' ? $('#BOPRecipientOutput').text("None") : $('#BOPRecipientOutput').text(BOP.recipient);
    $('#BOPRecipientStringOutput').text(BOP.recipientString, 'ether');
    $('#BOPBalanceOutput').text(web3.fromWei(BOP.balance, 'ether') + ' ETH');
    $('#BOPCommitThresholdOutput').text(web3.fromWei(BOP.commitThreshold,'ether') + ' ETH');
    $('#BOPFundsDepositedOutput').text(web3.fromWei(BOP.amountDeposited, 'ether') + ' ETH');
    $('#BOPFundsBurnedOutput').text(web3.fromWei(BOP.amountBurned, 'ether') + ' ETH');
    $('#BOPFundsReleasedOutput').text(web3.fromWei(BOP.amountReleased, 'ether') + ' ETH');
    $('#BOPDefaultActionOutput').text(BOP.defaultAction);
    $('#BOPDefaultTimeoutLength').text(secondsToDhms(BOP.defaultTimeoutLength));
    $('#BOPDefaultActionTriggerTime').text(new Date(BOP.defaultTriggerTime * 1000).toLocaleString());
}


function updateExtraInput() {
	var userHasAddress = (isUserAddressVisible());
  var userIsPayer = (BOP.payer == web3.eth.defaultAccount);
  var userIsRecipient = (BOP.recipient == web3.eth.defaultAccount);
  var isNullRecipient = (BOP.recipient == '0x0000000000000000000000000000000000000000');

  document.getElementById('payerFundsInputGroup').hidden = !userIsPayer;
  document.getElementById('payerBurnReleaseInputGroup').hidden = (BOP_STATES[Number(BOP.state)] === "Expended" || !userIsPayer);
  document.getElementById('updatePayerStringInputGroup').hidden = !userIsPayer;
  document.getElementById('updateRecipientStringInputGroup').hidden = !userIsRecipient;
  document.getElementById('commitInputGroup').hidden = !isNullRecipient;
	document.getElementById('recoverFundsInputGroup').hidden = !(userIsPayer && isNullRecipient);
  web3.eth.getBlock("latest",
    function(err,res){
      if (err) {
          console.log("Error calling BOP method: " + err.message);
      }
      else{
        currentTime = res.timestamp;
      }
      if(!BOP.defaultAction){
        document.getElementById('BOPDefaultActionTriggerTime').hidden = true;
        document.getElementById('BOPDefaultTimeoutLengthGroup').hidden = true;
        document.getElementById('defaultActionInputGroup').hidden = true;
        document.getElementById('delayDefaultActionForm').hidden = true;
      }
      if(!(userIsRecipient || userIsPayer)){
        document.getElementById('defaultActionInputGroup').hidden = true;
        document.getElementById('delayDefaultActionForm').hidden = true;
      }
      else if((BOP.defaultAction && Number(BOP.defaultTriggerTime) < currentTime && BOP_STATES[Number(BOP.state)] === 'Committed' && (userIsRecipient || userIsPayer))){
        console.log(1)
        document.getElementById('BOPDefaultActionTriggerTime').hidden = false;
        document.getElementById('BOPDefaultTimeoutLengthGroup').hidden = false;
        document.getElementById('defaultActionInputGroup').hidden = false;
        document.getElementById('delayDefaultActionForm').hidden = false;
      }
      else if((BOP.defaultAction && Number(BOP.defaultTriggerTime) > currentTime && BOP_STATES[Number(BOP.state)] === 'Committed' && (userIsRecipient || userIsPayer))){
        document.getElementById('BOPDefaultActionTriggerTime').hidden = false;
        document.getElementById('BOPDefaultTimeoutLengthGroup').hidden = false;
        document.getElementById('defaultActionInputGroup').hidden = true;
        document.getElementById('delayDefaultActionForm').hidden = true;
        differenceTime = Number(BOP.defaultTriggerTime) - res.timestamp;
        if(0 < differenceTime && differenceTime <= 86400){
          $('#BOPDefaultActionTriggerTime').text("Remaining Time: " + secondsToDhms(differenceTime));
        }
        else{
          $('#BOPDefaultActionTriggerTime').text(new Date(BOP.defaultTriggerTime * 1000).toLocaleString());
          $('#BOPDefaultActionTriggerTime').css("color", "red");
        }
      }
      else if(BOP.defaultAction && Number(BOP.defaultTriggerTime) < currentTime && BOP_STATES[Number(BOP.state)] === 'Committed'){
        document.getElementById('BOPDefaultActionTriggerTime').hidden = false;
        document.getElementById('BOPDefaultTimeoutLengthGroup').hidden = false;
      }
      else if(BOP.defaultAction && BOP_STATES[Number(BOP.state)] === 'Committed'){
        document.getElementById('BOPDefaultActionTriggerTime').hidden = false;
        document.getElementById('BOPDefaultTimeoutLengthGroup').hidden = false;
      }
      else if(BOP.defaultAction){
        document.getElementById('BOPDefaultActionTriggerTime').hidden = true;
        document.getElementById('BOPDefaultTimeoutLengthGroup').hidden = false;
      }
  });
}

function isUserAddressVisible() {
	return (typeof(web3.eth.accounts) != 'undefined' && web3.eth.accounts.length > 0);
}
function checkForUserAddresses() {
    if (isUserAddressVisible()) {
        clearInterval(checkUserAddressesInterval);
        onUserAddressesVisible();
    }
    else {
        onUserAddressesNotVisible();
    }
}
function onUserAddressesNotVisible() {
    document.getElementById('userAddress').innerHTML = "Can't find user addresses. If using metamask, are you sure it's unlocked and initialized?<br>";
}
function onUserAddressesVisible() {
    web3.eth.defaultAccount = web3.eth.accounts[0];
    document.getElementById('userAddress').innerHTML = "User address:<br>" + web3.eth.defaultAccount;
}

function recipientStringEditMode(flag) {
	if (flag) {
		$('#recipientStringUpdateStartButton').hide();
		$('#recipientStringUpdateTextarea').show();
		$('#recipientStringUpdateCommitButton').show();
		$('#recipientStringUpdateCancelButton').show();
		$('#BOPRecipientStringOutput').hide();
	}
	else {
		$('#recipientStringUpdateStartButton').show();
		$('#recipientStringUpdateTextarea').hide();
		$('#recipientStringUpdateCommitButton').hide();
		$('#recipientStringUpdateCancelButton').hide();
		$('#BOPRecipientStringOutput').show();
	}
}
function startRecipientStringUpdate() {
	recipientStringEditMode(true);

	$('#recipientStringUpdateTextarea').val(BOP.recipientString);
}
function cancelRecipientStringUpdate() {
	recipientStringEditMode(false);
}
function commitRecipientStringUpdate() {
	callUpdateRecipientString($('#recipientStringUpdateTextarea').val());
	recipientStringEditMode(false);
}

function payerStringEditMode(flag) {
	if (flag) {
		$('#payerStringUpdateStartButton').hide();
		$('#payerStringUpdateTextarea').show();
		$('#payerStringUpdateCommitButton').show();
		$('#payerStringUpdateCancelButton').show();
		$('#BOPPayerStringOutput').hide();
	}
	else {
		$('#payerStringUpdateStartButton').show();
		$('#payerStringUpdateTextarea').hide();
		$('#payerStringUpdateCommitButton').hide();
		$('#payerStringUpdateCancelButton').hide();
		$('#BOPPayerStringOutput').show();
	}
}
function startPayerStringUpdate() {
	payerStringEditMode(true);

	$('#payerStringUpdateTextarea').val(BOP.payerString);
}
function cancelPayerStringUpdate() {
	payerStringEditMode(false);
}
function commitPayerStringUpdate() {
	callUpdatePayerString($('#payerStringUpdateTextarea').val());
	payerStringEditMode(false);
}


//smart contract caller and handler functions
function handleCommitResult(err, res) {
    if (err) console.log(err.message);
}
function callCommit() {
    BOP.contractInstance.commit({'value':BOP.commitThreshold}, handleCommitResult);
}
function handleRecoverFundsResult(err, res) {
	if (err) console.log(err.message);
}
function callRecoverFunds() {
	BOP.contractInstance.recoverFunds(handleRecoverFundsResult);
}
function handleReleaseResult(err, res) {
    if (err) console.log(err.message);
}
function callRelease(amountInEth) {
    BOP.contractInstance.release(web3.toWei(amountInEth,'ether'), handleReleaseResult);
}
function releaseFromForm() {
    var form = document.getElementById('payerFundsInputGroup');
    var amount = Number(form.elements['amount'].value);

    callRelease(amount);
}
function handleBurnResult(err, res) {
    if (err) console.log(err.message);
}
function callBurn(amountInEth) {
    BOP.contractInstance.burn(web3.toWei(amountInEth,'ether'), handleBurnResult);
}
function burnFromForm() {
    var form = document.getElementById('payerFundsInputGroup');
    var amount = Number(form.elements['amount'].value);

    callBurn(amount);
}
function handleAddFundsResult(err, res) {
	if (err) console.log(err.message);
}
function callAddFunds(includedEth) {
	BOP.contractInstance.addFunds({'value':web3.toWei(includedEth,'ether')}, handleAddFundsResult)
}
function addFundsFromForm() {
	var form = document.getElementById('payerFundsInputGroup');
	var amount = Number(form.elements['amount'].value);
	callAddFunds(amount);
}
function callDefaultAction(){
  BOP.contractInstance.callDefaultRelease(logCallResult);
}
function delayDefaultRelease(){
  // var delayDefaultActionInHours = Number($('input[type=text]', '#delayDefaultActionForm').val());
  BOP.contractInstance.delayDefaultRelease(logCallResult);
}
function handleUpdateRecipientStringResult(err, res) {
    if (err) console.log(err.message);
}
function callUpdateRecipientString(newString) {
    BOP.contractInstance.setRecipientString(newString, handleUpdateRecipientStringResult);
}
function handleUpdatePayerStringResult(err, res) {
    if (err) console.log(err.message);
}
function callUpdatePayerString(newString) {
    BOP.contractInstance.setPayerString(newString, handleUpdatePayerStringResult);
}
function callCancel() {
    BOP.contractInstance.recoverFunds(logCallResult);
}
function callGetFullState() {
    BOP.contractInstance.payer(logCallResult);
}


//////////////////////////////////Events Part of the interact page////////////////////////////////////////////////
function buildEventsPage(logArray, payer, recipient){
  var who;
  var logArrayCounter = 0;
  var eventArray = [];
  logArray.forEach(function(log){
    var eventObject = {};
    (function(log){
      web3.eth.getTransaction(log.transactionHash, function(err,res){
        if(err){
          console.log("Error calling BOP method: " + err.message);
        }
        else{
          var topic = log.topics[0];
          var event = decodeTopic(topic, BOP_ABI);
          if(payer === recipient && false){
            who = "contract";
          }
          else if(res.from === payer){
            who = "payer";
          }
          else if(res.from === recipient){
            who = "recipient";
          }
          eventObject.who = who;
          eventObject.event = event;
          eventObject.timeStamp = log.timeStamp;
          eventObject.arguments = returnEventArguments(log.data, event.inputs)
          eventArray.push(eventObject);

          logArrayCounter += 1;
          if(logArrayCounter === logArray.length){
            eventArray = sortOnTimestamp(eventArray);
            insertAllInChat(eventArray);
          }
        }
      });
    })(log);
  });
}

function returnEventArguments(rawArguments, eventInfo){
  var rawArgumentArray = rawArguments.substring(2).match(/.{1,64}/g);
  var argumentString;
  for(var counter = 0; counter < rawArgumentArray.length; counter++){
    var argumentEncoded = rawArgumentArray[counter];
    switch(eventInfo[counter]){
      case "address":
        argumentString += "0x" + argumentEncoded;
        break;
      case "uint256":
        argumentString += parseInt(argumentEncoded, 16);
        break;
      case "string":
        argumentString += web3.toAscii(argumentString);
        break;
      case "bool":
        argumentString += argumentString === "1";
        break;
      default:
    }
  }
}

function insertAllInChat(eventArray){
  eventArray.forEach(function(eventObject){
    insertChat(eventObject.who, eventObject.event.name, new Date(parseInt(eventObject.timeStamp, 16) * 1000).toLocaleString());
  });
}

function getEventsAndParticipants(moduleParam, actionParam, additionalKeyValue){
  BOP.contractInstance.getFullState(function(err, res){
    if (err) {
      console.log("Error calling BOP method: " + err.message);
    }
    else{
      var payer = res[1].toString();
      var recipient = res[3].toString();
      callEtherscanApi(moduleParam, actionParam, additionalKeyValue, function(resultJSON){
        buildEventsPage(resultJSON.result, payer, recipient)
      });
    }
  });
}

function callEtherscanApi(moduleParam, actionParam, additionalKeyValue, callback){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(this.readyState == 4){
      if(this.status == 200){
        var resultParsed = JSON.parse(this.responseText);
        console.log(resultParsed);
        callback(resultParsed);
      }
    }
  }
  request.open('GET', `https://ropsten.etherscan.io/api?module=${moduleParam}&action=${actionParam}&${additionalKeyValue}&fromBlock=0&toBlock=latest`, true);
  request.send();
}

function decodeTopic(topic, abi){
  for (var methodCounter = 0; methodCounter < abi.length; methodCounter++) {
    var item = abi[methodCounter];
    if (item.type != "event") continue;
    var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
    var hash = web3.sha3(signature);
    if (hash == topic) {
      return item;
    }
  }
}

function insertChat(who, text, date){
  var control = "";
  if (who === "payer"){
    control =
    '<li class="list-group-item list-group-item-success" style="width:100%">' +
      '<div class="row">' +
        '<div class="col-md-4">' +
          '<span>' + text + '</span>' +
          '<p><small>' + date + '</small></p>' +
        '</div>' +
        '<div class="col-md-4"></div>' +
        '<div class="col-md-4"></div>' +
      '</div>' +
    '</li>';
  }
  else if(who === "recipient"){
    control =
      '<li class="list-group-item list-group-item-info" style="width:100%;">' +
        '<div class="row">' +
          '<div class="col-md-4"></div>' +
          '<div class="col-md-4"></div>' +
          '<div class="col-md-4">' +
            '<span>' + text + '</span>' +
            '<p><small>' + date + '</small></p>' +
          '</div>' +
        '</div>' +
      '</li>';
  }
  $("ul").append(control);
}


function sortOnTimestamp(eventArray){
  eventArray.sort(function(current, next){
    if(current.timeStamp < next.timeStamp) return -1;
    if(current.timeStamp > next.timeStamp) return 1;
    return 0;
  });
  return eventArray;
}
