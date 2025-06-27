"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ResidentRegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuthStore();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      if (!form.email) {
        emailRef.current?.focus();
      } else if (!form.password) {
        passwordRef.current?.focus();
      } else if (!form.confirm) {
        confirmRef.current?.focus();
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
    setSuccess(false);
    setError(null);
    if (!form.email || !form.password || !form.confirm) {
      setError('모든 필수 항목을 입력해 주세요.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api-gateway/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || '회원가입에 실패했습니다.');
        setLoading(false);
        return;
      }
      // TODO: 회원가입 후 인증 상태 전역 관리(zustand store)와 연동(필요시)
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
        <h1 className="text-2xl font-bold mb-6 text-center">입주민 회원가입</h1>
        <form onSubmit={handleSubmit} aria-label="입주민 회원가입 폼" className="space-y-5" noValidate>
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
              aria-describedby={error ? 'register-error' : undefined}
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
              autoComplete="new-password"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? 'register-error' : undefined}
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              ref={passwordRef}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium mb-1">
              비밀번호 확인 <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
              aria-invalid={!!error}
              aria-describedby={error ? 'register-error' : undefined}
              value={form.confirm}
              onChange={handleChange}
              disabled={loading}
              ref={confirmRef}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm" role="alert" id="register-error" tabIndex={-1} ref={errorRef}>{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm" role="status" tabIndex={-1} ref={successRef}>회원가입 신청이 완료되었습니다. 관리자의 승인을 기다려 주세요.</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <div className="mt-6 text-sm text-gray-600 text-center" aria-live="polite">
          <p>회원가입 후 관리자의 승인이 필요합니다.</p>
        </div>
        <div className="mt-4 text-center">
          <a href="/resident/login" className="text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-400">
            이미 계정이 있으신가요? 로그인
          </a>
        </div>
      </section>
    </main>
  );
}

