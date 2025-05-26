class Clearbit {
    constructor() {
        this.baseUrl = 'https://logo.clearbit.com/';
    }

    async getLogo(domain) {
        const fetch = (await import('node-fetch')).default;
        const url = `${this.baseUrl}${encodeURIComponent(domain)}`;
        const response = await fetch(url, {
            method: "GET"
        });
        
        if (!response.ok) {
            throw new Error(`Clearbit Logo API error: ${response.status} ${response.statusText}`);
        }

        return Buffer.from(await response.arrayBuffer());
    }
}

module.exports = Clearbit;