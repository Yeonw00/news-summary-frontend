import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { loadTossWidget } from "../lib/tossWidget";

const PRODUCTS = [
    {code: "COIN_1000", label: "1,000코인", price: 9900},
    {code: "COIN_3000", label: "3,000코인", price: 27000},
];

function PaymentForm() {
    const [widget, setWidget] = useState(null);
    const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

    useEffect(() => {
        loadTossWidget().then(PW => {
            setWidget(PW(clientKey, PW.ANONYMOUS));
        });
    }, [clientKey]);

    async function hanldePay(p) {
        const order = await apiFetch("/api/payments/orders", {
            method: "POST",
            body: JSON.stringify({ productCode: p.code}),
        });
        await widget.requestPayment({
            orderId: order.orderId,
            orderName: p.code,
            amount: order.amount,
            successUrl: window.location.origin + "/payment/success",
            failUrl: window.location.origin + "/payment/fail",
        });
    }

    return (
        <div>
            <h2>코인 충전</h2>
            {PRODUCTS.map(p => (
                <button key={p.code} onClick={() => hanldePay(p)}>
                    {p.label} - {p.price.toLocaleString()}원
                </button>
            ))}
        </div>
    );
}

export default PaymentForm;