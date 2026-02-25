import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ── Security: Hash function (simple but effective for dummy auth) ──
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Pre-computed SHA-256 hashes of the dummy credentials
const VALID_EMAIL_HASH = '533bd071d0b949532bfb092048aade87a1486082fd67664a2e6628b3df588205'; // admin@porto.com
const VALID_PASS_HASH = '2958514eb652c5d9fb786a67e4e16c05958b6edb3e4ff85d104061632eec28ee'; // SuperSecretPassword2026!

const SESSION_TOKEN_KEY = '__as_tk';
const MAX_ATTEMPTS = 3;
const LOCK_DURATION_SEC = 30;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_TOKEN_KEY) === 'authenticated';
    } catch {
      return false;
    }
  });

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);
  const [lockRemaining, setLockRemaining] = useState(0);
  const timerRef = useRef(null);

  // ── Lockout countdown timer ──
  useEffect(() => {
    if (!lockUntil) {
      setLockRemaining(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));
      setLockRemaining(remaining);
      if (remaining <= 0) {
        setLockUntil(null);
        setFailedAttempts(0);
        clearInterval(timerRef.current);
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [lockUntil]);

  const isLocked = lockRemaining > 0;

  // ── Login ──
  const login = useCallback(async (email, password) => {
    if (isLocked) {
      return { success: false, message: `Account locked. Try again in ${lockRemaining}s.` };
    }

    const emailHash = await sha256(email.trim().toLowerCase());
    const passHash = await sha256(password);

    if (emailHash === VALID_EMAIL_HASH && passHash === VALID_PASS_HASH) {
      setIsAuthenticated(true);
      setFailedAttempts(0);
      setLockUntil(null);
      try {
        sessionStorage.setItem(SESSION_TOKEN_KEY, 'authenticated');
      } catch { /* private browsing */ }
      return { success: true };
    }

    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCK_DURATION_SEC * 1000;
      setLockUntil(until);
      return {
        success: false,
        message: `Too many failed attempts. Locked for ${LOCK_DURATION_SEC} seconds.`,
      };
    }

    return {
      success: false,
      message: `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`,
    };
  }, [failedAttempts, isLocked, lockRemaining]);

  // ── Logout ──
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    } catch { /* noop */ }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, isLocked, lockRemaining, failedAttempts }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
