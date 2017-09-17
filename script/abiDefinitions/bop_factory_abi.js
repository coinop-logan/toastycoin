var BOP_FACTORY_ADDRESS = '0x5b8c8de6e864b94a759373f876587f228779c177'; //////////////////needs to be changed to const in final version, var for test purposes
const BOP_FACTORY_ABI = [{
		"constant": false,
		"inputs": [{
				"name": "payer",
				"type": "address"
			}, {
				"name": "commitThreshold",
				"type": "uint256"
			}, {
				"name": "hasDefaultRelease",
				"type": "bool"
			}, {
				"name": "defaultTimeoutLength",
				"type": "uint256"
			}, {
				"name": "initialPayerString",
				"type": "string"
			}
		],
		"name": "newBurnableOpenPayment",
		"outputs": [{
				"name": "",
				"type": "address"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contracts",
		"outputs": [{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "getContractCount",
		"outputs": [{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}, {
		"anonymous": false,
		"inputs": [{
				"indexed": true,
				"name": "contractAddress",
				"type": "address"
			}, {
				"indexed": false,
				"name": "newBOPAddress",
				"type": "address"
			}, {
				"indexed": false,
				"name": "payer",
				"type": "address"
			}, {
				"indexed": false,
				"name": "commitThreshold",
				"type": "uint256"
			}, {
				"indexed": false,
				"name": "hasDefaultRelease",
				"type": "bool"
			}, {
				"indexed": false,
				"name": "defaultTimeoutLength",
				"type": "uint256"
			}, {
				"indexed": false,
				"name": "initialPayerString",
				"type": "string"
			}
		],
		"name": "NewBOP",
		"type": "event"
	}
];
