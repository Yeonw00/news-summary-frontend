const API_BASE = process.env.REACT_APP_API_BASE ?? "";

function withBaseUrl(inputUrl) {
    if(/^https?:\/\//i.test(inputUrl)) return inputUrl;

    return `${API_BASE}${inputUrl.startsWith("/") ? "" : "/"}${inputUrl}`;
}

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    // 객체 바디는 JSON 직렬화
    let body = options.body;
    if (body && typeof body === "object" && (headers["Content-Type"] || "").includes("application/json")) {
        try { body = JSON.stringify(body); } catch {}
    }

    // 네트워크 호출
    let res;
    try {
        res = await fetch(`${API_BASE}${path}`, { ...options, headers, body });
    } catch {
        const err = new Error("네트워크 오류가 발생했습니다.");
        err.code = "NETWORK_ERROR";
        err.status = 0;
        err.url = `${API_BASE}${path}`;
        throw err;
    }

    const contentType = res.headers.get("content-type") || "";

    // 실패 응답 처리 (항상 문자열 메시지로 Error 던지기)
    if (!res.ok) {
        let text = "";
        try { text = await res.text(); } catch {}

        let code = `HTTP_${res.status}`;
        let message = `HTTP ${res.status}`;
        let payload = null;

        if (text) {
        try {
            const json = JSON.parse(text);
            payload = json;
            if (json && (json.code || json.message)) {
            code = json.code || code;
            message = typeof json.message === "string" ? json.message : message;
            } else {
            message = typeof json === "string" ? json : JSON.stringify(json);
            }
        } catch {
            message = text;
        }
        }

        const err = new Error(message);
        err.code = code;
        err.status = res.status;
        err.url = `${API_BASE}${path}`;
        err.payload = payload;
        throw err;
    }

    // 성공 응답
    if (contentType.includes("application/json")) return res.json();
    return res.text();
}

export async function apiFetchText(url, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` }: {}),
    };

    const res = await fetch(withBaseUrl(url), {
        ...options,
        headers,
    });

    if(!res.ok) {
        const errText = await res.text().catch(() => "");
        const message = errText || `HTTP ${res.status}`;
        throw new Error(message);
    }
    return res.text();
}
