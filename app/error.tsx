"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="hero">
      <div className="container">
        <h1>잠시 후 다시 시도해주세요.</h1>
        <p className="lead">문제가 계속되면 카카오톡 또는 상담 폼으로 알려주세요.</p>
        <div className="button-row">
          <button className="button button-primary" type="button" onClick={() => reset()}>새로고침</button>
          <Link className="button button-secondary" href="/contact">상담 폼</Link>
        </div>
      </div>
    </section>
  );
}
