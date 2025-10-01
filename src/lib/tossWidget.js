function loadPaymentWidgetScript() {
    return new Promise((resolve, reject) => {
        if (window.PaymentWidget) return resolve(window.PaymentWidget);
        const s = document.createElement("script");
        s.src = "https://js.tosspayments.com/v1/payment-widget";
        s.onload = () =>  {
            if (window.PaymentWidget) resolve(window.PaymentWidget);
            else reject(new Error("PaymentWidget global not found"));
        };
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

export default loadPaymentWidgetScript;