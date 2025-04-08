import Link from "next/link";

export default function LowerSection() {
  return (
    <section className = "lower-section">
      <div className = "lower-container">
        <h2 className = "lower-title"> Turn Your Break Into the Best Part of Your Day </h2>
        <p className = "lower-subtitle">
          Join thousands of professionals using WorkBreak to recharge with delicious, nearby food
          options — fast, filtered, and on-point.
        </p>
        <Link href = "/accounts/signup" className = "btn-primary-lg">
          Try WorkBreak Now
        </Link>
      </div>
    </section>
  );
}
