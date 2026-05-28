/* ==========================================================================
   SOLOSAFIRI BACKEND DATA MODEL & REGISTRY
   ========================================================================== */

export interface City {
    name: string;
    lat: number;
    lng: number;
    state: string;
}

export interface RouteData {
    distance: number;
    duration: number;
    safetyIndex: string;
    states: string[];
    path: [number, number][];
}

export interface Hostel {
    name: string;
    price: number;
    rating: number;
    safety: string;
    tags: string[];
    img: string;
}

export interface Food {
    name: string;
    price: number;
    rating: number;
    type: string;
    safety: string;
}

export interface Sight {
    name: string;
    type: string;
    cost: string;
    timing: string;
    desc: string;
}

export interface Traveler {
    id: string;
    name: string;
    gender: string;
    age: number;
    from: string;
    to: string;
    state: string;
    activeNow: boolean;
    bio: string;
    avatar: string;
}

export const CITIES: Record<string, City> = {
    delhi: { name: "Delhi (NCR)", lat: 28.6139, lng: 77.2090, state: "Delhi" },
    jaipur: { name: "Jaipur (RJ)", lat: 26.9124, lng: 75.7873, state: "Rajasthan" },
    manali: { name: "Manali (HP)", lat: 32.2396, lng: 77.1887, state: "Himachal Pradesh" },
    mumbai: { name: "Mumbai (MH)", lat: 19.0760, lng: 72.8777, state: "Maharashtra" },
    goa: { name: "Goa (GA)", lat: 15.2993, lng: 74.1240, state: "Goa" },
    kochi: { name: "Kochi (KL)", lat: 9.9312, lng: 76.2673, state: "Kerala" }
};

export const ROUTE_DATABASE: Record<string, RouteData> = {
    "delhi-jaipur": {
        distance: 270,
        duration: 5,
        safetyIndex: "9.4/10",
        states: ["Delhi", "Haryana", "Rajasthan"],
        path: [
            [28.6139, 77.2090],
            [28.4595, 77.0266],
            [28.1487, 76.6141],
            [27.5619, 76.6234],
            [27.2093, 76.1264],
            [26.9124, 75.7873]
        ]
    },
    "delhi-manali": {
        distance: 530,
        duration: 12,
        safetyIndex: "9.1/10",
        states: ["Delhi", "Haryana", "Punjab", "Himachal Pradesh"],
        path: [
            [28.6139, 77.2090],
            [29.3909, 76.9635],
            [29.6857, 76.9905],
            [30.3752, 76.7821],
            [30.7333, 76.7794],
            [31.3260, 76.9749],
            [31.7087, 76.9320],
            [31.9579, 77.1887],
            [32.2396, 77.1887]
        ]
    },
    "mumbai-goa": {
        distance: 600,
        duration: 11,
        safetyIndex: "9.2/10",
        states: ["Maharashtra", "Goa"],
        path: [
            [19.0760, 72.8777],
            [18.5204, 73.8567],
            [17.6805, 74.0183],
            [16.7050, 74.2433],
            [15.8943, 74.0041],
            [15.2993, 74.1240]
        ]
    },
    "goa-kochi": {
        distance: 780,
        duration: 15,
        safetyIndex: "8.9/10",
        states: ["Goa", "Karnataka", "Kerala"],
        path: [
            [15.2993, 74.1240],
            [14.8080, 74.1313],
            [14.2708, 74.4447],
            [13.3409, 74.7421],
            [12.9141, 74.8560],
            [11.8745, 75.3704],
            [11.2588, 75.7804],
            [9.9312, 76.2673]
        ]
    }
};

export const HOSTEL_DIRECTORY: Record<string, Hostel[]> = {
    delhi: [
        { name: "Zostel Delhi (Pahar Ganj)", price: 699, rating: 4.6, safety: "Safe (CCTV + Guards)", tags: ["Free Wifi", "Cafe", "Female Wing"], img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200" },
        { name: "The Hosteller Delhi", price: 549, rating: 4.4, safety: "Safe (24h Reception)", tags: ["AC Rooms", "Common lounge"], img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=200" }
    ],
    jaipur: [
        { name: "Zostel Jaipur (Hawa Mahal Rd)", price: 599, rating: 4.8, safety: "Highly Safe (Solo female choice)", tags: ["Roof Cafe", "Walking Tours", "AC dorms"], img: "https://images.unsplash.com/photo-1623625409419-756627063d8d?w=200" },
        { name: "Moustache Hostel Jaipur", price: 499, rating: 4.6, safety: "Safe (Central Area)", tags: ["Pool table", "Cultural Eve", "Dorm Locker"], img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200" }
    ],
    manali: [
        { name: "Zostel Manali (Old Manali)", price: 649, rating: 4.9, safety: "Vibe Safe (Secure Locker)", tags: ["Snow view", "Bonfire", "Heated Beds"], img: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=200" },
        { name: "The Hosteller Manali", price: 520, rating: 4.5, safety: "Safe (Mountain Patrol link)", tags: ["Cafe", "Trek Guides", "Wfh desks"], img: "https://images.unsplash.com/photo-1549294413-26f195afcbff?w=200" }
    ],
    mumbai: [
        { name: "Cohostel Bandra", price: 950, rating: 4.5, safety: "Safe (Prime Location)", tags: ["AC Rooms", "Bandra Central", "Breakfast incl"], img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200" },
        { name: "Backpacker Panda Colaba", price: 799, rating: 4.2, safety: "Safe (Card Key Access)", tags: ["Walk to Gateway", "Kitchen access"], img: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=200" }
    ],
    goa: [
        { name: "Jungle by Hosteller (Vagator)", price: 650, rating: 4.7, safety: "Safe (24/7 Security)", tags: ["Near Beach", "Pool side", "Yoga space"], img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200" },
        { name: "Zostel Goa (Calangute)", price: 799, rating: 4.8, safety: "Highly Safe (Female dorms first)", tags: ["Sea breeze", "Barbecue", "E-Bike rentals"], img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200" }
    ],
    kochi: [
        { name: "Zostel Kochi (Fort Kochi)", price: 550, rating: 4.7, safety: "Safe (Local neighborhood)", tags: ["Garden patio", "Cycle tour", "Kerala Lunch"], img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=200" },
        { name: "Slightly Windy Hostel", price: 450, rating: 4.3, safety: "Safe (CCTV + Locker)", tags: ["Art library", "Sea Food Cafe"], img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=200" }
    ]
};

export const FOOD_DIRECTORY: Record<string, Food[]> = {
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

export const SIGHTS_DIRECTORY: Record<string, Sight[]> = {
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

export const MOCK_TRAVELERS: Traveler[] = [
    { id: "trav_priya", name: "Priya Sharma", gender: "Female", age: 24, from: "Delhi", to: "Jaipur", state: "Rajasthan", activeNow: true, bio: "Digital nomad traveling around Rajasthan. Love exploring historical forts and capturing architectural photography. Open to sharing cab fares to Amber Fort!", avatar: "P" },
    { id: "trav_varun", name: "Varun Verma", gender: "Male", age: 26, from: "Mumbai", to: "Goa", state: "Goa", activeNow: true, bio: "Backpacking across coastal India. Looking for beach volley buddies at Anjuna Beach and trying out Goan vindaloo. Let's explore together!", avatar: "V" },
    { id: "trav_ananya", name: "Ananya Iyer", gender: "Female", age: 28, from: "Kochi", to: "Goa", state: "Kerala", activeNow: false, bio: "Slow traveler fascinated by colonial history and art cafes. Currently at Fort Kochi exploring Chinese fishing nets. Let's grab filter coffee!", avatar: "A" },
    { id: "trav_david", name: "David Miller", gender: "Male", age: 31, from: "Delhi", to: "Manali", state: "Himachal Pradesh", activeNow: true, bio: "Solo trekker heading up to Solang Valley and Hampta Pass. Safe mountain hiking partner. Hit me up if you want to bundle up stay costs in hostels!", avatar: "D" },
    { id: "trav_sneha", name: "Sneha Reddy", gender: "Female", age: 25, from: "Delhi", to: "Jaipur", state: "Rajasthan", activeNow: true, bio: "Female solo backpacker. First time visiting Rajasthan! Sticking to hostels like Zostel. Safe city sightseeing together.", avatar: "S" }
];