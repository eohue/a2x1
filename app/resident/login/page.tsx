"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ResidentLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const auth = useAuthStore();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      if (!form.email) {
        emailRef.current?.focus();
      } else if (!form.password) {
        passwordRef.current?.focus();
      } else if (errorRef.current) {
        errorRef.current.focus();
      }
    }
  }, [error]);
  useEffect(() => {
    if (success && successRef.current) {
      successRef.current.focus();
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api-gateway/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || '로그인에 실패했습니다.');
        setLoading(false);
        return;
      }
      if (data.token) {
        auth.setToken(data.token);
        // 사용자 정보가 응답에 있다면 setUser(data.user) 등 추가 가능
      }
      setSuccess(true);
    } catch (err: any) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">입주민 로그인</h1>
        <form onSubmit={handleSubmit} aria-label="입주민 로그인 폼" className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              이메일 <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              ref={emailRef}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              비밀번호 <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              ref={passwordRef}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm" role="alert" id="login-error" tabIndex={-1} ref={errorRef}>{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm" role="status" tabIndex={-1} ref={successRef}>로그인 성공! 리다이렉트 또는 대시보드 이동 처리 필요</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className="mt-6 text-sm text-gray-600 text-center" aria-live="polite">
          <p>최초 가입 시 관리자의 승인이 필요합니다.</p>
        </div>
        <div className="mt-4 text-center">
          <a href="/resident/register" className="text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-400">
            계정이 없으신가요? 회원가입
          </a>
        </div>
      </section>
    </main>
  );
}

