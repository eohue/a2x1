import React from 'react';
import styles from '../../app/page.module.css';

export function ApplicationContact() {
  return (
    <section className={styles['form-section']} aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="text-lg font-semibold mb-2">1:1 문의</h2>
      <a
        href="mailto:info@ibookee.com"
        className="text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        info@ibookee.com 으로 문의하기
      </a>
    </section>
  );
} 