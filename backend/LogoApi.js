class LogoApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://img.logo.dev/';
    }

    async getLogo(text) {
        const fetch = (await import('node-fetch')).default;
        const url = `${this.baseUrl}${encodeURIComponent(text)}?token=${this.apiKey}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },

        });

        // console.log(response);

        if (!response.ok) {
            throw new Error(`Logo API error: ${response.status} ${response.statusText}`);
        }

        return Buffer.from(await response.arrayBuffer());
    }
}

module.exports = LogoApi;