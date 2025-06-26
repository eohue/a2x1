import React from 'react';

interface ApplicationStatusProps {
  status: string;
  reason?: string;
}

export function ApplicationStatus({ status, reason }: ApplicationStatusProps) {
  return (
    <section className="mt-8 p-4 border rounded bg-gray-50">
      <h2 className="font-semibold mb-2">신청 처리 현황</h2>
      <p>
        현재 상태: <b>{status === 'approved' ? '승인됨' : status === 'rejected' ? '거절됨' : '대기 중'}</b>
      </p>
      {reason && <p className="text-sm text-gray-600">사유: {reason}</p>}
    </section>
  );
} 