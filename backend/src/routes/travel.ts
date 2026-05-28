import { Router, Request, Response } from 'express';
import axios from 'axios';
import { CITIES, HOSTEL_DIRECTORY, FOOD_DIRECTORY, SIGHTS_DIRECTORY, MOCK_TRAVELERS } from '../data';

const router = Router();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

async function getGoogleMapsRoute(source: string, destination: string) {
    try {
        const srcCity = CITIES[source.toLowerCase()];
        const destCity = CITIES[destination.toLowerCase()];
        
        if (!srcCity || !destCity || !GOOGLE_MAPS_API_KEY) {
            return null;
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json`,
            {
                params: {
                    origin: `${srcCity.lat},${srcCity.lng}`,
                    destination: `${destCity.lat},${destCity.lng}`,
                    key: GOOGLE_MAPS_API_KEY
                },
                timeout: 5000
            }
        );

        if (response.data.status === 'OK' && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            const path = route.overview_polyline?.points ? 
                decodePolyline(route.overview_polyline.points) : 
                [[srcCity.lat, srcCity.lng], [destCity.lat, destCity.lng]];
            
            return {
                distance: Math.round(route.legs[0].distance.value / 1000),
                duration: Math.round(route.legs[0].duration.value / 3600),
                safetyIndex: calculateSafetyIndex(route.legs[0].distance.value / 1000),
                states: getStatesBetween(srcCity.state, destCity.state),
                path: path
            };
        }
        return null;
    } catch (error) {
        console.error('Google Maps API error:', error);
        return null;
    }
}

function decodePolyline(encoded: string): [number, number][] {
    let points: [number, number][] = [];
    let index = 0, lat = 0, lng = 0;
    
    while (index < encoded.length) {
        let b, shift = 0, result = 0;
        
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        
        const dlat = (result & 1 ? ~(result >> 1) : result >> 1);
        lat += dlat;
        
        shift = 0;
        result = 0;
        
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        
        const dlng = (result & 1 ? ~(result >> 1) : result >> 1);
        lng += dlng;
        
        points.push([lat / 1e5, lng / 1e5]);
    }
    
    return points;
}

function calculateSafetyIndex(distance: number): string {
    const baseScore = 8.5;
    const distanceFactor = Math.min(distance / 1000, 1) * 1.5;
    return (baseScore + distanceFactor).toFixed(1) + '/10';
}

function getStatesBetween(srcState: string, destState: string): string[] {
    const stateSequence: Record<string, string[]> = {
        'delhi-rajasthan': ['Delhi', 'Haryana', 'Rajasthan'],
        'delhi-himachal pradesh': ['Delhi', 'Haryana', 'Punjab', 'Himachal Pradesh'],
        'maharashtra-goa': ['Maharashtra', 'Goa'],
        'goa-kerala': ['Goa', 'Karnataka', 'Kerala']
    };
    const key = `${srcState.toLowerCase()}-${destState.toLowerCase()}`;
    return stateSequence[key] || [srcState, destState];
}

router.get('/cities', (req: Request, res: Response) => {
    res.json(CITIES);
});

router.post('/route', async (req: Request, res: Response) => {
    const { source, destination } = req.body;

    if (!source || !destination) {
        return res.status(400).json({ error: "Source and Destination keys are required" });
    }

    const srcCity = CITIES[source.toLowerCase()];
    const destCity = CITIES[destination.toLowerCase()];

    if (!srcCity || !destCity) {
        return res.status(404).json({ error: "Invalid source or destination city key" });
    }

    const routeKey = `${source.toLowerCase()}-${destination.toLowerCase()}`;
    const routeRevKey = `${destination.toLowerCase()}-${source.toLowerCase()}`;
    
    let routeDetails = null;

    if (GOOGLE_MAPS_API_KEY) {
        routeDetails = await getGoogleMapsRoute(source, destination);
    }

    if (!routeDetails) {
        const calculatedDistance = getDistance(srcCity.lat, srcCity.lng, destCity.lat, destCity.lng);
        routeDetails = {
            distance: calculatedDistance,
            duration: Math.round(calculatedDistance / 50),
            safetyIndex: "9.0/10",
            states: [srcCity.state, destCity.state],
            path: [
                [srcCity.lat, srcCity.lng],
                [(srcCity.lat + destCity.lat) / 2, (srcCity.lng + destCity.lng) / 2],
                [destCity.lat, destCity.lng]
            ]
        };
    }

    res.json(routeDetails);
});

router.get('/stays/:city', (req: Request, res: Response) => {
    const cityKey = req.params.city.toLowerCase();
    const hostels = HOSTEL_DIRECTORY[cityKey] || [];
    res.json(hostels);
});

router.get('/foods/:city', (req: Request, res: Response) => {
    const cityKey = req.params.city.toLowerCase();
    const foods = FOOD_DIRECTORY[cityKey] || [];
    res.json(foods);
});

router.get('/sights/:city', (req: Request, res: Response) => {
    const cityKey = req.params.city.toLowerCase();
    const sights = SIGHTS_DIRECTORY[cityKey] || [];
    res.json(sights);
});

router.get('/travelers', (req: Request, res: Response) => {
    const stateQuery = req.query.state as string;
    
    if (stateQuery) {
        const filtered = MOCK_TRAVELERS.filter(t => 
            t.state.toLowerCase().includes(stateQuery.toLowerCase()) || 
            stateQuery.toLowerCase().includes(t.state.toLowerCase())
        );
        return res.json(filtered.length > 0 ? filtered : MOCK_TRAVELERS);
    }
    
    res.json(MOCK_TRAVELERS);
});

export default router;
