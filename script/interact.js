var states = {
  0: 'Open',
  1: 'Committed',
  2: 'Expended'
}

var defaultActions = {
  0: 'None',
  1: 'Release',
  2: 'Burn'
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + " h " + " und " + (m < 10 ? "0" : "") : "") + m +" min" + " " + (s < 10 ? "0" : "") + s + " sec");
}

function logCallResult(err, res) {
    if (err) {
        console.log("Error calling ddddBOP method: " + err.message);
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
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    }
    else {
        console.log("metamask/mist not detected. This site probably won't work for you. Download the metamask addon and try again!");
    }

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
            if(typeof window.address == "undefined") window.address = "0x6071b07603F1625BC67E37BFB37a484F1f372b62";
            window.etherscanURL = "https://ropsten.etherscan.io/address/";
            $("h1").text($("h1").text() + " (ROPSTEN)");
        }
        else{
          console.log("You aren't on the Ethereum main or Ropsten net! Try changing your metamask options to connect to the main network.");
        }


        window.BOP = {
            "address": address,
            "ABI": BOP_ABI,
        };

        BOP.contract = web3.eth.contract(BOP.ABI);
        BOP.contractInstance = BOP.contract.at(BOP.address);

        window.checkUserAddressesInterval = setInterval(checkForUserAddresses, 1000);

    window.getFullStateInterval = setInterval(function(){
      web3.eth.getCode(window.address,function(err,res){
        console.log(res);
    if(res == "0x"){
      console.log("This Contract doesn't exist or was destroyed.")
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
            BOP['defaultAction'] = res[10].toString();
            BOP['defaultTimeoutLength'] = res[11].toString();
            BOP['defaultTriggerTime'] = res[12].toString();
          }
          insertInstanceStatsInPage();
          if (states[Number(BOP.state)] == 'Open') $('#BOPTable').css("background-color", "rgb(204, 255, 204)");
          if (states[Number(BOP.state)] == "Committed") $('#BOPTable').css("background-color", "cyan");
          if (states[Number(BOP.state)] == "Expended") $('#BOPTable').css("background-color", "grey");
          updateExtraInput();
        });
    }
  })
},3000);
  });
});

function insertInstanceStatsInPage(){
    $('.insertAddress').text(BOP.address);
    $('#etherscanLink').attr("href", `${window.etherscanURL}${BOP.address}`);
    $('#BOPInfoOutput').text(states[BOP.state]);
    $('#BOPPayerOutput').text(BOP.payer)
    $('#BOPPayerStringOutput').text(BOP.payerString);
    BOP.recipient == '0x0000000000000000000000000000000000000000' ? $('#BOPRecipientOutput').text("None") : $('#BOPRecipientOutput').text(BOP.recipient);
    $('#BOPRecipientStringOutput').text(BOP.recipientString, 'ether');
    $('#BOPBalanceOutput').text(web3.fromWei(BOP.balance, 'ether') + ' ETH');
    $('#BOPCommitThresholdOutput').text(web3.fromWei(BOP.commitThreshold,'ether') + ' ETH');
    $('#BOPFundsDepositedOutput').text(web3.fromWei(BOP.amountDeposited, 'ether') + ' ETH');
    $('#BOPFundsBurnedOutput').text(web3.fromWei(BOP.amountBurned, 'ether') + ' ETH');
    $('#BOPFundsReleasedOutput').text(web3.fromWei(BOP.amountBurned, 'ether') + ' ETH');
    $('#BOPDefaultActionOutput').text(defaultActions[Number(BOP.defaultAction)]);
    $('#BOPDefaultTimeoutLength').text(secondsToHms(BOP.defaultTimeoutLength));
}

function callDefaultAction(){
  BOP.contractInstance.callDefaultAction(logCallResult);
}

function delayDefaultAction(){
  // var delayDefaultActionInHours = Number($('input[type=text]', '#delayDefaultActionForm').val());
  BOP.contractInstance.delayDefaultAction(logCallResult);
}


function updateExtraInput() {
	var userHasAddress = (isUserAddressVisible());
  var userIsPayer = (BOP.payer == web3.eth.defaultAccount);
  var userIsRecipient = (BOP.recipient == web3.eth.defaultAccount);
  var isNullRecipient = (BOP.recipient == '0x0000000000000000000000000000000000000000');

  document.getElementById('payerFundsInputGroup').hidden = !userIsPayer;
  document.getElementById('updatePayerStringInputGroup').hidden = !userIsPayer;
  document.getElementById('updateRecipientStringInputGroup').hidden = !userIsRecipient;
  document.getElementById('commitInputGroup').hidden = !isNullRecipient;
  //document.getElementById('contributeInputGroup').hidden = !userHasAddress;
	document.getElementById('recoverFundsInputGroup').hidden = !(userIsPayer && isNullRecipient);
  web3.eth.getBlock("latest",
    function(err,res){
      if (err) {
          console.log("Error calling BOP method: " + err.message);
      }
      else{
        var currentTime = res.timestamp;
      }
      if((defaultActions[Number(BOP.defaultAction)] != 'None' && Number(BOP.defaultTriggerTime) < currentTime && states[Number(BOP.state)] == 'Committed') && (userIsRecipient || userIsPayer)){
        document.getElementById('defaultActionInputGroup').hidden = false;
        $('#BOPDefaultActionTriggerTime').text(new Date(BOP.defaultTriggerTime * 1000));
        $('#BOPDefaultActionTriggerTime').css("color", "red");
      }
      else
      {
        document.getElementById('defaultActionInputGroup').hidden = true;
        differenceTime = Number(BOP.defaultTriggerTime) - res.timestamp;
        if(0 < differenceTime && differenceTime <= 86400){
          $('#BOPDefaultActionTriggerTime').text("Remaining Time: " + secondsToHms(differenceTime));
        }
      }
  });

  if((defaultActions[Number(BOP.defaultAction)] != 'None' && states[Number(BOP.state)] == 'Committed') && (userIsRecipient || userIsPayer)){
    document.getElementById('delayDefaultActionForm').hidden = false;
  }else{
    document.getElementById('delayDefaultActionForm').hidden = true;
  }
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
