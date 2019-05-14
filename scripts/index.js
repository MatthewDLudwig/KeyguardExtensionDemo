function transform(it) {
	let arr = [];
	for (let k in it) {
		arr.push(it[k]);
    }
	return arr;
}

let message = JSON.stringify({
	this : "Should be signed",
	dogs : "are good"
}, null, 2);
let signedMessage = JSON.parse('{"signer":"NQ88 MJ1L AXDY RY6P JA74 RC3T 48MM AE4M EL2B","signerPublicKey":{"0":122,"1":85,"2":219,"3":180,"4":206,"5":112,"6":122,"7":211,"8":158,"9":48,"10":12,"11":39,"12":23,"13":154,"14":23,"15":179,"16":9,"17":254,"18":54,"19":112,"20":94,"21":162,"22":232,"23":11,"24":181,"25":62,"26":192,"27":239,"28":133,"29":90,"30":122,"31":71},"signature":{"0":34,"1":53,"2":198,"3":143,"4":59,"5":124,"6":182,"7":33,"8":11,"9":71,"10":110,"11":100,"12":204,"13":67,"14":122,"15":148,"16":131,"17":6,"18":132,"19":188,"20":148,"21":58,"22":218,"23":213,"24":222,"25":210,"26":214,"27":210,"28":223,"29":20,"30":187,"31":158,"32":99,"33":210,"34":161,"35":195,"36":78,"37":218,"38":97,"39":108,"40":91,"41":49,"42":208,"43":151,"44":214,"45":66,"46":130,"47":1,"48":213,"49":61,"50":93,"51":174,"52":60,"53":245,"54":116,"55":237,"56":19,"57":60,"58":56,"59":16,"60":17,"61":181,"62":57,"63":6}}');
signedMessage.signature = new Uint8Array(transform(signedMessage.signature));
signedMessage.signerPublicKey = new Uint8Array(transform(signedMessage.signerPublicKey));

//The above ugliness is necessary to get the demo data loaded in and I think it's good to see what's needed.
//
//
//
//Especially the fact that JSON.parse loses the Uint8Arrays which are required to construct Nimiq.XXX objects from the data.

let showButton = document.getElementById("show");
let classesLoaded = false;
let wrapper = new NimiqWrapper({
	errorCallback : (w, e) => {
		let parts = w.split(":");
		if (parts[1] == "initNode") {
			let workingDIV = document.getElementById("working");
			if (e == NimiqWrapper.ERROR_MESSAGES.ANOTHER_NODE) {
				let notDIV = document.getElementById("nonode");
				workingDIV.style.display = "none";
				notDIV.style.display = "block";
			}
		}
	}
});
wrapper.initNode({
	justClasses : true,
	whenLoaded: () => {
		classesLoaded = true;
		document.getElementById("verify").disabled = false;
	}
});

wrapper.keyguardHelper.initKeyguard({
	appName: "Keyguard Extension Demo"
});

document.getElementById("verify").disabled = true;
if (showButton) {
	showButton.addEventListener('click', (event) => {
		chrome.tabs.create({ url : chrome.runtime.getURL("pages/try.html" ) });
	});
}

document.getElementById("verify").addEventListener("click", (event) => {
	if (classesLoaded) {
		const signature = new Nimiq.Signature(signedMessage.signature);
		const publicKey = new Nimiq.PublicKey(signedMessage.signerPublicKey);

		// For string messages:
		const data = AccountsClient.MSG_PREFIX + message.length + message;
		const dataBytes = Nimiq.BufferUtils.fromUtf8(data);
		const hash = Nimiq.Hash.computeSha256(dataBytes);

		// Check signature against the hashed message
		const isValid = signature.verify(publicKey, hash);
		alert(isValid);
	}
});

document.getElementById("a").addEventListener('click', (event) => {
	wrapper.keyguardHelper.requestAddress((addr) => {
		console.log(addr);
	}, {
		onError : (err) => {
			console.log(err);
		}
	});
});

document.getElementById("b").addEventListener('click', (event) => {
	wrapper.keyguardHelper.requestSignature((signed) => console.log(signed), {
		appName : "Keyguard Testing",
		data : {
			this : "Should be signed",
			dogs : "are good"
		},
		signer: "NQ88 MJ1L AXDY RY6P JA74 RC3T 48MM AE4M EL2B"
	});
});

document.getElementById("c").addEventListener('click', (event) => {
	wrapper.keyguardHelper.requestTransaction((result) => console.log(result), {
		address : "NQ07 0000 0000 0000 0000 0000 0000 0000 0000",
		amount : 12 * 1e5
	});
});

// Extensions cannot use Top Level Redirects due to issues with referrer.
// You must use the standard keyguard popup as above.
//
// document.getElementById("d").addEventListener('click', (event) => {
// 	wrapper.keyguardHelper.requestAddress((addr) => {
// 		console.log(addr);
// 	}, {
// 		onError : (err) => {
// 			console.log(err);
// 		},
// 		redirectBehavior : { }
// 	});
// });
//
// document.getElementById("e").addEventListener('click', (event) => {
// 	wrapper.keyguardHelper.requestSignature((signed) => console.log(signed), {
// 		appName : "Keyguard Testing",
// 		data : {
// 			this : "Should be signed",
// 			dogs : "are good",
// 		},
// 		signer: "NQ88 MJ1L AXDY RY6P JA74 RC3T 48MM AE4M EL2B",
// 		redirectBehavior : { }
// 	});
// });
//
// document.getElementById("f").addEventListener('click', (event) => {
// 	wrapper.keyguardHelper.requestTransaction((result) => console.log(result), {
// 		address : "NQ07 0000 0000 0000 0000 0000 0000 0000 0000",
// 		amount : 12 * 1e5,
// 		redirectBehavior : { }
// 	});
// });
