let widgetPromise;
export function loadTossWidget() {
    if (widgetPromise) return widgetPromise;
    widgetPromise = new Promise((resolve, reject) => {
        if (window.PaymentWidget) return resolve(window.PaymentWidget);
        const s = document.createElement("script");
        s.src = "https://js.tosspayments.com/v1/payment-widget";
        s.onload = () => resolve(window.PaymentWidget);
        s.onerror = reject;
        document.head.appendChild(s);
    });
    return widgetPromise;
}