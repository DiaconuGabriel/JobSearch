class joobleApi {

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = `https://jooble.org/api/${this.apiKey}`;
    }

    async searchJobs(params) {
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params)
        });

        if (response.status === 403) {
            throw new Error("Access denied – Invalid API key.");
        }
        if (response.status === 404) {
            throw new Error("Not found – The requested endpoint or resource is not available.");
        }

        return await response.json();
    }
}

module.exports = joobleApi;