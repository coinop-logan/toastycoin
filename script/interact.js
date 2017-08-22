var states = {
  0: 'Open',
  1: 'Committed',
  2: 'Expended'
}

function logCallResult(err, res) {
    if (err) {
        alert("Error calling ddddBOP method: " + err.message);
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

    window.checkUserAddressesInterval = setInterval(checkForUserAddresses, 1000);

    web3.eth.getCode("0xababcf2e5aa5fc100c44d7f9f6bbda24e61f7eed",function(err,res){
    if(res == "0x"){
      console.log("This Contract doesn't exist or was destroyed.")
      $('.insertAddress').text(BOP.address);
      $('#etherscanLink').attr("href", `https://etherscan.io/address/${BOP.address}`);
      $('#BOPInfoOutput').text("Doesn't exist/Destroyed");
    }
    else{
      window.getFullState = setInterval(function(){
        BOP.contractInstance.getFullState(function(err, res){
          if (err) {
              alert("Error calling asdfBOP method: " + err.message);
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
          if (states[Number(BOP.state)] == 'Open') $('#BOPTable').css("background-color", "rgb(204, 255, 204)");
          if (states[Number(BOP.state)] == "Committed") $('#BOPTable').css("background-color", "blue");
          if (states[Number(BOP.state)] == "Expended") $('#BOPTable').css("background-color", "grey");
          updateExtraInput();
        });
      }, 2000);
    }
    });
});

function insertInstanceStatsInPage(){
  console.log(BOP.state);
  if(true){
  }
  else{
    console.log("sadfalkö")
    $('.insertAddress').text(BOP.address);
    $('#etherscanLink').attr("href", `https://etherscan.io/address/${BOP.address}`);
    $('#BOPInfoOutput').text(states[BOP['state']]);
    web3.eth.getBalance(BOP.address, function(err, res){
      if (err) {
          alert("Error calling BOP method: " + err.message);
      }
      else {
        BOP['balance'] = res;
      $('#BOPBalanceOutput').text(web3.fromWei(res, 'ether') + ' ETH');
      }
    });
    $('#BOPFundsDepositedOutput').text(web3.fromWei(BOP['amountDeposited'], 'ether') + ' ETH');
    $('#BOPFundsBurnedOutput').text(web3.fromWei(BOP['amountDeposited'], 'ether') + ' ETH');
    $('#BOPFundsReleasedOutput').text(web3.fromWei(BOP['amountReleased'], 'ether') + ' ETH');
    BOP.contractInstance.commitThreshold(function(err, res){
      if (err) {
          alert("Error calling BOP method: " + err.message);
      }
      else {
        BOP['commitThreshold'] = res;
        $('#BOPCommitThresholdOutput').text(web3.fromWei(res,'ether') + ' ETH');
      }
    });
    BOP.contractInstance.payer(function(err, res){
      if (err) {
          alert("Error calling BOP method: " + err.message);
      }
      else {
        BOP['payer'] = res;
        $('#BOPPayerOutput').text(res)
      }
    });
    $('#BOPRecipientOutput').text(BOP['recipient']);
    $('#BOPPayerStringOutput').text(BOP['payerString']);
    $('#BOPRecipientStringOutput').text(BOP['recipientString'], 'ether');
  }
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
    if (err) alert(err.message);
}
function callCommit() {
    BOP.contractInstance.commit({'value':BOP.commitThreshold}, handleCommitResult);
}

function handleRecoverFundsResult(err, res) {
	if (err) alert(err.message);
}
function callRecoverFunds() {
	BOP.contractInstance.recoverFunds(handleRecoverFundsResult);
}

function handleReleaseResult(err, res) {
    if (err) alert(err.message);
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
    if (err) alert(err.message);
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
	if (err) alert(err.message);
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
    if (err) alert(err.message);
}
function callUpdateRecipientString(newString) {
    BOP.contractInstance.setRecipientString(newString, handleUpdateRecipientStringResult);
}

function handleUpdatePayerStringResult(err, res) {
    if (err) alert(err.message);
}
function callUpdatePayerString(newString) {
    BOP.contractInstance.setPayerString(newString, handleUpdatePayerStringResult);
}
