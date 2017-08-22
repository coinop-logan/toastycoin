const BOP_ABI = [{
		"constant": true,
		"inputs": [],
		"name": "payerString",
		"outputs": [{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "payer",
		"outputs": [{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "release",
		"outputs": [{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "commit",
		"outputs": [],
		"payable": true,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "delayDefaultAction",
		"outputs": [],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "amountBurned",
		"outputs": [{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "recipient",
		"outputs": [{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "defaultTimeoutLength",
		"outputs": [{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "callDefaultAction",
		"outputs": [],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [{
				"name": "_string",
				"type": "string"
			}
		],
		"name": "setPayerString",
		"outputs": [],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "getFullState",
		"outputs": [{
				"name": "",
				"type": "uint8"
			}, {
				"name": "",
				"type": "string"
			}, {
				"name": "",
				"type": "address"
			}, {
				"name": "",
				"type": "string"
			}, {
				"name": "",
				"type": "uint256"
			}, {
				"name": "",
				"type": "uint256"
			}, {
				"name": "",
				"type": "uint256"
			}, {
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "addFunds",
		"outputs": [],
		"payable": true,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "recipientString",
		"outputs": [{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "recoverFunds",
		"outputs": [],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "state",
		"outputs": [{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [{
				"name": "_string",
				"type": "string"
			}
		],
		"name": "setRecipientString",
		"outputs": [],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "defaultAction",
		"outputs": [{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "amountReleased",
		"outputs": [{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "defaultTriggerTime",
		"outputs": [{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "commitThreshold",
		"outputs": [{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "amountDeposited",
		"outputs": [{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function"
	}, {
		"inputs": [{
				"name": "_payer",
				"type": "address"
			}, {
				"name": "_payerString",
				"type": "string"
			}, {
				"name": "_commitThreshold",
				"type": "uint256"
			}, {
				"name": "_defaultAction",
				"type": "uint8"
			}, {
				"name": "_defaultTimeoutLength",
				"type": "uint256"
			}
		],
		"payable": true,
		"type": "constructor"
	}, {
		"anonymous": false,
		"inputs": [{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsAdded",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
				"indexed": false,
				"name": "newPayerString",
				"type": "string"
			}
		],
		"name": "PayerStringUpdated",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
				"indexed": false,
				"name": "newRecipientString",
				"type": "string"
			}
		],
		"name": "RecipientStringUpdated",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [],
		"name": "FundsRecovered",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
				"indexed": false,
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "Committed",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsBurned",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsReleased",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [],
		"name": "Expended",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [],
		"name": "Unexpended",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [],
		"name": "DefaultActionDelayed",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [],
		"name": "DefaultActionCalled",
		"type": "event"
	}
];