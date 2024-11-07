window.onload = function() {
    // Extraer código de referido de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var refCode = urlParams.get('ref');
    if (refCode) {
        document.getElementById('referralLink').value = "https://www.topercraft.com/?ref=" + refCode;
    }
}

function copyLink() {
    var copyText = document.getElementById("referralLink");
    copyText.select();
    document.execCommand("copy");
    alert("Enlace copiado: " + copyText.value);
}

function shareTelegram() {
    var referralLink = document.getElementById("referralLink").value;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Únete a ToperCraft!`);
}