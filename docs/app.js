/* ==========================================================================
   SOLOSAFIRI INDIA — FULLY SELF-CONTAINED CLIENT ENGINE
   All data is embedded. No backend server required.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------------------------------
       EMBEDDED DATA (mirrors backend data.ts — no server needed)
    ----------------------------------------------------------------------- */
    const CITIES = {
        delhi:  { name: "Delhi (NCR)",  lat: 28.6139, lng: 77.2090, state: "Delhi" },
        jaipur: { name: "Jaipur (RJ)",  lat: 26.9124, lng: 75.7873, state: "Rajasthan" },
        manali: { name: "Manali (HP)",  lat: 32.2396, lng: 77.1887, state: "Himachal Pradesh" },
        mumbai: { name: "Mumbai (MH)",  lat: 19.0760, lng: 72.8777, state: "Maharashtra" },
        goa:    { name: "Goa (GA)",     lat: 15.2993, lng: 74.1240, state: "Goa" },
        kochi:  { name: "Kochi (KL)",   lat:  9.9312, lng: 76.2673, state: "Kerala" }
    };

    const ROUTE_DATABASE = {
        "delhi-jaipur": {
            distance: 270, duration: 5, safetyIndex: "9.4/10",
            states: ["Delhi", "Haryana", "Rajasthan"],
            trainPrice: 650, busPrice: 850,
            path: [[28.6139,77.2090],[28.4595,77.0266],[28.1487,76.6141],[27.5619,76.6234],[27.2093,76.1264],[26.9124,75.7873]]
        },
        "delhi-manali": {
            distance: 530, duration: 12, safetyIndex: "9.1/10",
            states: ["Delhi", "Haryana", "Punjab", "Himachal Pradesh"],
            trainPrice: 900, busPrice: 1100,
            path: [[28.6139,77.2090],[29.3909,76.9635],[29.6857,76.9905],[30.3752,76.7821],[30.7333,76.7794],[31.3260,76.9749],[31.7087,76.9320],[31.9579,77.1887],[32.2396,77.1887]]
        },
        "mumbai-goa": {
            distance: 600, duration: 11, safetyIndex: "9.2/10",
            states: ["Maharashtra", "Goa"],
            trainPrice: 800, busPrice: 1200,
            path: [[19.0760,72.8777],[18.5204,73.8567],[17.6805,74.0183],[16.7050,74.2433],[15.8943,74.0041],[15.2993,74.1240]]
        },
        "goa-kochi": {
            distance: 780, duration: 15, safetyIndex: "8.9/10",
            states: ["Goa", "Karnataka", "Kerala"],
            trainPrice: 1050, busPrice: 1400,
            path: [[15.2993,74.1240],[14.8080,74.1313],[14.2708,74.4447],[13.3409,74.7421],[12.9141,74.8560],[11.8745,75.3704],[11.2588,75.7804],[9.9312,76.2673]]
        },
        "delhi-mumbai": {
            distance: 1400, duration: 23, safetyIndex: "9.0/10",
            states: ["Delhi", "Rajasthan", "Maharashtra"],
            trainPrice: 1200, busPrice: 1800,
            path: [[28.6139,77.2090],[26.9124,75.7873],[24.5854,73.7125],[22.7196,75.8577],[21.1458,79.0882],[19.0760,72.8777]]
        },
        "mumbai-kochi": {
            distance: 1200, duration: 22, safetyIndex: "8.8/10",
            states: ["Maharashtra", "Goa", "Karnataka", "Kerala"],
            trainPrice: 1100, busPrice: 1600,
            path: [[19.0760,72.8777],[17.3850,78.4867],[15.2993,74.1240],[13.0827,80.2707],[11.2588,75.7804],[9.9312,76.2673]]
        }
    };

    const HOSTEL_DIRECTORY = {
        delhi: [
            { name: "Zostel Delhi (Pahar Ganj)", price: 699, rating: 4.6, safety: "Safe (CCTV + Guards)", tags: ["Free Wifi", "Cafe", "Female Wing"], img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&auto=format" },
            { name: "The Hosteller Delhi", price: 549, rating: 4.4, safety: "Safe (24h Reception)", tags: ["AC Rooms", "Common Lounge", "Kitchen"], img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=300&auto=format" }
        ],
        jaipur: [
            { name: "Zostel Jaipur (Hawa Mahal Rd)", price: 599, rating: 4.8, safety: "Highly Safe (Solo female choice)", tags: ["Roof Cafe", "Walking Tours", "AC Dorms"], img: "https://images.unsplash.com/photo-1623625409419-756627063d8d?w=300&auto=format" },
            { name: "Moustache Hostel Jaipur", price: 499, rating: 4.6, safety: "Safe (Central Area)", tags: ["Pool Table", "Cultural Events", "Locker"], img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&auto=format" }
        ],
        manali: [
            { name: "Zostel Manali (Old Manali)", price: 649, rating: 4.9, safety: "Vibe Safe (Secure Locker)", tags: ["Snow View", "Bonfire", "Heated Beds"], img: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=300&auto=format" },
            { name: "The Hosteller Manali", price: 520, rating: 4.5, safety: "Safe (Mountain Patrol link)", tags: ["Cafe", "Trek Guides", "WFH Desks"], img: "https://images.unsplash.com/photo-1549294413-26f195afcbff?w=300&auto=format" }
        ],
        mumbai: [
            { name: "Cohostel Bandra", price: 950, rating: 4.5, safety: "Safe (Prime Location)", tags: ["AC Rooms", "Bandra Central", "Breakfast Incl"], img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&auto=format" },
            { name: "Backpacker Panda Colaba", price: 799, rating: 4.2, safety: "Safe (Card Key Access)", tags: ["Walk to Gateway", "Kitchen Access"], img: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=300&auto=format" }
        ],
        goa: [
            { name: "Jungle by Hosteller (Vagator)", price: 650, rating: 4.7, safety: "Safe (24/7 Security)", tags: ["Near Beach", "Pool Side", "Yoga Space"], img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&auto=format" },
            { name: "Zostel Goa (Calangute)", price: 799, rating: 4.8, safety: "Highly Safe (Female Dorms First)", tags: ["Sea Breeze", "Barbecue", "E-Bike Rentals"], img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&auto=format" }
        ],
        kochi: [
            { name: "Zostel Kochi (Fort Kochi)", price: 550, rating: 4.7, safety: "Safe (Local Neighborhood)", tags: ["Garden Patio", "Cycle Tour", "Kerala Lunch"], img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&auto=format" },
            { name: "Slightly Windy Hostel", price: 450, rating: 4.3, safety: "Safe (CCTV + Locker)", tags: ["Art Library", "Sea Food Cafe"], img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&auto=format" }
        ]
    };

    const FOOD_DIRECTORY = {
        delhi: [
            { name: "Paranthe Wali Gali (Chandni Chowk)", price: 120, rating: 4.5, type: "Traditional Fried Paranthas", safety: "Hygienic standard certified" },
            { name: "Karim's Mughal Food", price: 350, rating: 4.6, type: "Mutton Korma & Roti", safety: "Reputed family dine-in" }
        ],
        jaipur: [
            { name: "Laxmi Misthan Bhandar (LMB)", price: 250, rating: 4.7, type: "Rajasthani Thali & Pyaz Kachori", safety: "High footfall family restaurant" },
            { name: "Tapri Central", price: 180, rating: 4.8, type: "Masala Chai & Bun Maska", safety: "Very safe cafe for solo travelers" }
        ],
        manali: [
            { name: "Johnson's Cafe", price: 350, rating: 4.7, type: "Wood-fired Trout & Cider", safety: "Cozy fireside cafe" },
            { name: "Cafe 1947 (Old Manali)", price: 220, rating: 4.8, type: "Italian Pasta & Ginger Tea", safety: "Safe backpacker hub" }
        ],
        mumbai: [
            { name: "Cafe Mondegar Colaba", price: 300, rating: 4.6, type: "Keema Pav & Cold Brew", safety: "Always crowded, very safe" },
            { name: "Elco Pani Puri Bandra", price: 100, rating: 4.5, type: "Mineral Water Street Chaat", safety: "Ultra-hygienic preparation" }
        ],
        goa: [
            { name: "Britto's Beach Shack (Baga)", price: 400, rating: 4.4, type: "Goan Fish Curry & Bebinca", safety: "Well-lit beach crowd" },
            { name: "Gunpowder Assagao", price: 450, rating: 4.8, type: "Appam & Toddy Beef/Veg Stew", safety: "Premium secure garden layout" }
        ],
        kochi: [
            { name: "Kashi Art Cafe", price: 250, rating: 4.7, type: "Kerala Coffee & Chocolate Cake", safety: "Quiet art gallery setting" },
            { name: "Fort House Restaurant", price: 380, rating: 4.5, type: "Karimeen Pollichathu (Pearlspot)", safety: "Seaside dining, safe guards" }
        ]
    };

    const SIGHTS_DIRECTORY = {
        delhi: [
            { name: "Qutub Minar Complex", type: "Historical Monument", cost: "₹40", timing: "6:00 AM - 6:00 PM", desc: "12th-century brick minaret built by Qutb-ud-din Aibak." },
            { name: "India Gate & Kartavya Path", type: "National Memorial", cost: "Free", timing: "24/7 Open", desc: "War memorial dedicated to soldiers of British Indian Army." }
        ],
        jaipur: [
            { name: "Hawa Mahal (Palace of Winds)", type: "Royal Palace", cost: "₹50", timing: "9:00 AM - 5:00 PM", desc: "Five-story pink sandstone structure with 953 small casements." },
            { name: "Amber Fort & Sunset Point", type: "Historical Fortification", cost: "₹100", timing: "8:00 AM - 5:30 PM", desc: "Hilltop palace complex with artistic Hindu style elements." }
        ],
        manali: [
            { name: "Hadimba Temple", type: "Ancient Wood Temple", cost: "Free", timing: "8:00 AM - 6:00 PM", desc: "16th-century wooden temple surrounded by tall cedar trees." },
            { name: "Solang Valley Snow Point", type: "Adventure Valley", cost: "Entry Free", timing: "9:00 AM - 5:00 PM", desc: "Hotspot for paragliding, skiing, and snow activities." }
        ],
        mumbai: [
            { name: "Gateway of India & Taj Palace", type: "Colonial Landmark", cost: "Free", timing: "24/7 Viewable", desc: "Arch-monument built to commemorate the landing of King George V." },
            { name: "Marine Drive Promenade", type: "Coastline Boulevard", cost: "Free", timing: "24/7 Open", desc: "C-shaped road overlooking the Arabian Sea, safest night spot." }
        ],
        goa: [
            { name: "Fort Aguada Lighthouse", type: "Seaside Portuguese Fort", cost: "₹25", timing: "9:30 AM - 6:00 PM", desc: "17th-century lighthouse overlooking Sinquerim beach." },
            { name: "Anjuna Flea Market & Beach", type: "Culture & Beach", cost: "Free", timing: "Wednesdays Mostly", desc: "Hippie heritage market place with sunset trance sessions." }
        ],
        kochi: [
            { name: "Chinese Fishing Nets Fort Kochi", type: "Coastal Heritage", cost: "Free", timing: "Sunrise - Sunset", desc: "Iconic shore-operated cantilevered fishing nets." },
            { name: "Mattancherry Palace (Dutch Palace)", type: "Royal Museum", cost: "₹5", timing: "9:45 AM - 4:45 PM", desc: "Dutch-themed palace with beautiful Hindu murals and art." }
        ]
    };

    const MOCK_TRAVELERS = [
        { id: "trav_priya", name: "Priya Sharma", gender: "Female", age: 24, from: "Delhi", to: "Jaipur", state: "Rajasthan", activeNow: true, bio: "Digital nomad traveling around Rajasthan. Love exploring historical forts and capturing architectural photography. Open to sharing cab fares to Amber Fort!", avatar: "P" },
        { id: "trav_varun", name: "Varun Verma", gender: "Male", age: 26, from: "Mumbai", to: "Goa", state: "Goa", activeNow: true, bio: "Backpacking across coastal India. Looking for beach volley buddies at Anjuna Beach and trying out Goan vindaloo. Let's explore together!", avatar: "V" },
        { id: "trav_ananya", name: "Ananya Iyer", gender: "Female", age: 28, from: "Kochi", to: "Goa", state: "Kerala", activeNow: false, bio: "Slow traveler fascinated by colonial history and art cafes. Currently at Fort Kochi exploring Chinese fishing nets. Let's grab filter coffee!", avatar: "A" },
        { id: "trav_david", name: "David Miller", gender: "Male", age: 31, from: "Delhi", to: "Manali", state: "Himachal Pradesh", activeNow: true, bio: "Solo trekker heading up to Solang Valley and Hampta Pass. Safe mountain hiking partner. Hit me up if you want to bundle up stay costs in hostels!", avatar: "D" },
        { id: "trav_sneha", name: "Sneha Reddy", gender: "Female", age: 25, from: "Delhi", to: "Jaipur", state: "Rajasthan", activeNow: true, bio: "Female solo backpacker. First time visiting Rajasthan! Sticking to hostels like Zostel. Safe city sightseeing together.", avatar: "S" }
    ];

    /* -----------------------------------------------------------------------
       CHATBOT KNOWLEDGE BASE (built-in, no API needed)
    ----------------------------------------------------------------------- */
    const BOT_RESPONSES = {
        greeting: "Namaste! 🙏 I'm <strong>Sahayrak</strong>, your AI travel guide for India! Ask me about routes, safety, budget tips, or any destination in India.",
        rajasthan: "Rajasthan is magical for solo travelers! 🏯 I recommend the <strong>Golden Triangle</strong>: Delhi ➔ Jaipur ➔ Jodhpur ➔ Udaipur. Safety Index: <strong>9.4/10</strong>. Book Zostel Jaipur for ₹599/night — it has a rooftop cafe and female-only dorm wings.",
        himachal: "Himachal Pradesh is a paradise for solo backpackers! 🏔️ Old Manali, Dharamkot & Kasol are very traveler-friendly. <br><strong>Pro tip:</strong> Download offline maps before ascending — network drops near Rohtang Pass!",
        kerala: "Kerala is perfect for slow, immersive travel! 🌴 Hop on local passenger trains from Fort Kochi to Alappuzha. Backwaters houseboat stays start from ₹1200/night. Budget hostels near beaches from ₹450/night.",
        goa: "Goa is very safe for solo travelers including female backpackers! 🏖️ Choose hostels near <strong>Vagator or Anjuna</strong> over isolated villas. Use yellow-black 'Pilot' scooters for safe local transport.",
        mumbai: "Mumbai is one of India's safest metros! 🌆 Marine Drive is the safest night walk spot. Use BEST buses or local trains. Explore Dharavi, Colaba, and Bandra. Budget hostels near Colaba from ₹799/night.",
        safety: "Your safety is SoloSafiri's priority! 🛡️ <br>1. Keep SOS armed on the Safety tab.<br>2. Avoid unregistered taxis outside stations.<br>3. Share your live route with saved contacts.<br>4. Prefer government trains for overnight routes.<br>5. Carry offline maps — network fails in hill stations.",
        budget: "Travel cheap in India! 💰 <br>1. Book <strong>Sleeper (SL)</strong> or <strong>3AC</strong> on IRCTC.<br>2. Stay at Zostel/Hosteller: ₹500-800/night.<br>3. Eat at certified dhabas: ₹100-200/meal.<br>4. Use state buses over taxis for short distances.",
        helpline: "Emergency Helpline Numbers India: 📞 <br>🆘 <strong>112</strong> — National Emergency<br>👩 <strong>1091</strong> — Women Safety Helpline<br>🚂 <strong>139</strong> — Railway Security<br>🏥 <strong>108</strong> — Ambulance Services<br>🔥 <strong>101</strong> — Fire Emergency",
        train: "Indian Railways tips for solo travelers! 🚆 <br>1. Book on <strong>IRCTC</strong> — use Tatkal for last-minute.<br>2. Sleeper class: ₹500-900 for long routes.<br>3. Prefer <strong>AC 3 Tier</strong> for overnight safety.<br>4. Enable location sharing before boarding.",
        hostel: "Best hostel chains for solo travelers in India! 🏠 <br>1. <strong>Zostel</strong> — Most popular, female-safe dorms.<br>2. <strong>The Hosteller</strong> — Premium social experience.<br>3. <strong>Moustache</strong> — Cultural events + great vibe.<br>4. <strong>Backpacker Panda</strong> — Budget friendly.",
        food: "Must-try foods across India! 🍛 <br>Delhi: Paranthas at Chandni Chowk (₹120)<br>Jaipur: Pyaz Kachori at LMB (₹250)<br>Mumbai: Keema Pav at Mondegar (₹300)<br>Goa: Fish Curry Rice at shacks (₹400)<br>Kochi: Filter Coffee + Karimeen Fish (₹380)",
        default: "I can help you with routes, safety tips, budget travel, hostels, food, and emergency info across India! 🗺️ Try asking about a specific destination like <strong>Goa, Rajasthan, Kerala, Himachal</strong> or ask about <strong>safety, budget, or trains</strong>."
    };

    function getChatbotReply(message) {
        const t = message.toLowerCase();
        if (t.match(/^(hi|hello|hey|namaste|hola)/)) return BOT_RESPONSES.greeting;
        if (t.includes('rajasthan') || t.includes('jaipur') || t.includes('udaipur') || t.includes('jodhpur')) return BOT_RESPONSES.rajasthan;
        if (t.includes('himachal') || t.includes('manali') || t.includes('kasol') || t.includes('dharamkot') || t.includes('snow')) return BOT_RESPONSES.himachal;
        if (t.includes('kerala') || t.includes('kochi') || t.includes('munnar') || t.includes('alappuzha') || t.includes('backwater')) return BOT_RESPONSES.kerala;
        if (t.includes('goa') || t.includes('vagator') || t.includes('anjuna') || t.includes('calangute')) return BOT_RESPONSES.goa;
        if (t.includes('mumbai') || t.includes('bombay') || t.includes('marine drive') || t.includes('colaba')) return BOT_RESPONSES.mumbai;
        if (t.includes('safe') || t.includes('female') || t.includes('danger') || t.includes('security') || t.includes('solo')) return BOT_RESPONSES.safety;
        if (t.includes('budget') || t.includes('cheap') || t.includes('cost') || t.includes('money') || t.includes('afford')) return BOT_RESPONSES.budget;
        if (t.includes('number') || t.includes('phone') || t.includes('call') || t.includes('helpline') || t.includes('emergency')) return BOT_RESPONSES.helpline;
        if (t.includes('train') || t.includes('railway') || t.includes('irctc') || t.includes('sleeper') || t.includes('tatkal')) return BOT_RESPONSES.train;
        if (t.includes('hostel') || t.includes('zostel') || t.includes('hosteller') || t.includes('stay') || t.includes('dorm')) return BOT_RESPONSES.hostel;
        if (t.includes('food') || t.includes('eat') || t.includes('dhaba') || t.includes('restaurant') || t.includes('cuisine')) return BOT_RESPONSES.food;
        return BOT_RESPONSES.default;
    }

    /* -----------------------------------------------------------------------
       APP STATE
    ----------------------------------------------------------------------- */
    let state = {
        activeScreen: 'splash',
        gpsActive: true,
        userLocation: { lat: 28.6139, lng: 77.2090 },
        selectedSource: '',
        selectedDestination: '',
        sirenActive: false,
        autoSmsActive: true,
        activeMap: null,
        routePathLine: null,
        markersLayer: null,
        userProfile: {
            name: "Aaradhya Sen",
            email: "aaradhya.sen@gmail.com",
            gender: "Female",
            budget: "budget",
            contacts: [
                { name: "Papa Emergency", phone: "+91 98765 43210" },
                { name: "Riya (Best Friend)", phone: "+91 87654 32109" }
            ],
            history: [
                { id: "hist_1", route: "Delhi to Jaipur", date: "May 10, 2026", dist: "270 km" },
                { id: "hist_2", route: "Mumbai to Goa", date: "Apr 20, 2026", dist: "600 km" }
            ],
            badges: ["Shield Safe", "Hostel Hopper", "Rail Rider"]
        },
        activeChats: [
            { userId: "trav_varun", userName: "Varun Verma", lastMsg: "Hey! Let's meet at Vagator beach at 5pm?", time: "2m ago", unread: true, messages: [
                { sender: 'them', text: "Hey! I saw you are traveling on the Mumbai-Goa route as well.", time: "12:10" },
                { sender: 'me', text: "Yes! Currently planning to take the afternoon bus.", time: "12:12" },
                { sender: 'them', text: "Hey! Let's meet at Vagator beach at 5pm?", time: "12:15" }
            ]},
            { userId: "trav_priya", userName: "Priya Sharma", lastMsg: "No worries! Safe travels.", time: "Yesterday", unread: false, messages: [
                { sender: 'them', text: "Are you planning to check out the Light Show at Amber Fort today?", time: "Yesterday" },
                { sender: 'me', text: "Ah, missing it today. Visiting Hawa Mahal first.", time: "Yesterday" },
                { sender: 'them', text: "No worries! Safe travels.", time: "Yesterday" }
            ]}
        ],
        activeChatUser: null
    };

    /* -----------------------------------------------------------------------
       LOCAL STORAGE PERSISTENCE
    ----------------------------------------------------------------------- */
    function loadStateFromStorage() {
        const savedProfile = localStorage.getItem('solosafiri_profile');
        if (savedProfile) { try { state.userProfile = JSON.parse(savedProfile); } catch (e) {} }
        const savedChats = localStorage.getItem('solosafiri_chats');
        if (savedChats) { try { state.activeChats = JSON.parse(savedChats); } catch (e) {} }
    }

    function saveStateToStorage() {
        localStorage.setItem('solosafiri_profile', JSON.stringify(state.userProfile));
        localStorage.setItem('solosafiri_chats', JSON.stringify(state.activeChats));
    }

    /* -----------------------------------------------------------------------
       DOM REFERENCES
    ----------------------------------------------------------------------- */
    const screens = {
        splash:  document.getElementById('screen-splash'),
        home:    document.getElementById('screen-home'),
        explore: document.getElementById('screen-explore'),
        safety:  document.getElementById('screen-safety'),
        connect: document.getElementById('screen-connect'),
        chatbot: document.getElementById('screen-chatbot'),
        profile: document.getElementById('screen-profile')
    };

    const navItems = document.querySelectorAll('.nav-item');
    const sourceSelect = document.getElementById('route-source');
    const destSelect   = document.getElementById('route-destination');
    const btnFindRoute = document.getElementById('btn-find-route');
    const btnToggleGps = document.getElementById('btn-toggle-gps');
    const gpsStatusTxt = document.getElementById('gps-status-txt');
    const toastContainer = document.getElementById('toast-container');
    const globalModal  = document.getElementById('global-modal');
    const modalTitle   = document.getElementById('modal-title');
    const modalBody    = document.getElementById('modal-body');
    const modalFooter  = document.getElementById('modal-footer');
    const btnCloseModal = document.getElementById('btn-close-modal');

    /* -----------------------------------------------------------------------
       AUDIO: SIREN
    ----------------------------------------------------------------------- */
    let audioCtx = null, sirenOsc1 = null, sirenOsc2 = null, sirenGain = null, sirenInterval = null;

    function startSirenAudio() {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            sirenGain = audioCtx.createGain();
            sirenGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            sirenOsc1 = audioCtx.createOscillator(); sirenOsc1.type = 'sawtooth'; sirenOsc1.frequency.setValueAtTime(800, audioCtx.currentTime);
            sirenOsc2 = audioCtx.createOscillator(); sirenOsc2.type = 'sine'; sirenOsc2.frequency.setValueAtTime(850, audioCtx.currentTime);
            sirenOsc1.connect(sirenGain); sirenOsc2.connect(sirenGain); sirenGain.connect(audioCtx.destination);
            sirenOsc1.start(); sirenOsc2.start();
            let highTone = false;
            sirenInterval = setInterval(() => {
                if (highTone) { sirenOsc1.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1); sirenOsc2.frequency.exponentialRampToValueAtTime(850, audioCtx.currentTime + 0.1); }
                else { sirenOsc1.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1); sirenOsc2.frequency.exponentialRampToValueAtTime(1250, audioCtx.currentTime + 0.1); }
                highTone = !highTone;
            }, 300);
        } catch (e) { console.error("Web Audio API not supported", e); }
    }

    function stopSirenAudio() {
        if (sirenInterval) { clearInterval(sirenInterval); sirenInterval = null; }
        try { if (sirenOsc1) { sirenOsc1.stop(); sirenOsc1 = null; } } catch(e){}
        try { if (sirenOsc2) { sirenOsc2.stop(); sirenOsc2 = null; } } catch(e){}
        if (audioCtx) { audioCtx.close(); audioCtx = null; }
    }

    /* -----------------------------------------------------------------------
       GPS
    ----------------------------------------------------------------------- */
    let watchId = null, realTimeInterval = null, gpsMarker = null;

    function initRealTimeGPS() {
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => { state.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }; updateGPSMarker(pos.coords.latitude, pos.coords.longitude); },
                () => startSimulatedGPS(),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
            );
        } else { startSimulatedGPS(); }
    }

    function startSimulatedGPS() {
        let angle = 0;
        realTimeInterval = setInterval(() => {
            if (!state.gpsActive) return;
            angle += 0.02;
            const lat = state.userLocation.lat + Math.sin(angle) * 0.008;
            const lng = state.userLocation.lng + Math.cos(angle) * 0.008;
            state.userLocation = { lat, lng };
            updateGPSMarker(lat, lng);
        }, 4000);
    }

    function stopRealTimeGPS() {
        if (realTimeInterval) { clearInterval(realTimeInterval); realTimeInterval = null; }
        if (watchId) { navigator.geolocation.clearWatch(watchId); watchId = null; }
    }

    function updateGPSMarker(lat, lng) {
        if (gpsMarker) { gpsMarker.setLatLng([lat, lng]); }
        const gpsText = document.getElementById('safety-live-gps');
        if (gpsText) gpsText.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }

    /* -----------------------------------------------------------------------
       CLOCK
    ----------------------------------------------------------------------- */
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2,'0');
        const m = String(now.getMinutes()).padStart(2,'0');
        document.getElementById('status-time').textContent = `${h}:${m}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    /* -----------------------------------------------------------------------
       SCREEN SWITCHING
    ----------------------------------------------------------------------- */
    function switchScreen(targetScreenId) {
        if (!screens[targetScreenId]) return;
        state.activeScreen = targetScreenId;
        Object.keys(screens).forEach(k => screens[k].classList.remove('active'));
        screens[targetScreenId].classList.add('active');
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-screen') === targetScreenId);
        });
        if (targetScreenId === 'home' && state.activeMap) { setTimeout(() => state.activeMap.invalidateSize(), 150); }
        if (targetScreenId === 'profile') renderProfileValues();
        if (targetScreenId === 'safety') renderSafetyContacts();
        if (targetScreenId === 'connect') { renderTravelersFeed(); renderActiveChatsList(); }
    }

    navItems.forEach(item => item.addEventListener('click', () => switchScreen(item.getAttribute('data-screen'))));

    /* Splash → Home after 2.5s */
    setTimeout(() => {
        switchScreen('home');
        showToast("Welcome to SoloSafiri! 🧭 GPS tracking enabled.", "success");
    }, 2500);

    /* -----------------------------------------------------------------------
       MAP INIT
    ----------------------------------------------------------------------- */
    function initMap() {
        state.activeMap = L.map('leaflet-map', { zoomControl: false, attributionControl: false })
            .setView([state.userLocation.lat, state.userLocation.lng], 5);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(state.activeMap);
        state.markersLayer = L.layerGroup().addTo(state.activeMap);

        const gpsIcon = L.divIcon({
            className: 'gps-pulse-icon',
            html: `<div class="gps-pulse-outer"><div class="gps-pulse-inner"></div></div>`,
            iconSize: [24, 24], iconAnchor: [12, 12]
        });
        gpsMarker = L.marker([state.userLocation.lat, state.userLocation.lng], { icon: gpsIcon })
            .addTo(state.activeMap)
            .bindPopup("<b>You are here</b><br>Live GPS tracking active").openPopup();

        document.getElementById('map-zoom-in').addEventListener('click', () => state.activeMap.zoomIn());
        document.getElementById('map-zoom-out').addEventListener('click', () => state.activeMap.zoomOut());

        const layerBtn = document.getElementById('map-layer-toggle');
        layerBtn.addEventListener('click', () => {
            if (state.activeMap.hasLayer(state.markersLayer)) { state.activeMap.removeLayer(state.markersLayer); layerBtn.classList.remove('active'); showToast("Attraction markers hidden", "warning"); }
            else { state.activeMap.addLayer(state.markersLayer); layerBtn.classList.add('active'); showToast("Showing attraction markers", "success"); }
        });

        initRealTimeGPS();
    }

    /* -----------------------------------------------------------------------
       POPULATE DROPDOWNS (from embedded CITIES)
    ----------------------------------------------------------------------- */
    function populateDropdowns() {
        sourceSelect.innerHTML = '<option value="" disabled selected>Select Source Station...</option>';
        destSelect.innerHTML   = '<option value="" disabled selected>Select Destination...</option>';
        Object.keys(CITIES).forEach(key => {
            const city = CITIES[key];
            sourceSelect.appendChild(Object.assign(document.createElement('option'), { value: key, textContent: city.name }));
            destSelect.appendChild(Object.assign(document.createElement('option'), { value: key, textContent: city.name }));
        });
        sourceSelect.value = 'delhi';
        destSelect.value   = 'jaipur';
    }

    /* -----------------------------------------------------------------------
       ROUTE CALCULATION (fully local)
    ----------------------------------------------------------------------- */
    btnFindRoute.addEventListener('click', () => {
        const src = sourceSelect.value, dest = destSelect.value;
        if (!src || !dest) { showToast("Please select both source and destination.", "warning"); return; }
        if (src === dest) { showToast("Source and Destination cannot be the same.", "warning"); return; }
        calculateAndDrawRoute(src, dest);
    });

    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
        return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    }

    function calculateAndDrawRoute(srcKey, destKey) {
        if (state.routePathLine) state.activeMap.removeLayer(state.routePathLine);
        state.markersLayer.clearLayers();

        const srcCity  = CITIES[srcKey];
        const destCity = CITIES[destKey];
        const routeKey = `${srcKey}-${destKey}`;
        const routeRev = `${destKey}-${srcKey}`;
        const routeData = ROUTE_DATABASE[routeKey] || ROUTE_DATABASE[routeRev];

        let distance, duration, safetyIndex, states, path, trainPrice, busPrice;
        if (routeData) {
            distance    = routeData.distance;
            duration    = routeData.duration;
            safetyIndex = routeData.safetyIndex;
            states      = routeData.states;
            path        = routeData.path;
            trainPrice  = routeData.trainPrice;
            busPrice    = routeData.busPrice;
        } else {
            distance    = haversineDistance(srcCity.lat, srcCity.lng, destCity.lat, destCity.lng);
            duration    = Math.round(distance / 50);
            safetyIndex = (8.5 + Math.min(distance/1000,1)*1.5).toFixed(1) + '/10';
            states      = [srcCity.state, destCity.state];
            path        = [[srcCity.lat, srcCity.lng], [(srcCity.lat+destCity.lat)/2, (srcCity.lng+destCity.lng)/2], [destCity.lat, destCity.lng]];
            trainPrice  = Math.round(distance * 1.8);
            busPrice    = Math.round(distance * 2.2);
        }

        /* Update stats panel */
        document.getElementById('route-stats-panel').classList.remove('hide');
        document.getElementById('transit-panel').classList.remove('hide');
        document.getElementById('home-start-hint').classList.add('hide');

        document.getElementById('stat-distance').textContent = `${distance} km`;
        document.getElementById('stat-time').textContent     = `${duration} hrs`;
        document.getElementById('stat-safety').innerHTML     = `<i class="fa-solid fa-shield-halved"></i> ${safetyIndex}`;

        const statesContainer = document.getElementById('route-states-badge-container');
        statesContainer.innerHTML = '';
        states.forEach(st => {
            const badge = document.createElement('span');
            badge.className = 'state-badge';
            badge.innerHTML = `<i class="fa-solid fa-mountain"></i> ${st}`;
            statesContainer.appendChild(badge);
        });

        /* Transit prices */
        document.getElementById('transit-train-price').textContent = `₹ ${trainPrice}+`;
        document.getElementById('transit-train-time').textContent  = `~${duration} hrs`;
        document.getElementById('transit-bus-price').textContent   = `₹ ${busPrice}+`;
        document.getElementById('transit-bus-time').textContent    = `~${Math.round(duration*1.1)} hrs`;

        /* Draw route polyline */
        state.routePathLine = L.polyline(path, { color: '#06b6d4', weight: 5, opacity: 0.9, dashArray: '10, 8' }).addTo(state.activeMap);

        const srcIcon  = L.divIcon({ className: 'custom-pin-icon src-pin',  html: '<i class="fa-solid fa-circle-dot"></i>',  iconSize: [22,22] });
        const destIcon = L.divIcon({ className: 'custom-pin-icon dest-pin', html: '<i class="fa-solid fa-location-dot"></i>', iconSize: [22,22] });
        L.marker([srcCity.lat, srcCity.lng],  { icon: srcIcon  }).addTo(state.markersLayer).bindPopup(`<b>From: ${srcCity.name}</b>`);
        L.marker([destCity.lat, destCity.lng], { icon: destIcon }).addTo(state.markersLayer).bindPopup(`<b>To: ${destCity.name}</b>`);

        /* Drop hostel & sight markers near destination */
        const hostels = HOSTEL_DIRECTORY[destKey] || [];
        const sights  = SIGHTS_DIRECTORY[destKey] || [];
        const hotelIcon = L.divIcon({ className: 'pin-icon-stay',  html: '<i class="fa-solid fa-hotel"></i>',  iconSize: [24,24] });
        const sightIcon = L.divIcon({ className: 'pin-icon-sight', html: '<i class="fa-solid fa-camera"></i>', iconSize: [24,24] });
        hostels.forEach((h, i) => { const off = (i+1)*0.014; L.marker([destCity.lat+off, destCity.lng-off], { icon: hotelIcon }).addTo(state.markersLayer).bindPopup(`<b>${h.name}</b><br>₹${h.price}/night ⭐${h.rating}`); });
        sights.forEach((s, i)  => { const off = (i+1)*0.022; L.marker([destCity.lat-off, destCity.lng+off], { icon: sightIcon }).addTo(state.markersLayer).bindPopup(`<b>${s.name}</b><br>${s.type}`); });

        state.activeMap.fitBounds(state.routePathLine.getBounds(), { padding: [40, 40] });

        document.getElementById('explore-location-title').textContent = `Results along: ${srcCity.name} ➔ ${destCity.name}`;
        loadAccommodations(destKey);
        loadLocalFoods(destKey);
        loadTouristSights(destKey);
        renderTravelersFeed(destCity.state);

        /* Save to history */
        const histEntry = { id: `hist_${Date.now()}`, route: `${srcCity.name} to ${destCity.name}`, date: new Date().toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' }), dist: `${distance} km` };
        state.userProfile.history.unshift(histEntry);
        if (state.userProfile.history.length > 5) state.userProfile.history.pop();
        saveStateToStorage();

        showToast(`Safest route: ${srcCity.name} ➔ ${destCity.name} (${distance} km)`, "success");
    }

    /* -----------------------------------------------------------------------
       GPS TOGGLE
    ----------------------------------------------------------------------- */
    btnToggleGps.addEventListener('click', () => {
        state.gpsActive = !state.gpsActive;
        if (state.gpsActive) {
            btnToggleGps.querySelector('i').className = "fa-solid fa-location-crosshairs text-accent pulse-gps";
            gpsStatusTxt.textContent = "GPS On";
            initRealTimeGPS();
            showToast("Live GPS tracking resumed", "success");
        } else {
            btnToggleGps.querySelector('i').className = "fa-solid fa-location-crosshairs text-muted";
            gpsStatusTxt.textContent = "GPS Off";
            stopRealTimeGPS();
            showToast("GPS paused. SOS location frozen.", "warning");
        }
    });

    /* -----------------------------------------------------------------------
       EXPLORE TABS
    ----------------------------------------------------------------------- */
    const exploreTabs  = document.querySelectorAll('.explore-tab');
    const exploreViews = document.querySelectorAll('.explore-category-view');
    exploreTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.getAttribute('data-explore-tab');
            exploreTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            exploreViews.forEach(v => v.classList.toggle('active', v.id === `explore-view-${cat}`));
        });
    });

    /* Hotel price filter */
    document.getElementById('hotel-price-filter').addEventListener('change', (e) => {
        const max = e.target.value === 'all' ? Infinity : parseInt(e.target.value);
        document.querySelectorAll('#explore-hotels-list .explore-card').forEach(card => {
            const price = parseInt(card.getAttribute('data-price') || '0');
            card.style.display = (max === Infinity || price <= max) ? 'block' : 'none';
        });
    });

    /* -----------------------------------------------------------------------
       LOAD ACCOMMODATIONS
    ----------------------------------------------------------------------- */
    function loadAccommodations(cityKey) {
        const container = document.getElementById('explore-hotels-list');
        const hostels   = HOSTEL_DIRECTORY[cityKey] || [];
        if (hostels.length === 0) { container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-hotel"></i><p>No budget accommodations found for this location.</p></div>`; return; }
        container.innerHTML = '';
        hostels.forEach(h => {
            const card = document.createElement('div');
            card.className = 'explore-card';
            card.setAttribute('data-price', h.price);
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img class="card-img" src="${h.img}" alt="${h.name}" loading="lazy" />
                    <span class="safety-rating-badge"><i class="fa-solid fa-shield"></i> Female Safe</span>
                </div>
                <div class="card-info">
                    <div class="card-title-row">
                        <h4>${h.name}</h4>
                        <span class="card-address"><i class="fa-solid fa-location-pin"></i> Nearby Station</span>
                    </div>
                    <div class="card-amenities">${h.tags.map(t => `<span class="amenity-chip">${t}</span>`).join('')}</div>
                    <div class="card-price-row">
                        <div class="card-rating"><i class="fa-solid fa-star"></i> ${h.rating}</div>
                        <div>
                            <span class="card-price">₹${h.price}<span>/night</span></span>
                            <button class="btn-book" data-hotel="${h.name}">Book Dorm</button>
                        </div>
                    </div>
                </div>`;
            container.appendChild(card);
        });
        container.querySelectorAll('.btn-book').forEach(btn => {
            btn.addEventListener('click', () => openBookingModal(btn.getAttribute('data-hotel')));
        });
    }

    /* -----------------------------------------------------------------------
       LOAD LOCAL FOODS
    ----------------------------------------------------------------------- */
    function loadLocalFoods(cityKey) {
        const container = document.getElementById('explore-food-list');
        const foods     = FOOD_DIRECTORY[cityKey] || [];
        if (foods.length === 0) { container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-utensils"></i><p>No registered local eateries along this route.</p></div>`; return; }
        container.innerHTML = '';
        foods.forEach(f => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.innerHTML = `
                <div class="card-header-with-action">
                    <h4 style="color:var(--color-gold);font-size:14px;"><i class="fa-solid fa-bowl-food"></i> ${f.name}</h4>
                    <span class="card-rating"><i class="fa-solid fa-star"></i> ${f.rating}</span>
                </div>
                <p style="font-size:12px;margin-bottom:6px;"><strong>Specialty:</strong> ${f.type}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-color);padding-top:8px;margin-top:4px;">
                    <span style="font-size:11px;color:var(--color-text-muted);"><i class="fa-solid fa-circle-check text-success"></i> ${f.safety}</span>
                    <strong style="color:var(--color-accent)">Avg: ₹${f.price}</strong>
                </div>`;
            container.appendChild(card);
        });
    }

    /* -----------------------------------------------------------------------
       LOAD TOURIST SIGHTS
    ----------------------------------------------------------------------- */
    function loadTouristSights(cityKey) {
        const container = document.getElementById('explore-places-list');
        const sights    = SIGHTS_DIRECTORY[cityKey] || [];
        if (sights.length === 0) { container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-mountain-sun"></i><p>No major sights catalogued for this region.</p></div>`; return; }
        container.innerHTML = '';
        sights.forEach(s => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.innerHTML = `
                <div class="card-header-with-action">
                    <h4 style="font-size:14px;font-weight:700;"><i class="fa-solid fa-mountain-sun text-accent"></i> ${s.name}</h4>
                    <span class="state-badge" style="margin:0">${s.type}</span>
                </div>
                <p style="font-size:11px;color:var(--color-text-muted);margin-bottom:8px;">${s.desc}</p>
                <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--color-text-muted);border-top:1px solid var(--border-color);padding-top:6px;">
                    <span><i class="fa-regular fa-clock"></i> ${s.timing}</span>
                    <span><strong>Ticket:</strong> ${s.cost}</span>
                </div>`;
            container.appendChild(card);
        });
    }

    /* -----------------------------------------------------------------------
       BOOKING MODAL
    ----------------------------------------------------------------------- */
    function openBookingModal(hotelName) {
        modalTitle.textContent = "Confirm Solo Dorm Bed Booking";
        modalBody.innerHTML = `
            <p>You are booking <strong>1x Sleeper/Dorm Bed</strong> at:</p>
            <p style="font-size:14px;color:var(--color-accent);font-weight:700;margin:8px 0;">${hotelName}</p>
            <p>SoloSafiri benefits included:</p>
            <ul>
                <li>Female-only safety security wings priority</li>
                <li>Emergency check-out safety backup</li>
                <li>Free evening local travelers mixer pass</li>
            </ul>
            <p style="margin-top:12px;">Payment settled at property. Confirm?</p>`;
        modalFooter.innerHTML = `
            <button class="btn btn-outline btn-sm" id="btn-modal-cancel">Go Back</button>
            <button class="btn btn-secondary btn-sm" id="btn-modal-confirm">Confirm Dorm</button>`;
        globalModal.classList.remove('hide');
        document.getElementById('btn-modal-cancel').onclick = closeModal;
        document.getElementById('btn-modal-confirm').onclick = () => {
            closeModal();
            addBadgeToProfile("Hostel Hopper");
            showToast(`Dorm Bed reserved at ${hotelName}! Details sent via Email.`, "success");
        };
    }

    function closeModal() { globalModal.classList.add('hide'); }
    btnCloseModal.addEventListener('click', closeModal);
    globalModal.addEventListener('click', (e) => { if (e.target === globalModal) closeModal(); });

    /* -----------------------------------------------------------------------
       SAFETY / SOS
    ----------------------------------------------------------------------- */
    const btnSosMain  = document.getElementById('btn-sos-main');
    const sosCountdownContainer = document.getElementById('sos-countdown-container');
    const sosCountdownNum = document.getElementById('sos-countdown-num');
    const btnSosCancel = document.getElementById('btn-sos-cancel');
    const safetyBanner = document.getElementById('safety-alert-active-banner');
    const btnDeactivateSos = document.getElementById('btn-deactivate-sos');
    const btnToggleSiren   = document.getElementById('btn-toggle-siren');
    const btnToggleAutoSms = document.getElementById('btn-toggle-auto-sms');
    const contactsList     = document.getElementById('safety-contacts-list');
    const btnAddContactSafety = document.getElementById('btn-add-contact-safety');

    let countdownVal = 5, countdownInterval = null;

    btnToggleSiren.addEventListener('click', () => {
        state.sirenActive = !state.sirenActive;
        btnToggleSiren.className = state.sirenActive ? "safety-ctrl-toggle alarm-on" : "safety-ctrl-toggle alarm-off";
        if (!state.sirenActive) stopSirenAudio();
        showToast(state.sirenActive ? "Loud Siren armed for SOS" : "Loud Siren disabled", state.sirenActive ? "success" : "warning");
    });

    btnToggleAutoSms.addEventListener('click', () => {
        state.autoSmsActive = !state.autoSmsActive;
        btnToggleAutoSms.className = state.autoSmsActive ? "safety-ctrl-toggle sms-on" : "safety-ctrl-toggle sms-off";
        showToast(state.autoSmsActive ? "Auto SOS SMS dispatch active" : "Auto SOS dispatch disabled", state.autoSmsActive ? "success" : "warning");
    });

    btnSosMain.addEventListener('click', triggerSosCountdown);
    document.getElementById('btn-quick-sos').addEventListener('click', () => { switchScreen('safety'); triggerSosCountdown(); });

    function triggerSosCountdown() {
        if (!safetyBanner.classList.contains('hide')) { showToast("SOS is already active!", "warning"); return; }
        countdownVal = 5;
        sosCountdownNum.textContent = countdownVal;
        sosCountdownContainer.classList.remove('hide');
        countdownInterval = setInterval(() => {
            countdownVal--;
            sosCountdownNum.textContent = countdownVal;
            if (countdownVal <= 0) { clearInterval(countdownInterval); activateEmergencySOS(); }
        }, 1000);
    }

    btnSosCancel.addEventListener('click', () => {
        clearInterval(countdownInterval);
        sosCountdownContainer.classList.add('hide');
        showToast("Emergency SOS aborted.", "warning");
    });

    function activateEmergencySOS() {
        sosCountdownContainer.classList.add('hide');
        safetyBanner.classList.remove('hide');
        document.getElementById('safety-live-gps').textContent = `${state.userLocation.lat.toFixed(5)}, ${state.userLocation.lng.toFixed(5)}`;
        if (state.sirenActive) startSirenAudio();

        const lat = state.userLocation.lat.toFixed(5);
        const lng = state.userLocation.lng.toFixed(5);
        const mapLink = `https://maps.google.com/?q=${lat},${lng}`;

        modalTitle.textContent = "🚨 SOS Alert Dispatched";
        modalBody.innerHTML = `
            <p>Your emergency signal has been broadcast!</p>
            <div style="background:rgba(239,68,68,0.1);border:1px solid var(--color-danger);padding:10px;border-radius:10px;margin:8px 0;font-family:monospace;font-size:11px;color:#f87171;">
                STATUS: SOS ACTIVE<br>
                Coordinates: ${lat}, ${lng}<br>
                Map Link: <a href="${mapLink}" target="_blank" style="color:var(--color-accent)">View on Google Maps</a><br>
                Contacts Notified: ${state.userProfile.contacts.length}
            </div>
            <p>Stay calm. Help is being contacted.</p>`;
        modalFooter.innerHTML = `<button class="btn btn-primary btn-sm" id="btn-modal-sms-ok">Acknowledge</button>`;
        globalModal.classList.remove('hide');
        document.getElementById('btn-modal-sms-ok').onclick = closeModal;

        addBadgeToProfile("Shield Safe");
        showToast("🚨 SOS Alert Broadcasted! Help is enroute.", "danger");
    }

    btnDeactivateSos.addEventListener('click', () => {
        safetyBanner.classList.add('hide');
        stopSirenAudio();
        showToast("Emergency SOS deactivated. Stay safe!", "success");
    });

    function renderSafetyContacts() {
        contactsList.innerHTML = '';
        if (state.userProfile.contacts.length === 0) {
            contactsList.innerHTML = '<p style="font-size:12px;color:var(--color-text-muted);text-align:center;">No emergency contacts added. Add in Profile settings.</p>';
            return;
        }
        state.userProfile.contacts.forEach((c, idx) => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <div class="contact-avatar">${c.name.charAt(0).toUpperCase()}</div>
                <div class="contact-info"><h5>${c.name}</h5><p>${c.phone}</p></div>
                <button class="btn-remove-contact" data-idx="${idx}" aria-label="Remove"><i class="fa-solid fa-trash-can"></i></button>`;
            contactsList.appendChild(card);
        });
        contactsList.querySelectorAll('.btn-remove-contact').forEach(btn => {
            btn.addEventListener('click', () => {
                state.userProfile.contacts.splice(parseInt(btn.getAttribute('data-idx')), 1);
                saveStateToStorage(); renderSafetyContacts();
                showToast("Emergency contact removed", "warning");
            });
        });
    }

    btnAddContactSafety.addEventListener('click', () => { switchScreen('profile'); document.getElementById('new-contact-name').focus(); });

    document.querySelectorAll('.helpline-item').forEach(item => {
        item.addEventListener('click', () => {
            const num = item.getAttribute('data-call');
            window.location.href = `tel:${num}`;
            showToast(`Dialing ${num}...`, "success");
        });
    });

    /* -----------------------------------------------------------------------
       CONNECT HUB
    ----------------------------------------------------------------------- */
    const connectTabs  = document.querySelectorAll('.connect-tab');
    const connectViews = document.querySelectorAll('.connect-sub-view');
    const travelersList = document.getElementById('connect-travelers-list');
    const chatsListContainer = document.getElementById('chats-list-container');
    const activeChatsList = document.getElementById('active-chats-list');
    const chatWindowBox   = document.getElementById('chat-window-box');
    const chatWinName     = document.getElementById('chat-win-name');
    const chatWinAvatar   = document.getElementById('chat-win-avatar');
    const chatWinMessagesList = document.getElementById('chat-win-messages-list');
    const chatWinInput    = document.getElementById('chat-win-input');
    const btnChatWinSend  = document.getElementById('btn-chat-win-send');
    const btnBackChatsList = document.getElementById('btn-back-chats-list');

    connectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.getAttribute('data-connect-tab');
            connectTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
            connectViews.forEach(v => v.classList.toggle('active', v.id === `connect-view-${cat}`));
            if (cat === 'chat') closeChatWindow();
        });
    });

    function renderTravelersFeed(stateFilter = '') {
        travelersList.innerHTML = '';
        let travelers = MOCK_TRAVELERS;
        if (stateFilter) {
            const filtered = travelers.filter(t => t.state.toLowerCase().includes(stateFilter.toLowerCase()) || stateFilter.toLowerCase().includes(t.state.toLowerCase()));
            travelers = filtered.length > 0 ? filtered : MOCK_TRAVELERS;
        }
        travelers.forEach(t => {
            const card = document.createElement('div');
            card.className = 'glass-card traveler-card';
            const statusDot = t.activeNow ? '<span class="green-dot"></span>' : '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#555;margin-right:4px;"></span>';
            card.innerHTML = `
                <div class="traveler-header">
                    <div class="contact-avatar" style="background:var(--color-primary)">${t.avatar}</div>
                    <div class="traveler-info">
                        <h4>${t.name} <span style="font-size:10px;font-weight:400;color:var(--color-text-muted)">(${t.age}, ${t.gender})</span></h4>
                        <span class="traveler-route-label"><i class="fa-solid fa-plane-departure"></i> ${t.from} ➔ ${t.to}</span>
                    </div>
                    <button class="btn btn-sm btn-secondary btn-connect-chat" data-id="${t.id}" data-name="${t.name}">Chat</button>
                </div>
                <p class="traveler-desc">"${t.bio}"</p>
                <div class="traveler-footer">
                    <span class="active-bubble" style="padding:1px 6px;font-size:8px;">${statusDot}${t.activeNow ? 'Active Now' : 'Recently Active'} in ${t.state}</span>
                </div>`;
            travelersList.appendChild(card);
        });
        travelersList.querySelectorAll('.btn-connect-chat').forEach(btn => {
            btn.addEventListener('click', () => openOrCreateChatWindow(btn.getAttribute('data-id'), btn.getAttribute('data-name')));
        });
    }

    function renderActiveChatsList() {
        activeChatsList.innerHTML = '';
        if (state.activeChats.length === 0) { activeChatsList.innerHTML = '<p style="font-size:12px;color:var(--color-text-muted);text-align:center;padding:20px;">No conversations. Start from the Travelers Feed!</p>'; return; }
        state.activeChats.forEach(chat => {
            const card = document.createElement('div');
            card.className = 'chat-card';
            card.innerHTML = `
                <div class="contact-avatar" style="background:var(--color-accent);margin-right:12px;">${chat.userName.charAt(0)}</div>
                <div class="chat-card-info">
                    <div class="chat-name-row"><h4>${chat.userName}</h4><span class="chat-time">${chat.time}</span></div>
                    <p class="chat-preview-msg" style="${chat.unread ? 'font-weight:700;color:white;' : ''}">${chat.lastMsg}</p>
                </div>
                ${chat.unread ? '<span class="badge-dot" style="position:static;margin-left:8px;"></span>' : ''}`;
            card.addEventListener('click', () => openChatSession(chat));
            activeChatsList.appendChild(card);
        });
    }

    function openOrCreateChatWindow(userId, userName) {
        connectTabs.forEach(t => t.classList.remove('active')); connectTabs[1].classList.add('active');
        connectViews.forEach(v => v.classList.remove('active')); document.getElementById('connect-view-chat').classList.add('active');
        let existingChat = state.activeChats.find(c => c.userId === userId);
        if (!existingChat) {
            existingChat = { userId, userName, lastMsg: "Connected! Say hello 👋", time: "Just now", unread: false, messages: [{ sender:'them', text:`Hi! I saw your journey query. Let me know if you want to team up!`, time:"Just now" }] };
            state.activeChats.unshift(existingChat);
            saveStateToStorage(); renderActiveChatsList();
        }
        openChatSession(existingChat);
    }

    function openChatSession(chat) {
        state.activeChatUser = chat; chat.unread = false;
        saveStateToStorage(); renderActiveChatsList();
        chatsListContainer.classList.add('hide'); chatWindowBox.classList.remove('hide');
        chatWinName.textContent = chat.userName; chatWinAvatar.textContent = chat.userName.charAt(0);
        renderChatWindowMessages();
    }

    function closeChatWindow() { chatWindowBox.classList.add('hide'); chatsListContainer.classList.remove('hide'); state.activeChatUser = null; }

    btnBackChatsList.addEventListener('click', closeChatWindow);

    function renderChatWindowMessages() {
        chatWinMessagesList.innerHTML = '';
        if (!state.activeChatUser) return;
        state.activeChatUser.messages.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${msg.sender === 'me' ? 'outbound' : 'inbound'}`;
            bubble.innerHTML = `${msg.text}<span class="chat-bubble-time">${msg.time}</span>`;
            chatWinMessagesList.appendChild(bubble);
        });
        chatWinMessagesList.scrollTop = chatWinMessagesList.scrollHeight;
    }

    function sendDirectChatMessage() {
        const text = chatWinInput.value.trim();
        if (!text || !state.activeChatUser) return;
        const now = new Date();
        const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
        state.activeChatUser.messages.push({ sender:'me', text, time:timeStr });
        state.activeChatUser.lastMsg = text; state.activeChatUser.time = "Just now";
        chatWinInput.value = '';
        renderChatWindowMessages(); saveStateToStorage();
        simulateTravelerResponse(state.activeChatUser);
    }

    btnChatWinSend.addEventListener('click', sendDirectChatMessage);
    chatWinInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendDirectChatMessage(); });

    const TRAVELER_REPLIES = [
        "Awesome! Let me check ticket availability and we can align timings.",
        "Yes! Planning to reach by evening. Want to share a cab from the station?",
        "Totally! I found a great dhaba near the hostel. Let's grab dinner!",
        "Sure! I'm at Zostel right now — super safe and clean. Recommend it!",
        "That route is scenic! I did it last week. Pro tip: book window seat.",
        "Great idea! We can split the auto fare from the railway station.",
        "I'm exploring the fort tomorrow morning — want to join?",
        "Yes, the local market opens at 10 AM. Best time to visit with a group!"
    ];

    function simulateTravelerResponse(activeChat) {
        const lastMsg = (activeChat.messages[activeChat.messages.length - 1]?.text || '').toLowerCase();
        setTimeout(() => {
            if (!state.activeChatUser || state.activeChatUser.userId !== activeChat.userId) return;
            const now = new Date();
            const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
            let reply;
            if (lastMsg.match(/^(hi|hello|hey|namaste)/)) reply = "Hey! Glad you reached out. Are you staying at one of the Zostel hostels?";
            else if (lastMsg.includes('hostel') || lastMsg.includes('stay')) reply = "Yeah, Zostel is great — safe lockers and female dorm wings. Highly recommend!";
            else if (lastMsg.includes('food') || lastMsg.includes('eat')) reply = "The local dhaba near the main market is amazing! ₹150 for a full thali.";
            else if (lastMsg.includes('route') || lastMsg.includes('travel')) reply = "That route is beautiful! The train takes about 5 hours — get a window seat!";
            else reply = TRAVELER_REPLIES[Math.floor(Math.random() * TRAVELER_REPLIES.length)];
            activeChat.messages.push({ sender:'them', text:reply, time:timeStr });
            activeChat.lastMsg = reply; activeChat.time = "Just now";
            renderChatWindowMessages(); saveStateToStorage();
            showToast(`New message from ${activeChat.userName}`, "success");
        }, 2000 + Math.random() * 1500);
    }

    /* -----------------------------------------------------------------------
       CONNECT: POST TRIP MODAL
    ----------------------------------------------------------------------- */
    document.getElementById('btn-post-trip').addEventListener('click', () => {
        modalTitle.textContent = "📢 Post Your Trip";
        modalBody.innerHTML = `
            <p style="margin-bottom:12px;">Share your journey to connect with fellow travelers!</p>
            <div class="form-group" style="margin-bottom:10px;">
                <label>From City</label>
                <select id="post-from-city" style="width:100%;padding:8px;background:var(--glass-bg);border:1px solid var(--border-color);border-radius:8px;color:white;">
                    ${Object.keys(CITIES).map(k => `<option value="${CITIES[k].name}">${CITIES[k].name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group" style="margin-bottom:10px;">
                <label>To City</label>
                <select id="post-to-city" style="width:100%;padding:8px;background:var(--glass-bg);border:1px solid var(--border-color);border-radius:8px;color:white;">
                    ${Object.keys(CITIES).map(k => `<option value="${CITIES[k].name}">${CITIES[k].name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Travel Note (optional)</label>
                <input type="text" id="post-travel-note" placeholder="e.g. Looking for cab-share partners!" style="width:100%;padding:8px;background:var(--glass-bg);border:1px solid var(--border-color);border-radius:8px;color:white;"/>
            </div>`;
        modalFooter.innerHTML = `
            <button class="btn btn-outline btn-sm" id="btn-modal-cancel">Cancel</button>
            <button class="btn btn-secondary btn-sm" id="btn-modal-post">Post Trip</button>`;
        globalModal.classList.remove('hide');
        document.getElementById('btn-modal-cancel').onclick = closeModal;
        document.getElementById('btn-modal-post').onclick = () => {
            const from = document.getElementById('post-from-city').value;
            const to   = document.getElementById('post-to-city').value;
            closeModal();
            showToast(`Trip posted: ${from} ➔ ${to}! Travelers will see your post.`, "success");
        };
    });

    /* -----------------------------------------------------------------------
       AI CHATBOT (SAHAYRAK — fully local, no API)
    ----------------------------------------------------------------------- */
    const chatbotMessagesList = document.getElementById('chatbot-messages-list');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const btnSendChatbot = document.getElementById('btn-send-chatbot');

    async function sendChatbotMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;
        renderMessageBubble(text, 'user');
        chatbotInput.value = '';
        const typingIndicator = showTypingIndicator();
        /* Simulate thinking delay for realism */
        await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
        typingIndicator.remove();
        const reply = getChatbotReply(text);
        renderMessageBubble(reply, 'bot');
    }

    function renderMessageBubble(text, sender) {
        const now = new Date();
        const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.innerHTML = `<div class="msg-bubble"><p>${text}</p></div><span class="msg-time">${timeStr}</span>`;
        chatbotMessagesList.appendChild(msgDiv);
        chatbotMessagesList.scrollTop = chatbotMessagesList.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg bot';
        typingDiv.innerHTML = `<div class="msg-bubble typing-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
        chatbotMessagesList.appendChild(typingDiv);
        chatbotMessagesList.scrollTop = chatbotMessagesList.scrollHeight;
        return typingDiv;
    }

    btnSendChatbot.addEventListener('click', sendChatbotMessage);
    chatbotInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatbotMessage(); });
    document.querySelectorAll('.quick-chip').forEach(chip => {
        chip.addEventListener('click', () => { chatbotInput.value = chip.getAttribute('data-prompt'); sendChatbotMessage(); });
    });

    /* -----------------------------------------------------------------------
       PROFILE & CONTACTS
    ----------------------------------------------------------------------- */
    const inputName   = document.getElementById('input-user-name');
    const inputEmail  = document.getElementById('input-user-email');
    const inputGender = document.getElementById('input-user-gender');
    const inputBudget = document.getElementById('input-user-budget');
    const btnSaveProfile = document.getElementById('btn-save-profile');
    const inputContactName  = document.getElementById('new-contact-name');
    const inputContactPhone = document.getElementById('new-contact-phone');
    const btnAddContact = document.getElementById('btn-add-contact');

    function renderProfileValues() {
        document.getElementById('profile-disp-name').textContent  = state.userProfile.name;
        document.getElementById('profile-disp-email').textContent = state.userProfile.email;
        document.getElementById('profile-stat-trips').textContent  = state.userProfile.history.length.toString();
        document.getElementById('profile-stat-states').textContent = [...new Set(state.userProfile.history.map(h => h.route.split(' to ')[1]))].length.toString();
        document.getElementById('profile-stat-badges').textContent = state.userProfile.badges.length.toString();
        inputName.value   = state.userProfile.name;
        inputEmail.value  = state.userProfile.email;
        inputGender.value = state.userProfile.gender;
        inputBudget.value = state.userProfile.budget;

        /* Render history */
        const historyList = document.getElementById('profile-history-list');
        historyList.innerHTML = '';
        (state.userProfile.history.length > 0 ? state.userProfile.history : [
            { id:'h1', route:'Delhi to Jaipur', date:'May 10, 2026', dist:'270 km' },
            { id:'h2', route:'Mumbai to Goa', date:'Apr 20, 2026', dist:'600 km' }
        ]).slice(0,4).forEach(h => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-icon-circle"><i class="fa-solid fa-map"></i></div>
                <div class="history-details"><h5>${h.route}</h5><p>${h.date} • ${h.dist}</p></div>
                <i class="fa-solid fa-chevron-right text-muted"></i>`;
            historyList.appendChild(item);
        });

        /* Render badges */
        const badgesRow = document.getElementById('profile-badges-row');
        badgesRow.innerHTML = '';
        const badgeMeta = {
            "Shield Safe":    { cls: "gold-badge",   icon: "fa-shield-cat" },
            "Hostel Hopper":  { cls: "copper-badge", icon: "fa-campground" },
            "Rail Rider":     { cls: "silver-badge", icon: "fa-train-subway" },
            "Goa Beach":      { cls: "gray-badge",   icon: "fa-umbrella-beach" }
        };
        Object.entries(badgeMeta).forEach(([key, meta]) => {
            const has = state.userProfile.badges.includes(key);
            const item = document.createElement('div');
            item.className = `badge-item ${has ? 'active' : 'lock'}`;
            item.title = has ? 'Badge unlocked!' : 'Keep traveling to unlock!';
            item.innerHTML = `<div class="badge-icon ${has ? meta.cls : 'gray-badge'}"><i class="fa-solid ${meta.icon}"></i></div><span>${key}</span>`;
            badgesRow.appendChild(item);
        });
    }

    btnSaveProfile.addEventListener('click', () => {
        state.userProfile.name   = inputName.value.trim()  || state.userProfile.name;
        state.userProfile.email  = inputEmail.value.trim() || state.userProfile.email;
        state.userProfile.gender = inputGender.value;
        state.userProfile.budget = inputBudget.value;
        saveStateToStorage(); renderProfileValues();
        showToast("Profile updated successfully!", "success");
    });

    btnAddContact.addEventListener('click', () => {
        const nameVal  = inputContactName.value.trim();
        const phoneVal = inputContactPhone.value.trim();
        if (!nameVal || !phoneVal) { showToast("Please fill contact name and phone number.", "warning"); return; }
        state.userProfile.contacts.push({ name: nameVal, phone: phoneVal });
        inputContactName.value = ''; inputContactPhone.value = '';
        saveStateToStorage();
        showToast("Emergency Contact added!", "success");
        renderSafetyContacts();
    });

    function addBadgeToProfile(badgeName) {
        if (!state.userProfile.badges.includes(badgeName)) {
            state.userProfile.badges.push(badgeName);
            saveStateToStorage(); renderProfileValues();
            showToast(`🏆 Badge Unlocked: ${badgeName}!`, "success");
        }
    }

    document.getElementById('btn-change-avatar').addEventListener('click', () => {
        showToast("Camera feature available in mobile app!", "success");
    });

    /* -----------------------------------------------------------------------
       TOAST NOTIFICATIONS
    ----------------------------------------------------------------------- */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icons = { success: 'fa-circle-check', danger: 'fa-triangle-exclamation', warning: 'fa-circle-exclamation' };
        toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.classList.add('toast-out'); toast.addEventListener('animationend', () => toast.remove()); }, 3200);
    }

    /* -----------------------------------------------------------------------
       NOTIFICATIONS BUTTON
    ----------------------------------------------------------------------- */
    document.getElementById('btn-notifications').addEventListener('click', () => {
        modalTitle.textContent = "🔔 Notifications";
        modalBody.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="padding:10px;background:rgba(6,182,212,0.1);border-radius:8px;border-left:3px solid var(--color-accent);">
                    <strong style="font-size:12px;">New Traveler Nearby</strong>
                    <p style="font-size:11px;color:var(--color-text-muted);margin-top:4px;">Sneha Reddy is on the Delhi-Jaipur route. 2m ago</p>
                </div>
                <div style="padding:10px;background:rgba(245,158,11,0.1);border-radius:8px;border-left:3px solid var(--color-gold);">
                    <strong style="font-size:12px;">Safety Tip</strong>
                    <p style="font-size:11px;color:var(--color-text-muted);margin-top:4px;">Network coverage is low near Rohtang Pass. Download offline maps!</p>
                </div>
                <div style="padding:10px;background:rgba(34,197,94,0.1);border-radius:8px;border-left:3px solid var(--color-success);">
                    <strong style="font-size:12px;">Route Safety Update</strong>
                    <p style="font-size:11px;color:var(--color-text-muted);margin-top:4px;">Delhi-Jaipur highway safety index: 9.4/10. Safe to travel!</p>
                </div>
            </div>`;
        modalFooter.innerHTML = `<button class="btn btn-primary btn-sm" id="btn-notif-close">Close</button>`;
        globalModal.classList.remove('hide');
        document.getElementById('btn-notif-close').onclick = closeModal;
    });

    /* -----------------------------------------------------------------------
       BOOTSTRAP
    ----------------------------------------------------------------------- */
    loadStateFromStorage();
    initMap();
    populateDropdowns();

    /* Initial data render for connect tab */
    renderTravelersFeed();
    renderActiveChatsList();

    /* Render profile so data is loaded immediately */
    renderProfileValues();
    renderSafetyContacts();
});
