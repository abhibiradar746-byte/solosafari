import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const BOT_RESPONSES: Record<string, string> = {
    default: "I am analyzing routes and safety checks. Could you specify which destination state in India (e.g. Rajasthan, Goa, Kerala, Himachal) you want to query about?",
    rajasthan: "Rajasthan is highly popular for solo travelers! I recommend the Golden Triangle extension: <strong>Delhi ➔ Jaipur ➔ Jodhpur ➔ Udaipur</strong>. You can book safe Zostels at every stop. The route has a Safety Index of 9.4/10.",
    himachal: "Himachal Pradesh is a heaven for solo backpackers. Old Manali, Dharamkot, and Kasol are very traveler-friendly and safe. Tip: Network drops occur enroute; download offline maps on your SoloSafiri app before ascending.",
    kerala: "Kerala is excellent for slow budget travel. You can board local passenger trains enroute Fort Kochi to Alappuzha. Try staying in beach hostels for as cheap as ₹500/night.",
    goa: "Goa is very safe for solo travelers, including female backpackers. Choose hostels near Vagator or Anjuna instead of isolated private villas. Safe transport enroute: utilize yellow-black shared scooters (Pilots).",
    safety: "Your safety is SoloSafiri's priority. Enroute safety rules: <br>1. Always keep the Women Safety SOS siren armed.<br>2. Avoid boarding unregistered taxi drivers outside train stations.<br>3. Share your live route tracking link with saved contacts.",
    budget: "To travel cheap in India: <br>1. Book Sleeper (SL) or 3AC classes in Indian Railways via IRCTC.<br>2. Rely on Zostel/Hosteller stays (₹500-800/night).<br>3. Eat at certified roadside dhabas for hygiene and cheap meals.",
    helpline: "Emergency Help Numbers: <br>📞 112 (National emergency)<br>📞 1091 (Women response team)<br>📞 139 (Railway safety team)"
};

router.post('/query', async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message content is required" });
    }

    const lowerText = message.toLowerCase();
    let reply = BOT_RESPONSES.default || "I am analyzing routes and safety checks. Could you specify which destination state in India (e.g. Rajasthan, Goa, Kerala, Himachal) you want to query about?";

    if (lowerText.includes('rajasthan') || lowerText.includes('jaipur')) {
        reply = BOT_RESPONSES.rajasthan;
    } else if (lowerText.includes('himachal') || lowerText.includes('manali') || lowerText.includes('snow')) {
        reply = BOT_RESPONSES.himachal;
    } else if (lowerText.includes('kerala') || lowerText.includes('kochi')) {
        reply = BOT_RESPONSES.kerala;
    } else if (lowerText.includes('goa')) {
        reply = BOT_RESPONSES.goa;
    } else if (lowerText.includes('safe') || lowerText.includes('female') || lowerText.includes('danger')) {
        reply = BOT_RESPONSES.safety;
    } else if (lowerText.includes('budget') || lowerText.includes('cheap') || lowerText.includes('cost')) {
        reply = BOT_RESPONSES.budget;
    } else if (lowerText.includes('number') || lowerText.includes('phone') || lowerText.includes('call') || lowerText.includes('helpline')) {
        reply = BOT_RESPONSES.helpline;
    } else if (process.env.OPENAI_API_KEY) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4-turbo',
                    messages: [
                        { role: 'system', content: 'You are Sahayrak, an AI travel assistant for India. Focus on safety, budget-friendly options, and tourist attractions. Be concise.' },
                        { role: 'user', content: message }
                    ],
                    max_tokens: 150
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000
                }
            );
            reply = response.data.choices[0].message.content;
        } catch (e) {
            console.error('OpenAI API error:', e);
        }
    }

    res.json({ reply });
});

export default router;
