function handleNewBOPResult(err, res) {
    if (err) alert(err.message);
    else {
        $("outputDiv").html("BOP Creation transaction submitted. Address (upon transaction confirmation): " + res);
    }
}
function callNewBOP(valueInEth, payer, commitThresholdInEth, defaultAction, defaultTimeoutLengthInHours, payerString) {
    var valueInWei = web3.toWei(valueInEth, 'ether');
    var commitThresholdInWei = web3.toWei(commitThresholdInEth, 'ether');
    var defaultTimeoutLengthInSeconds = defaultTimeoutLengthInHours*60*60;
    
    BOPFactory.contractInstance.newBurnableOpenPayment(payer, commitThresholdInWei, defaultAction, defaultTimeoutLengthInSeconds, payerString, {'from':web3.eth.accounts[0],'value': valueInWei}, handleNewBOPResult);
}

function useBOPFormInput() {
    var valueInEth = $("#NewBOPForm #paymentAmountInput").val();
    if (valueInEth == '') {
        alert("Must specify payment amount!");
        return;
    }
    valueInEth = Number(valueInEth);
    
    var payer = $("#NewBOPForm #payerInput").val();
    if (payer == '') {
        alert("Must specify payer!");
        return;
    }
    
    var commitThresholdInEth = $("#NewBOPForm #commitThresholdInput").val();
    if (commitThresholdInEth == '') {
        alert("Must specify commit threshold!");
        return;
    }
    commitThresholdInEth = Number(commitThresholdInEth);
    
    var defaultAction = $("#NewBOPForm #defaultActionInput").prop("checked", true).val();
    if (defaultAction == 'None') defaultAction = 0;
    else if (defaultAction == 'Release') defaultAction = 1;
    else if (defaultAction == 'Burn') defaultAction = 2;
    
    if (defaultAction != 0) {
        var defaultTimeoutLengthInHours = $("#NewBOPForm #defaultTimeoutLengthInHoursInput").val();
        if (defaultTimeoutLengthInHours == '') {
            alert("Must specify a default timeout length! (Or set default action to \"None\")");
            return;
        }
        defaultTimeoutLengthInHours = Number(defaultTimeoutLengthInHours);
    }
    else var defaultTimeoutLengthInHours = 0;
    
    var payerString = $("#NewBOPForm #payerStringInput").val();
    if (payerString == '') {
        if (!confirm("Initial payerString is empty! Are you sure you want to open a BOP without a payerString?")) {
            return;
        }
    }
    
    callNewBOP(valueInEth, payer, commitThresholdInEth, defaultAction, defaultTimeoutLengthInHours, payerString);
}

function populatePayerInputFromMetamask() {
    if ($("#payerInput").val() == "") {
        $("#payerInput").val(web3.eth.accounts[0])
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
        if (netID != 1) {
            alert("You aren't on the Ethereum main net! Try changing your metamask options to connect to the main network.");
        }
    });
    
    window.BOPFactory = {
        "address": BOP_FACTORY_ADDRESS,
        "ABI": BOP_FACTORY_ABI
    };
    BOPFactory.contract = web3.eth.contract(BOPFactory.ABI);
    BOPFactory.contractInstance = BOPFactory.contract.at(BOPFactory.address);
});