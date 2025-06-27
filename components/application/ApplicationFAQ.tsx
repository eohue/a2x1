import React from 'react';
import styles from '../../app/page.module.css';

export function ApplicationFAQ() {
  return (
    <section className={styles['form-section']} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-lg font-semibold mb-2">자주 묻는 질문</h2>
      <ul className={styles['faq-list']}>
        <li>신청 후 언제 연락을 받을 수 있나요?</li>
        <li>입주 조건은 어떻게 되나요?</li>
        <li>서류 제출은 어떻게 하나요?</li>
      </ul>
    </section>
  );
} 