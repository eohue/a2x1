'use client';

import React, { useEffect, useRef } from 'react';
import { useHeroStore } from '@/stores/useHeroStore';

// Custom hook for count up animation
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

const metrics = [
  {
    id: 'uv',
    name: '월 방문자 수',
    description: '사이트 월 순 방문자',
    suffix: '+',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
    iconColor: 'text-primary-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 'approval',
    name: '평균 승인 시간',
    description: '신규 입주 승인',
    suffix: '시간',
    color: 'text-success-600',
    bgColor: 'bg-success-50',
    iconColor: 'text-success-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'posts',
    name: '주간 게시물',
    description: '커뮤니티 활성도',
    suffix: '건',
    color: 'text-warning-600',
    bgColor: 'bg-warning-50',
    iconColor: 'text-warning-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  {
    id: 'residents',
    name: '총 입주민',
    description: '현재 거주 중',
    suffix: '명',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  }
];

export function ImpactMetrics() {
  const { indicators, loading, error } = useHeroStore();
  
  const uvCount = useCountUp(indicators.monthlyUV);
  const approvalCount = useCountUp(indicators.avgApprovalHours);
  const postsCount = useCountUp(indicators.weeklyPosts);
  const residentsCount = useCountUp(250); // Mock data for residents

  const getMetricValue = (metricId: string) => {
    switch (metricId) {
      case 'uv': return uvCount;
      case 'approval': return approvalCount;
      case 'posts': return postsCount;
      case 'residents': return residentsCount;
      default: return 0;
    }
  };

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 text-lg">{error}</div>
        <p className="text-gray-500 mt-2">임팩트 지표를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          우리의 임팩트
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          아이부키가 만들어가고 있는 변화를 숫자로 확인해보세요.
          지속적인 성장과 커뮤니티 활성화를 통해 더 나은 사회주택 문화를 만들어갑니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`${metric.bgColor} rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 ${metric.bgColor} rounded-lg mb-4 ${metric.iconColor}`}>
              {metric.icon}
            </div>
            
            <div className={`text-3xl font-bold ${metric.color} mb-2`}>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 mx-auto rounded"></div>
              ) : (
                <>
                  {getMetricValue(metric.id).toLocaleString()}
                  {metric.suffix}
                </>
              )}
            </div>
            
            <div className="text-sm font-semibold text-gray-700 mb-1">
              {metric.name}
            </div>
            
            <div className="text-xs text-gray-500">
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      {/* Additional impact information */}
      <div className="mt-16 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          지속 가능한 주거 문화 조성
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div>
            <div className="text-primary-600 font-bold text-lg mb-2">ESG 가치 실현</div>
            <p className="text-gray-600 text-sm">
              환경, 사회, 거버넌스 가치를 바탕으로 한 지속가능한 사회주택 운영
            </p>
          </div>
          <div>
            <div className="text-primary-600 font-bold text-lg mb-2">커뮤니티 자치</div>
            <p className="text-gray-600 text-sm">
              입주민 주도의 자발적 소통과 자치 활동으로 건강한 공동체 형성
            </p>
          </div>
          <div>
            <div className="text-primary-600 font-bold text-lg mb-2">주거 안정성</div>
            <p className="text-gray-600 text-sm">
              합리적 임대료와 안정적 거주 환경으로 주거 부담 완화
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
