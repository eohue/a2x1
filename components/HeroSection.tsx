"use client";

import React, { useEffect, useRef } from 'react';
import { useHeroStore } from '@/stores/useHeroStore';

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = React.useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
      else setValue(target);
    }
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);
  return value;
}

export function HeroSection() {
  const { indicators, loading, error, setIndicators, setLoading, setError } = useHeroStore();

  useEffect(() => {
    let ignore = false;
    async function fetchIndicators() {
      setLoading(true);
      setError(null);
      try {
        // 실제 서비스에서는 /api/v1/hero-indicators 등에서 fetch
        // 여기서는 mock
        await new Promise((r) => setTimeout(r, 400));
        const data = {
          monthlyUV: 100000,
          avgApprovalHours: 24,
          weeklyPosts: 100,
        };
        if (!ignore) setIndicators(data);
      } catch (e: any) {
        if (!ignore) setError('지표 데이터를 불러오지 못했습니다.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchIndicators();
    return () => { ignore = true; };
  }, [setIndicators, setLoading, setError]);

  const uv = useCountUp(indicators.monthlyUV);
  const approval = useCountUp(indicators.avgApprovalHours);
  const posts = useCountUp(indicators.weeklyPosts);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('application');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.focus({ preventScroll: true });
    }
  };

  return (
    <section
      className="relative w-full bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20 lg:py-32 overflow-hidden"
      aria-label="아이부키 비전 및 임팩트 지표"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.6),rgba(255,255,255,0))] sm:bg-grid-slate-100/25"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            <span className="block">더 나은 사회주택,</span>
            <span className="block text-primary-600">더 나은 커뮤니티</span>
          </h1>
          
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-8">
            비전·프로젝트·커뮤니티·운영을 하나로 묶은 통합 플랫폼으로
            <br className="hidden sm:block" />
            입주민의 자발적 소통과 성장, 사회적 임팩트를 실현합니다
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#application"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              입주 신청하기
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              프로젝트 둘러보기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 