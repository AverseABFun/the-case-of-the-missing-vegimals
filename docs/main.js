function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {
    var resultContainer = document.getElementById('qr-reader-results');
    var lastResult, countResults = 0;
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;
            resultContainer.innerText += decodedText;
            // Handle on success condition with the decoded message.
            console.log(`Scan result ${decodedText}`, decodedResult);
            if (!decodedText.split("-")[0] == "QR" || !decodedText.split("-")[1] == "GAME" || !decodedText.split("-")[2].split("=")[0] == "TCOTMV") {
                return;
            }
            const qrData = atob(decodedText.split("-")[2].split("=")[1]).split("-");
            const vegimal = qrData[0];
            const vegimalNumber = qrData[1];
            if (localStorage.getItem("vegimals").split(",").includes(vegimal) || localStorage.getItem("vegimalNums").split(",").includes(vegimalNumber)) {
                alert("You already found this Vegimal!")
                return;
            }
            localStorage.setItem("vegimals", localStorage.getItem("vegimals")+","+vegimal);
            localStorage.setItem("vegimalNums", localStorage.getItem("vegimalNums")+","+vegimalNumber);
            if (localStorage.getItem("vegimals").startsWith(",")) {
                localStorage.setItem("vegimals", localStorage.getItem("vegimals").replace(",", ""));
            }
            if (localStorage.getItem("vegimalNums").startsWith(",")) {
                localStorage.setItem("vegimalNums", localStorage.getItem("vegimalNums").replace(",", ""));
            }
            const newEl = document.createElement("li");
            newEl.innerHTML = `<b>Vegimal #${vegimalNumber}: ${vegimal}`;
            document.getElementById("found-vegimals").appendChild(newEl);
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});