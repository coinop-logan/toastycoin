function fetchETHPrice() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var price = JSON.parse(this.responseText)["USD"];
            onFetchedETHPrice(price);
        }
    };
    xhttp.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", true)
    xhttp.send();
}
function onFetchedETHPrice(price) {
    window.ETHPrice = price;
}
function fetchBOPInfo() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var BOPInfo = JSON.parse(this.responseText);
            onFetchedBOPInfo(BOPInfo);
        }
    };
    xhttp.open("GET", "getBOPInfo.php?address="+BOP.address, true);
    xhttp.send();
}
function onFetchedBOPInfo(BOPInfo) {
	window.BOP.state = {
		'balance': new web3.BigNumber(BOPInfo.balance),
        'payer': BOPInfo.payer,
        'recipient': BOPInfo.recipient,
        'payerString': BOPInfo.payerString,
        'recipientString': BOPInfo.recipientString,
        'commitThreshold': new web3.BigNumber(BOPInfo.commitThreshold),
        'defaultAction': BOPInfo.defaultAction,
        'defaultTimeoutLength': new web3.BigNumber(BOPInfo.defaultTimeoutLength),
        'defaultTriggerTime': new web3.BigNumber(BOPInfo.defaultTriggerTime),
        'state': BOPInfo.state,
        'fundsDeposited': new web3.BigNumber(BOPInfo.fundsDeposited),
        'fundsBurned': new web3.BigNumber(BOPInfo.fundsBurned),
        'fundsReleased': new web3.BigNumber(BOPInfo.fundsReleased)
    };

    if (BOPInfo.state == "Open") $('#BOPTable').css("background-color", "ccffcc");
    if (BOPInfo.state == "Committed") $('#BOPTable').css("background-color", "ccccff");
    if (BOPInfo.state == "Expended") $('#BOPTable').css("background-color", "cccccc");

    $('#BOPFundsDepositedOutput').text(web3.fromWei(BOP.state.fundsDeposited, 'ether') + " ETH");
    $('#BOPFundsBurnedOutput').text(web3.fromWei(BOP.state.fundsBurned, 'ether') + " ETH");
    $('#BOPFundsReleasedOutput').text(web3.fromWei(BOP.state.fundsReleased, 'ether') + " ETH");

	$('#BOPInfoOutput').text(BOP.state.state);
	$('#BOPBalanceOutput').text(web3.fromWei(BOP.state.balance, 'ether') + " ETH");
	$('#BOPCommitThresholdOutput').text(web3.fromWei(BOP.state.commitThreshold, 'ether') + " ETH");
	$('#BOPPayerOutput').text(BOP.state.payer);
	if (BOP.state.recipient == '0x0000000000000000000000000000000000000000') {
		$('#BOPRecipientOutput').text("None");
	}
	else {
		$('#BOPRecipientOutput').text(BOP.state.recipient);
	}
	$('#BOPPayerStringOutput').text(BOP.state.payerString);
    var payerStringHtml = $('#BOPPayerStringOutput').html();
    $('#BOPPayerStringOutput').html(payerStringHtml.replace(/\n/g, "<br />"));

	$('#BOPRecipientStringOutput').text(BOP.state.recipientString);
    var recipientStringHtml = $('#BOPRecipientStringOutput').html();
    $('#BOPRecipientStringOutput').html(recipientStringHtml.replace(/\n/g, "<br />"));

	updateExtraInput();
}
function updateExtraInput() {
	var userHasAddress = (isUserAddressVisible());
    var userIsPayer = (BOP.state.payer == web3.eth.defaultAccount);
    var userIsRecipient = (BOP.state.recipient == web3.eth.defaultAccount);
    var isNullRecipient = (BOP.state.recipient == '0x0000000000000000000000000000000000000000');

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

	$('#recipientStringUpdateTextarea').val(BOP.state.recipientString);
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

	$('#payerStringUpdateTextarea').val(BOP.state.payerString);
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
    BOP.contractInstance.commit({'value':BOP.state.commitThreshold}, handleCommitResult);
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

window.addEventListener('load', function() {
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

    window.BOP = {};
	// BOP.address = '<?php echo $assoc['address']; ?>';
	// BOP.ABI = <?php include("getBOPABI.php"); ?>;
    BOP.contract = web3.eth.contract(BOP.ABI);
    BOP.contractInstance = BOP.contract.at(BOP.address);

    window.checkUserAddressesInterval = setInterval(checkForUserAddresses, 1000);
	window.fetchBOPInfoInterval = setInterval(fetchBOPInfo, 2000);
});
