import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async register(email: string, password: string) {
    // TODO: 실제 회원가입 로직 (DB 저장, 승인 대기 등)
    return { message: '회원가입 신청이 완료되었습니다. 관리자의 승인을 기다려 주세요.' };
  }

  async login(email: string, password: string) {
    // TODO: 실제 로그인 로직 (DB 조회, 승인 상태 체크, JWT 발급 등)
    return { message: '로그인 성공(실제 토큰 발급 로직 필요)' };
  }
} 