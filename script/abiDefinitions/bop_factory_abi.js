var BOP_FACTORY_ADDRESS = '0x1953da4bceBC9579156586C4528aF151381d6Bb6'; //////////////////needs to be changed to const in final version, var for test purposes
const BOP_FACTORY_ABI = [
	{
		"constant": false,
		"inputs": [{
				"name": "payer",
				"type": "address"
			}, {
				"name": "commitThreshold",
				"type": "uint256"
			}, {
				"name": "defaultAction",
				"type": "uint8"
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
		"type": "function"
	}, {
		"anonymous": false,
		"inputs": [{
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
				"name": "defaultAction",
				"type": "uint8"
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