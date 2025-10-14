document.addEventListener("DOMContentLoaded", function() {
  const params = new URLSearchParams(window.location.search);

  // sanitize amount: remove currency symbols, commas, spaces
  const rawAmount = params.get("amount") || "0";
  const sanitizedAmount = ("" + rawAmount).replace(/[^0-9.]/g, "");
  const amount = parseFloat(sanitizedAmount) || 0;

  // get raw order and extract digits only (removes # and any letters/symbols)
  const rawOrder = params.get("order") || "";
  const digitsOnly = rawOrder.replace(/\D+/g, ""); // e.g. "#1062" -> "1062"
  const lastTwo = digitsOnly.length >= 2 ? digitsOnly.slice(-2) : digitsOnly || "0";

  // final amount adds lastTwo as paisa
  const finalAmount = amount + (Number(lastTwo) || 0)/100;
  const finalAmountFixed = finalAmount.toFixed(2);

  const upiId = params.get("upiid") || "default@upi";

  // UPI link
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${encodeURIComponent(finalAmountFixed)}&cu=INR&tn=Order%20${encodeURIComponent(digitsOnly)}`;

  // generate QR
  const qr = document.getElementById("qr");
  const img = document.createElement("img");
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;
  img.alt = "UPI QR Code";
  qr.appendChild(img);

  // display final amount
  document.getElementById("amountDisplay").textContent = `Amount: ₹${finalAmountFixed}`;
});
