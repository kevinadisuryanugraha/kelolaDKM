import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MASJID_INFO } from '../../data/mockData';
import { MapPin, Navigation, ExternalLink, Phone, Clock, Key, ShieldCheck, Copy, Check } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Exact coordinates for Masjid Jami Nurul Iman, Pejaten Timur, Jakarta Selatan
const MASJID_COORDINATES = { lat: -6.275812, lng: 106.848030 };

// Nearby landmarks for interactive points of interest
const NEARBY_LANDMARKS = [
  { name: 'Stasiun Pasar Minggu', lat: -6.2842, lng: 106.8443, type: 'Stasiun KRL' },
  { name: 'Stasiun Duren Kalibata', lat: -6.2558, lng: 106.8552, type: 'Stasiun KRL' },
  { name: 'Polsek Pasar Minggu', lat: -6.2801, lng: 106.8412, type: 'Layanan Publik' },
  { name: 'Kelurahan Pejaten Timur', lat: -6.2732, lng: 106.8465, type: 'Kantor Kelurahan' },
];

export const MasjidGoogleMap: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${MASJID_INFO.name} ${MASJID_INFO.address}`
  )}`;

  const googleMapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${MASJID_COORDINATES.lat},${MASJID_COORDINATES.lng}&destination_place_id=${encodeURIComponent(MASJID_INFO.name)}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(MASJID_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden space-y-0 transition-colors">
      {/* Header Info */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Lokasi Presisi Google Maps</span>
          </div>
          <h3 className="text-xl font-bold">{MASJID_INFO.name} Pejaten</h3>
          <p className="text-xs text-emerald-200 max-w-xl">{MASJID_INFO.address}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={copyAddress}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Alamat'}</span>
          </button>
          <a
            href={googleMapsDirUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-emerald-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            <Navigation className="w-3.5 h-3.5 fill-emerald-950" />
            <span>Petunjuk Arah</span>
          </a>
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative w-full h-[420px] sm:h-[480px] bg-slate-100 dark:bg-slate-950 overflow-hidden">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={MASJID_COORDINATES}
              defaultZoom={16}
              mapId="MASJID_NURUL_IMAN_MAP_ID"
              style={{ width: '100%', height: '100%' }}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {/* Main Masjid Marker */}
              <AdvancedMarker
                ref={markerRef}
                position={MASJID_COORDINATES}
                title={MASJID_INFO.name}
                onClick={() => setInfoWindowOpen(true)}
              >
                <Pin background="#047857" glyphColor="#fef3c7" borderColor="#064e3b" />
              </AdvancedMarker>

              {/* Nearby Landmarks Markers */}
              {NEARBY_LANDMARKS.map((lm, idx) => (
                <AdvancedMarker key={idx} position={{ lat: lm.lat, lng: lm.lng }} title={lm.name}>
                  <Pin background="#0284c7" glyphColor="#ffffff" borderColor="#075985" scale={0.8} />
                </AdvancedMarker>
              ))}

              {infoWindowOpen && (
                <InfoWindow anchor={marker} onCloseClick={() => setInfoWindowOpen(false)}>
                  <div className="p-2 text-slate-900 space-y-1.5 max-w-xs font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <h4 className="font-bold text-xs text-emerald-900">{MASJID_INFO.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">{MASJID_INFO.address}</p>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span>Buka 24 Jam Jamaah</span>
                      <a
                        href={googleMapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                      >
                        Lihat Ulasan <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full relative">
            {/* Embedded Responsive Interactive Google Map as fallback */}
            <iframe
              title="Peta Lokasi Masjid Jami Nurul Iman Pejaten"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.882489812!2d106.845841314769!3d-6.275812000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f2e307ffffff%3A0x88981881881881!2sPejaten%20Timur%2C%20Pasar%20Minggu%2C%20South%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[10%] contrast-[105%]"
            />

            {/* API Key Setup Banner Overlay */}
            <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Peta Interaktif Siap Digunakan</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Untuk mengaktifkan fitur pencarian rute real-time dan Places SDK Google Maps kustom, isi <code>VITE_GOOGLE_MAPS_KEY</code> di file <code>.env</code>.
              </p>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl font-mono text-[10px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Env: GOOGLE_MAPS_PLATFORM_KEY</span>
                <Key className="w-3.5 h-3.5 text-amber-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Cards */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded-xl shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Operasional Ibadah</div>
            <p className="text-[11px] text-slate-500">Buka 24 Jam untuk Sholat & I'tikaf Jamaah</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-700 rounded-xl shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Kontak Layanan</div>
            <p className="text-[11px] text-slate-500 font-mono">{MASJID_INFO.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="p-2.5 bg-sky-100 dark:bg-sky-950 text-sky-700 rounded-xl shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Akses Transportasi</div>
            <p className="text-[11px] text-slate-500">5 menit dari Stasiun KRL Pasar Minggu</p>
          </div>
        </div>
      </div>
    </div>
  );
};
