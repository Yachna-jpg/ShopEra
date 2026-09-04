"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfileClient({ initialUser }: { initialUser: any }) {
  const { update } = useSession();

  const [name, setName] = useState(initialUser?.name || "");
  const [email] = useState(initialUser?.email || "");
  const [phone, setPhone] = useState(initialUser?.phone || "");
  const [streetAddress, setStreetAddress] = useState(initialUser?.streetAddress || initialUser?.address || "");
  const [apartment, setApartment] = useState(initialUser?.apartment || "");
  const [city, setCity] = useState(initialUser?.city || "");
  const [state, setState] = useState(initialUser?.state || "");
  const [postalCode, setPostalCode] = useState(initialUser?.postalCode || "");
  const [country, setCountry] = useState(initialUser?.country || "India");
  const [lat, setLat] = useState<number | null>(initialUser?.latitude || 12.9716); // Default: Bengaluru
  const [lng, setLng] = useState<number | null>(initialUser?.longitude || 77.5946);

  const [searchQuery, setSearchQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const showToast = (msg: string, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3500);
  };

  // Reverse Geocode helper using OpenStreetMap Nominatim
  const reverseGeocode = async (latitude: number, longitude: number) => {
    setIsGeocoding(true);
    setLat(latitude);
    setLng(longitude);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        { headers: { "User-Agent": "ShopEra-App/1.0" } }
      );
      if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();
      const addr = data.address || {};

      const road = addr.road || addr.pedestrian || addr.footway || addr.suburb || "";
      const house = addr.house_number || addr.building || "";
      const fullStreet = [house, road].filter(Boolean).join(" ");
      if (fullStreet) setStreetAddress(fullStreet);

      const apt = addr.neighbourhood || addr.residential || "";
      if (apt && !apartment) setApartment(apt);

      const cityName = addr.city || addr.town || addr.village || addr.county || "";
      if (cityName) setCity(cityName);

      const stateName = addr.state || addr.region || "";
      if (stateName) setState(stateName);

      const postCode = addr.postcode || "";
      if (postCode) setPostalCode(postCode);

      const countryName = addr.country || "India";
      if (countryName) setCountry(countryName);

      showToast("Address auto-populated from pin location!", "success");
    } catch (err) {
      console.warn("Reverse geocode error:", err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Search address coordinates using Nominatim forward geocoding
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        { headers: { "User-Agent": "ShopEra-App/1.0" } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const targetLat = parseFloat(data[0].lat);
        const targetLon = parseFloat(data[0].lon);
        setLat(targetLat);
        setLng(targetLon);

        if (mapRef.current) {
          mapRef.current.setView([targetLat, targetLon], 15);
          if (markerRef.current) {
            markerRef.current.setLatLng([targetLat, targetLon]);
          }
        }
        await reverseGeocode(targetLat, targetLon);
      } else {
        showToast("Location not found. Try entering a city or landmark.", "error");
      }
    } catch (err) {
      showToast("Could not search location.", "error");
    } finally {
      setIsGeocoding(false);
    }
  };

  // Get current device GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }
    setIsGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const curLat = pos.coords.latitude;
        const curLng = pos.coords.longitude;
        setLat(curLat);
        setLng(curLng);

        if (mapRef.current) {
          mapRef.current.setView([curLat, curLng], 16);
          if (markerRef.current) {
            markerRef.current.setLatLng([curLat, curLng]);
          }
        }
        reverseGeocode(curLat, curLng);
      },
      (err) => {
        showToast("Unable to retrieve your location. Please select on map.", "error");
        setIsGeocoding(false);
      }
    );
  };

  // Initialize Leaflet Map
  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet Script
    const loadLeafletScript = () => {
      if ((window as any).L && !mapRef.current) {
        const L = (window as any).L;
        const initialLat = lat || 12.9716;
        const initialLng = lng || 77.5946;

        const map = L.map("leaflet-map-container", {
          center: [initialLat, initialLng],
          zoom: 14,
          scrollWheelZoom: false,
          touchZoom: true,
          dragging: true,
          tapHold: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Mobile Crisp Retina Custom SVG Marker
        const customIcon = L.divIcon({
          className: "custom-map-pin",
          html: `<div style="background-color: #273D33; width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; items-center; justify-content: center; border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.3); margin-top: -36px; margin-left: -18px;">
            <div style="width: 12px; height: 12px; background-color: #E29578; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        const marker = L.marker([initialLat, initialLng], { 
          draggable: true,
          icon: customIcon,
          autoPan: true
        }).addTo(map);

        marker.on("dragend", function (e: any) {
          const position = e.target.getLatLng();
          reverseGeocode(position.lat, position.lng);
        });

        map.on("click", function (e: any) {
          marker.setLatLng(e.latlng);
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = map;
        markerRef.current = marker;
      }
    };

    if (typeof (window as any).L !== "undefined") {
      loadLeafletScript();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = loadLeafletScript;
      document.body.appendChild(script);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Submit Handler -> Database persistence
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Full Name is required.", "error");
      return;
    }
    if (!streetAddress.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      showToast("Please complete all required shipping address fields.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const parts = [
        streetAddress.trim(),
        apartment.trim() ? `Apt/Suite: ${apartment.trim()}` : null,
        city.trim(),
        `${state.trim()} - ${postalCode.trim()}`,
        country.trim() || "India",
      ].filter(Boolean);
      const fullFormattedAddress = parts.join(", ");

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        streetAddress: streetAddress.trim(),
        apartment: apartment.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim() || "India",
        latitude: lat,
        longitude: lng,
        address: fullFormattedAddress,
      };

      const response = await apiFetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      await update(payload);
      showToast("Profile & Address successfully saved to your account!", "success");
    } catch (err: any) {
      console.error("Profile save error:", err);
      showToast(err.message || "Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background min-h-screen font-body-md text-on-surface antialiased flex flex-col justify-between">
      <Navbar />

      {/* Toast Feedback Notification */}
      {toast.visible && (
        <div
          className={`fixed bottom-6 right-6 z-[200] px-5 py-4 rounded-2xl shadow-2xl animate-in fade-in flex items-center gap-3 border ${
            toast.type === "success"
              ? "bg-secondary text-on-secondary border-secondary/40"
              : "bg-inverse-surface text-inverse-on-surface border-outline-variant/30"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {toast.type === "success" ? "check_circle" : "warning"}
          </span>
          <span className="font-label-md text-label-md font-medium">{toast.message}</span>
        </div>
      )}

      <main className="w-full pt-28 pb-20 flex-grow">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
                  Account Hub
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-caption text-caption text-on-surface-variant">Member Privilege Curation</span>
              </div>
              <h1 className="font-display-lg text-display-lg font-bold text-on-surface tracking-tight mt-1">
                My Profile &amp; Address Studio
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xl">
                Manage your personal identity, pin your precise delivery coordinates on the interactive map, and store your default shipping destination.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/orders"
                className="h-12 px-space-lg rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold inline-flex items-center gap-2 transition-colors border border-outline-variant/30 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>My Orders</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
            {/* Left Column: Personal Identity & Interactive Map Picker */}
            <div className="lg:col-span-6 flex flex-col gap-space-lg">
              {/* Account Card */}
              <div className="bg-surface-container-low p-space-xl rounded-3xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary text-on-primary font-bold text-xl flex items-center justify-center shadow-md">
                    {name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{name || "Valued Member"}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{email}</p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-caption font-bold uppercase tracking-wider">
                      Verified Member
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Map Location Picker Container */}
              <div className="bg-surface-container-low p-space-xl rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col gap-space-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
                      Interactive Pin Location
                    </span>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Drop Delivery Map Pin
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isGeocoding}
                    className="h-10 px-4 rounded-full bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-label-sm text-label-sm font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[16px]">my_location</span>
                    <span>Use Current GPS</span>
                  </button>
                </div>

                {/* Location Search Bar */}
                <form onSubmit={handleSearchLocation} className="relative w-full">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, area, landmark, or PIN code..."
                    className="w-full h-11 pl-11 pr-24 rounded-full bg-surface-container-lowest border border-outline/40 font-body-sm text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-outline-variant"
                  />
                  <button
                    type="submit"
                    disabled={isGeocoding}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-semibold hover:bg-on-surface transition-colors"
                  >
                    Search
                  </button>
                </form>

                {/* Leaflet Map Display */}
                <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-outline-variant/30 shadow-inner">
                  <div id="leaflet-map-container" className="w-full h-full z-10" />

                  {isGeocoding && (
                    <div className="absolute inset-0 z-20 bg-surface/60 backdrop-blur-xs flex items-center justify-center gap-2 font-label-md text-label-md text-on-surface font-semibold">
                      <span className="material-symbols-outlined animate-spin text-[20px] text-primary">progress_activity</span>
                      <span>Fetching Address Coordinates...</span>
                    </div>
                  )}
                </div>

                {/* Lat / Lon Pill Indicator */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 font-caption text-caption text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
                    <span>Click or drag marker on map to refine your address</span>
                  </div>
                  <span className="font-mono bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface font-semibold">
                    {lat && lng ? `${lat.toFixed(4)}°, ${lng.toFixed(4)}°` : "No pin selected"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Address & Profile Form */}
            <div className="lg:col-span-6">
              <form
                onSubmit={handleSubmitProfile}
                className="bg-surface-container-low p-space-xl lg:p-space-2xl rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col gap-space-md"
              >
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
                      Database Records
                    </span>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Shipping Address Form
                    </h3>
                  </div>
                  <span className="font-caption text-caption px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold uppercase tracking-wider">
                    Synced with DB
                  </span>
                </div>

                <div className="space-y-space-md">
                  {/* Full Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="space-y-1">
                      <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                        placeholder="e.g. Julian Vane"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                      Flat / House No. &amp; Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                      placeholder="123 Park Avenue, MG Road"
                    />
                  </div>

                  {/* Apartment, Suite, Floor (Optional) */}
                  <div className="space-y-1">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                      Apartment, Suite, Landmark <span className="text-outline font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                      placeholder="Apt 4B, 2nd Floor"
                    />
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="space-y-1">
                      <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                        placeholder="Bengaluru"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                        placeholder="Karnataka"
                      />
                    </div>
                  </div>

                  {/* Postal Code & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="space-y-1">
                      <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                        Postal / PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                        placeholder="560038"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                        placeholder="India"
                      />
                    </div>
                  </div>
                </div>

                {/* Form CTA Action */}
                <div className="pt-space-xs border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">shield</span>
                    256-bit encrypted PostgreSQL storage
                  </span>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="h-14 px-space-2xl rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold hover:bg-on-surface transition-all transform hover:scale-[1.01] shadow-md disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <span>Save Profile &amp; Address</span>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
