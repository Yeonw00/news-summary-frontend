const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export async function apiFetch(path, options ={}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}`} : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers});
    if(!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Http ${res.status}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
}