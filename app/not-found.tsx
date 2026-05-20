import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <div className="container">
        <h1>찾으시는 페이지가 사라졌네요.</h1>
        <p className="lead">URL을 다시 확인하시거나 아래 링크로 이동해주세요.</p>
        <div className="button-row">
          <Link className="button button-primary" href="/">홈</Link>
          <Link className="button button-secondary" href="/tools/diagnosis">자가 진단</Link>
          <Link className="button button-secondary" href="/tools/simulator">시뮬레이터</Link>
        </div>
      </div>
    </section>
  );
}
