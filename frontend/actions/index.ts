import "dotenv/config";

export const apiService = async ({ url, method, data }: { url: string; method: string; data?: BodyInit }) => {
    const res = fetch(`${process.env.BACKEND_BASE_URL}/api${url}`, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    }).then(res => {
        console.log(res)
        return res.json()
    })

    return res;
}

export const apiMethod = {
    get: (url: string) => apiService({ url, method: "GET" }),
    post: (url: string) => apiService({ url, method: "POST" }),
}