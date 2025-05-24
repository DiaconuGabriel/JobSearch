class GeminiApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent?key=' + this.apiKey;
    }

    async extractKeywords(cvText) {
        const fetch = (await import('node-fetch')).default;
        const prompt = `Extrage cele mai relevante 20-30 cuvinte cheie din următorul CV și returnează-le ca un string delimitat de spatiu fara virgula. Nimic altceva ca cuvinte de legatura. Aici este CV-ul: "${cvText}"`;

        const body = {
            contents: [
                { parts: [{ text: prompt }] }
            ]
        };

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Gemini API error: ' + response.statusText);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return text;    
    }
}

module.exports = GeminiApi;