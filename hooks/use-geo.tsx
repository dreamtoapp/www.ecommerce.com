import { useEffect, useRef, useState } from 'react';

type GeolocationOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  accuracyThreshold?: number;
  maxRetries?: number;
};

type GeolocationResult = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  googleMapsLink: string | null;
  loading: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
};

const useAccurateGeolocation = (options: GeolocationOptions = {}): GeolocationResult => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // ✅ Make sure skeleton sees these right away
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>('جارٍ تحديد الموقع...');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const retryCountRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const bestCoordsRef = useRef<Omit<GeolocationResult, 'loading' | 'statusMessage' | 'errorMessage'>>({
    latitude: null,
    longitude: null,
    accuracy: null,
    googleMapsLink: null,
  });

  // Destructure and apply defaults for safe deps
  const {
    enableHighAccuracy = true,
    timeout = 30000,
    maximumAge = 0,
    accuracyThreshold = 10,
    maxRetries = 3,
  } = options;

  useEffect(() => {
    retryCountRef.current = 0;
    setLoading(true);
    setStatusMessage('جارٍ تحديد الموقع...');
    setErrorMessage(null);

    const clearTimer = () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };

    const updateBestCoords = (lat: number, lng: number, acc: number) => {
      const isBetter = bestCoordsRef.current.accuracy == null || acc < bestCoordsRef.current.accuracy!;
      if (isBetter) {
        bestCoordsRef.current = {
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          googleMapsLink: `https://www.google.com/maps?q=${lat},${lng}`,
        };
        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);
        setStatusMessage(`📍 تم تحديد الموقع بدقة ${acc.toFixed(1)} متر`);
      }

      if (acc <= accuracyThreshold) {
        setLoading(false);
        clearTimer();
      } else if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        setStatusMessage(`الدقة الحالية ${acc.toFixed(1)} متر، إعادة المحاولة...`);
        timeoutIdRef.current = setTimeout(tryGetLocation, 5000);
      } else {
        setStatusMessage(`أفضل دقة تم الوصول إليها: ${acc.toFixed(1)} متر`);
        setLoading(false);
        clearTimer();
      }
    };

    const tryGetLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
          updateBestCoords(lat, lng, acc);
        },
        (err) => {
          let msg = 'فشل تحديد الموقع';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              msg = 'يجب السماح بالوصول إلى الموقع';
              break;
            case err.POSITION_UNAVAILABLE:
              msg = 'معلومات الموقع غير متوفرة';
              break;
            case err.TIMEOUT:
              msg = 'انتهت المهلة، تأكد من تفعيل GPS';
              break;
          }
          setErrorMessage(msg);
          setStatusMessage(null);
          setLoading(false);
          clearTimer();
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    };

    tryGetLocation();
    return () => clearTimer();
  }, [enableHighAccuracy, timeout, maximumAge, accuracyThreshold, maxRetries]);

  return {
    latitude,
    longitude,
    accuracy,
    googleMapsLink:
      typeof latitude === 'number' && typeof longitude === 'number'
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : null,
    loading,
    statusMessage,
    errorMessage,
  };
};

export default useAccurateGeolocation;
