import { render, screen } from '@testing-library/react';
import ResidentReportListPage from '../page';
import React from 'react';

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: () => ({ token: 'mock-token' }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('ResidentReportListPage', () => {
  it('renders page title and table headers', async () => {
    render(<ResidentReportListPage />);
    expect(await screen.findByText('내 민원 목록')).toBeInTheDocument();
    expect(screen.getByText('유형')).toBeInTheDocument();
    expect(screen.getByText('내용')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
    expect(screen.getByText('등록일')).toBeInTheDocument();
    expect(screen.getByText('상세')).toBeInTheDocument();
  });

  it('renders "민원 등록" button', async () => {
    render(<ResidentReportListPage />);
    expect(await screen.findByText('민원 등록')).toBeInTheDocument();
  });
}); 