import "@testing-library/jest-dom";

import { distance } from "../../utils/distance";

test ('calculate distance in km and mi between two airports (PEK, SHA)', () => {
    const d = distance(40.080101013183594, 116.58499908447266, 31.198104, 121.33426);
    expect(d.distance_km).toBe(1076);
    expect(d.distance_mi).toBe(669);
});

test ('calculate distance in km and mi between two airports (PEK, JFK)', () => {
    const d = distance(40.080101013183594, 116.58499908447266, 40.639447, -73.779317);
    expect(d.distance_km).toBe(10978);
    expect(d.distance_mi).toBe(6822);
});

test ('calculate distance in km and mi between two airports (PEK, SYD)', () => {
    const d = distance(40.080101013183594, 116.58499908447266, -33.946098, 151.177002);
    expect(d.distance_km).toBe(8965);
    expect(d.distance_mi).toBe(5570);
});

test ('calculate distance in km and mi between two airports (PEK, EZE)', () => {
    const d = distance(40.080101013183594, 116.58499908447266, -34.8222, -58.5358);
    expect(d.distance_km).toBe(19289);
    expect(d.distance_mi).toBe(11986);
});