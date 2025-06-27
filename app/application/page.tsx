"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from '../page.module.css';
import { z } from 'zod';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ApplicationFAQ } from '@/components/application/ApplicationFAQ';
import { ApplicationContact } from '@/components/application/ApplicationContact';
import { ApplicationStatus } from '@/components/application/ApplicationStatus';
import { useTranslations } from 'next-intl';

// 하우스 목록 mock 데이터 (실제 API 연동 전 임시)
const houseOptions = [
  { id: 'house-1', name: '아이부키 서울숲점' },
  { id: 'house-2', name: '아이부키 합정점' },
  { id: 'house-3', name: '아이부키 신촌점' },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  house_id: string;
}

interface FormError {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  global?: string;
  house_id?: string;
}

// Zod 스키마 정의
const ApplicationSchema = z.object({
  name: z.string().min(1, '이름을 입력해 주세요.'),
  email: z.string().min(1, '이메일을 입력해 주세요.').email('유효한 이메일 형식이 아닙니다.'),
  phone: z
    .string()
    .min(1, '연락처를 입력해 주세요.')
    .regex(/^\d{2,4}-?\d{3,4}-?\d{4}$/, '유효한 연락처 형식이 아닙니다.'),
  message: z.string().optional(),
  house_id: z.string().min(1, '입주 희망 지점을 선택해 주세요.'),
});

export default function ApplicationFormPage() {
  const t = useTranslations();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
    house_id: '',
  });
  const [errors, setErrors] = useState<FormError>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<null | {
    status: string;
    reason?: string;
  }>(null);

  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    house_id: useRef<HTMLSelectElement>(null),
  };

  const validate = useCallback((values: FormState): FormError => {
    const result = ApplicationSchema.safeParse(values);
    if (result.success) return {};
    const errs: FormError = {};
    for (const issue of result.error.issues) {
      if (issue.path[0]) {
        errs[issue.path[0] as keyof FormError] = issue.message;
      }
    }
    return errs;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined, global: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_name: form.name,
          applicant_contact: form.phone,
          house_id: form.house_id,
          message: form.message,
        }),
      });
      if (!res.ok) {
        let data: any = {};
        try {
          data = await res.json();
        } catch {}
        if (data?.message && Array.isArray(data.message)) {
          setErrors({ global: data.message.join(' ') });
        } else if (typeof data?.message === 'string') {
          setErrors({ global: data.message });
        } else {
          setErrors({ global: '신청 처리 중 오류가 발생했습니다.' });
        }
        setLoading(false);
        return;
      }
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '', house_id: '' });
    } catch (err: any) {
      setErrors({ global: err?.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' });
    } finally {
      setLoading(false);
    }
  }, [form, validate]);

  // 신청 상태 조회 함수 (예시: 최근 신청 내역 fetch)
  async function fetchApplicationStatus() {
    try {
      const res = await fetch('/api/applications/me'); // 실제 구현 시 본인 신청 내역 반환 API 필요
      if (!res.ok) throw new Error('신청 상태를 불러올 수 없습니다.');
      const data = await res.json();
      setApplicationStatus({ status: data.status, reason: data.reason });
    } catch (err) {
      setApplicationStatus(null);
    }
  }

  // 신청 성공 시 상태 조회
  useEffect(() => {
    if (success) {
      fetchApplicationStatus();
    }
  }, [success]);

  // 에러 발생 시 첫 에러 필드로 포커스 이동
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const order: (keyof typeof inputRefs)[] = ['house_id', 'name', 'email', 'phone'];
      for (const key of order) {
        if (errors[key] && inputRefs[key].current) {
          inputRefs[key].current?.focus();
          break;
        }
      }
      if (errors.global && errorRef.current) {
        errorRef.current.focus();
      }
    }
  }, [errors]);

  // 성공 시 안내 메시지에 포커스 이동
  useEffect(() => {
    if (success && successRef.current) {
      successRef.current.focus();
    }
  }, [success]);

  // 렌더링 함수 분리
  const renderError = useCallback(() => errors.global && (
    <div
      className="text-red-600 text-sm"
      role="alert"
      tabIndex={-1}
      ref={errorRef}
      aria-live="polite"
    >
      {errors.global}
    </div>
  ), [errors.global]);

  const renderSuccess = useCallback(() => success && (
    <div
      className="text-green-600 text-sm"
      role="status"
      tabIndex={-1}
      ref={successRef}
      aria-live="polite"
    >
      신청이 정상적으로 접수되었습니다.
    </div>
  ), [success]);

  // 입력 필드별 에러 id 생성
  const errorIds = {
    name: errors.name ? 'application-error-name' : undefined,
    email: errors.email ? 'application-error-email' : undefined,
    phone: errors.phone ? 'application-error-phone' : undefined,
    house_id: errors.house_id ? 'application-error-house_id' : undefined,
  };

  return (
    <main className="max-w-xl mx-auto py-8 sm:py-12 px-2 sm:px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6">{t('application.title')}</h1>
      <form className="space-y-6" aria-label={t('application.formAriaLabel')} onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="house_id" className={styles['form-label']}>
            {t('application.house')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <select
            id="house_id"
            name="house_id"
            required
            className={styles['form-input'] + ' text-base md:text-lg'}
            aria-required="true"
            aria-invalid={!!errors.house_id}
            aria-describedby={errorIds.house_id}
            value={form.house_id}
            onChange={handleChange}
            disabled={loading}
            ref={inputRefs.house_id}
          >
            <option value="">{t('application.housePlaceholder')}</option>
            {houseOptions.map((house) => (
              <option key={house.id} value={house.id}>{house.name}</option>
            ))}
          </select>
          {errors.house_id && (
            <p id="application-error-house_id" className="text-red-500 text-xs mt-1" role="alert">{errors.house_id}</p>
          )}
        </div>
        <Input
          id="name"
          name="name"
          label={t('application.name')}
          required
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          disabled={loading}
          ref={inputRefs.name}
          aria-describedby={errorIds.name}
          className="text-base md:text-lg"
        />
        <Input
          id="email"
          name="email"
          label={t('application.email')}
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
          ref={inputRefs.email}
          aria-describedby={errorIds.email}
          className="text-base md:text-lg"
        />
        <Input
          id="phone"
          name="phone"
          label={t('application.phone')}
          type="tel"
          required
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          disabled={loading}
          ref={inputRefs.phone}
          aria-describedby={errorIds.phone}
          className="text-base md:text-lg"
        />
        <div>
          <label htmlFor="message" className={styles['form-label']}>
            {t('application.message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={styles['form-input'] + ' text-base md:text-lg'}
            aria-multiline="true"
            value={form.message}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {renderError()}
        {renderSuccess()}
        <Button type="submit" loading={loading} disabled={loading} className="w-full py-3 text-base md:text-lg">
          {loading ? t('common.submitting') : t('application.submit')}
        </Button>
      </form>
      <div className="px-2 sm:px-4">
        <ApplicationFAQ />
        <ApplicationContact />
        {applicationStatus && <div className="mt-4 text-base md:text-lg"><ApplicationStatus status={applicationStatus.status} reason={applicationStatus.reason} /></div>}
      </div>
    </main>
  );
}

