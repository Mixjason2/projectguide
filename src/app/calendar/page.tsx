'use client';

import AuthGuard from "@/app/component/AuthGuard";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CalendarView from './components/CalendarView';
import ErrorMessage from './components/ErrorMessage';
import { Job } from './components/types';
import './calendar.css';
import CssgGuide from '../cssguide';
import { DatesSetArg } from '@fullcalendar/core/index.js';
import Cookies from 'js-cookie';
import type { CalendarApi } from '@fullcalendar/core';

// ---------------------- Crypto helpers (browser Web Crypto) ----------------------
async function getCryptoKeyFromSecret(secret: string) {
  // Derive a 256-bit AES-GCM key from a passphrase by hashing (SHA-256)
  const enc = new TextEncoder();
  const secretBytes = enc.encode(secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
  return crypto.subtle.importKey('raw', hashBuffer, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function encryptObjectToBase64(obj: unknown): Promise<string> {
  const secret = process.env.NEXT_PUBLIC_CACHE_SECRET || '';
  if (!secret) {
    console.warn('[encrypt] NEXT_PUBLIC_CACHE_SECRET is empty — insecure fallback (not recommended in production)');
  }
  const key = await getCryptoKeyFromSecret(secret || 'fallback_secret_use_env');
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit iv for AES-GCM
  const enc = new TextEncoder();
  const data = enc.encode(JSON.stringify(obj));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  // store iv + ciphertext (both base64)
  const payload = {
    iv: arrayBufferToBase64(iv.buffer),
    ct: arrayBufferToBase64(ct),
  };
  return JSON.stringify(payload);
}

async function decryptObjectFromBase64(payloadStr: string): Promise<string | null> {
  try {
    const payload = JSON.parse(payloadStr);
    const secret = process.env.NEXT_PUBLIC_CACHE_SECRET || '';
    if (!secret) {
      console.warn('[decrypt] NEXT_PUBLIC_CACHE_SECRET is empty — insecure fallback (not recommended in production)');
    }
    const key = await getCryptoKeyFromSecret(secret || 'fallback_secret_use_env');
    const iv = new Uint8Array(base64ToArrayBuffer(payload.iv));
    const ct = base64ToArrayBuffer(payload.ct);
    const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    const dec = new TextDecoder();
    const json = dec.decode(plainBuffer);
    return JSON.parse(json);
  } catch (e) {
    console.warn('[decrypt] failed to decrypt or parse payload', e);
    return null;
  }
}

// encrypted sessionStorage helpers
async function setEncryptedSession(key: string, obj: unknown): Promise<void> {
  try {
    // ✅ ยกเว้น dashboardJobsData ไม่ต้องเข้ารหัส
    if (key === 'dashboardJobsData') {
      sessionStorage.setItem(key, JSON.stringify(obj));
      return;
    }

    const s = await encryptObjectToBase64(obj);
    sessionStorage.setItem(key, s);
  } catch (e) {
    console.warn('[setEncryptedSession] failed', e);
  }
}
async function getEncryptedSession(key: string) {
  try {
    // ✅ ยกเว้น dashboardJobsData ไม่ต้องถอดรหัส
    if (key === 'dashboardJobsData') {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }

    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return await decryptObjectFromBase64(raw);
  } catch (e) {
    console.warn('[getEncryptedSession] failed', e);
    return null;
  }
}
async function removeSessionKey(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch { }
}
// ---------------------------------------------------------------------------------

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentCenterDate, setCurrentCenterDate] = useState<Date | null>(null);

  const [, setFetchedRanges] = useState<{ start: string; end: string }[]>([]);
  const addFetchedRange = useCallback((start: string, end: string) => {
    setFetchedRanges(prev => [...prev, { start, end }]);
  }, []);

  const abortControllerRef = useRef<AbortController | null>(null);
  const calendarApiRef = useRef<CalendarApi | null>(null);

  // monthMapRef keeps per-month payload in memory (not the single growing array)
  const monthMapRef = useRef<Record<string, Job[]>>({});

  // use flag to indicate fetch in progress
  const isFetchingRef = useRef(false);

  // debounce timer ref
  const fetchTimeoutRef = useRef<number | null>(null);

  // rebuild jobs array from monthMapRef keeping only center ±1 months to avoid accumulation
  const rebuildJobs = useCallback((centerMonthKey: string | null) => {
    // if no center provided, use latest month in map
    const keys = Object.keys(monthMapRef.current).sort();
    if (keys.length === 0) {
      setJobs([]);
      return;
    }
    let center = centerMonthKey;
    if (!center) center = keys[keys.length - 1];

    const [cy, cm] = center.split('-').map(x => parseInt(x, 10));
    const keepSet = new Set<string>();
    // keep center, center-1, center+1
    for (let delta = -1; delta <= 1; delta++) {
      const d = new Date(cy, cm - 1, 1);
      d.setMonth(d.getMonth() + delta);
      keepSet.add(d.toISOString().slice(0, 7));
    }

    const combined: Job[] = [];
    Object.keys(monthMapRef.current).forEach(k => {
      if (keepSet.has(k)) {
        const arr = monthMapRef.current[k] || [];
        arr.forEach(j => {
          if (!combined.find(x => x.key === j.key)) combined.push(j);
        });
      }
    });
    setJobs(combined);
    if (process.env.NODE_ENV === 'development') {
      console.debug('[rebuildJobs] center', center, 'keep', Array.from(keepSet), 'combined length', combined.length);
    }
  }, []);

  // fetchJobs now stores per-month into monthMapRef and sessionStorage encrypted
  const fetchJobs = useCallback(async (start: string, end: string, isInitial = false) => {
    try {
      abortControllerRef.current?.abort();
    } catch { }

    const token = Cookies.get('token') || '';
    if (!token) {
      setError('Token not found. Please log in.');
      setLoadingInitial(false);
      setLoadingMore(false);
      setJobs([]);
      return;
    }

    if (isInitial) {
      setLoadingInitial(true);
      setJobs([]);
      setFetchedRanges([]);
      monthMapRef.current = {};
      try { await removeSessionKey('calendar_cachedMonths'); } catch { }
    } else {
      setLoadingMore(true);
    }

    setError(null);
    console.time('⏱️ fetchJobs');

    const controller = new AbortController();
    abortControllerRef.current = controller;
    isFetchingRef.current = true;

    const link7082 = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    try {
      const res = await fetch(`${link7082}/api/guide/job/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, startdate: start, enddate: end }),
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error(await res.text());
      }

      const data: Job[] = await res.json();
      console.log('Fetched jobs:', data);
      console.timeEnd('⏱️ fetchJobs');

      // determine monthKey (YYYY-MM)
      const monthKey = start.slice(0, 7);

      // save into memory map
      monthMapRef.current[monthKey] = data;

      // save each month payload encrypted into sessionStorage
      try {
        await setEncryptedSession(`calendar_month_${monthKey}`, data);
      } catch (e) {
        console.warn('[fetchJobs] failed to save month to session', e);
      }

      addFetchedRange(start, end);
      setError(null);

      // update cachedMonths list in sessionStorage (encrypted)
      try {
        let cachedMonths: string[] = (await getEncryptedSession('calendar_cachedMonths')) || [];
        if (!cachedMonths.includes(monthKey)) {
          cachedMonths = [...cachedMonths, monthKey];
          await setEncryptedSession('calendar_cachedMonths', cachedMonths);
        }
      } catch (e) {
        console.warn('[fetchJobs] failed to update cachedMonths', e);
      }

      // rebuild jobs keeping around this monthKey
      rebuildJobs(monthKey);

    } catch (err: unknown) {
      console.timeEnd('⏱️ fetchJobs');

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('🛑 Fetch aborted');
          return;
        }
        setError(err.message || 'Failed to fetch');
      } else {
        // กรณีไม่ใช่ Error object
        setError('Failed to fetch');
      }
    } finally {
      isFetchingRef.current = false;
      abortControllerRef.current = null;
      if (isInitial) setLoadingInitial(false);
      else setLoadingMore(false);
    }
  }, [addFetchedRange, rebuildJobs]);

  // on mount: try restore cachedMonths and months from sessionStorage (decrypt)
  useEffect(() => {
    (async () => {
      try {
        const cachedMonths: string[] = (await getEncryptedSession('calendar_cachedMonths')) || [];
        if (cachedMonths && cachedMonths.length > 0) {
          // restore each month's payload
          for (const mk of cachedMonths) {
            const payload = await getEncryptedSession(`calendar_month_${mk}`);
            if (payload && Array.isArray(payload)) {
              monthMapRef.current[mk] = payload;
            }
          }
          // pick the latest cached month as center
          rebuildJobs(cachedMonths[cachedMonths.length - 1]);
        } else {
          // if no cache, fetch current month only
          const start = formatISO(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
          const end = formatISO(addMonths(new Date(start), 1));
          await fetchJobs(start, end, true);
          // stash initial cachedMonths
          const monthKey = start.slice(0, 7);
          try { await setEncryptedSession('calendar_cachedMonths', [monthKey]); } catch { }
        }
      } catch {
        // fallback: load current month
        const start = formatISO(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        const end = formatISO(addMonths(new Date(start), 1));
        await fetchJobs(start, end, true);
        try { await setEncryptedSession('calendar_cachedMonths', [start.slice(0, 7)]); } catch { }
      }
    })();
  }, [fetchJobs, rebuildJobs]);

  // handleDatesSet — debounce + check cachedMonths in sessionStorage
  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    if (arg.view.type !== currentView) setCurrentView(arg.view.type);
    if (!currentCenterDate || arg.view.currentStart.getTime() !== currentCenterDate.getTime()) {
      setCurrentCenterDate(arg.view.currentStart);
    }

    const viewStart = formatISO(arg.start);
    const viewEnd = formatISO(arg.end);
    const monthKey = viewStart.slice(0, 7);

    (async () => {
      let cachedMonths: string[] = [];
      try {
        cachedMonths = (await getEncryptedSession('calendar_cachedMonths')) || [];
      } catch {
        cachedMonths = [];
      }

      if (cachedMonths.includes(monthKey)) {
        if (process.env.NODE_ENV === 'development') console.debug('[handleDatesSet] cache hit', monthKey);
        // ensure jobs rebuilt around this center (prune)
        rebuildJobs(monthKey);
        return;
      }

      if (fetchTimeoutRef.current) {
        window.clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }

      fetchTimeoutRef.current = window.setTimeout(() => {
        if (process.env.NODE_ENV === 'development') console.debug('[handleDatesSet] debounced fetch', monthKey, viewStart, viewEnd);
        // call fetchJobs (async) but don't await here
        fetchJobs(viewStart, viewEnd);
        fetchTimeoutRef.current = null;
      }, 300);
    })();
  }, [currentView, currentCenterDate, fetchJobs, rebuildJobs]);

  if (error && jobs.length === 0) return <ErrorMessage error={error} />;

  return (
    <AuthGuard>
      <CssgGuide>
        <div className="min-h-screen bg-white p-4">
          <div className="max-w-4xl mx-auto p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-4">Calendar</h1>
            <CalendarView
              jobs={jobs}
              gotoDate={currentCenterDate ? currentCenterDate.toISOString() : null}
              currentViewProp={currentView}
              onDatesSet={handleDatesSet}
              loading={loadingMore}
              calendarApiRef={calendarApiRef}
              onDashboardClick={(jobOrJobs) => { // store dashboard payload in sessionStorage encrypted (safer than cookie)
                (async () => {
                  try {
                    await setEncryptedSession('dashboardJobsData', jobOrJobs);
                    window.open('/calendar/dashboard', '_blank');
                  } catch (error) {
                    console.error('Failed to store dashboard data or open new tab:', error);
                  }
                })();
              }}
            />

            {loadingMore && (
              <div
                className="flex items-center justify-center bg-white bg-opacity-80 rounded-lg shadow-md p-4"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999,
                  pointerEvents: 'none',
                }}
              >
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-green-500" />
                <span className="ml-2 text-black-600 text-sm">Loading more data...</span>
              </div>
            )}

            {!loadingMore && error && <p className="text-red-600">{error}</p>}
          </div>
        </div>
      </CssgGuide>
    </AuthGuard>
  );
}