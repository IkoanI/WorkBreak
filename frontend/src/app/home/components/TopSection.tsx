import Link from "next/link";
import Image from "next/image";

export default function TopSection() {
  return (
    <section className = "top-section">
      <div className = "top-container">
        <div className = "top-logo">
          <Image
            src = "/next/Images/WorkBreakLogo.png"
            alt = "WorkBreak Logo"
            width = {120}
            height = {120}
            className = "logo-img"
          />
        </div>
          <h1 className = "top-title"> Discover the Best Spots for Your Break </h1>
          <p className = "top-description">
            WorkBreak helps you find top-rated, nearby restaurants based on your cravings, budget,
            and time — all during your workday breaks.
          </p>
        <div className = "top-buttons">
          <Link href = "/about" className = "btn-outline">
            Learn More
          </Link>
          <Link href = "/restaurants/discover" className = "btn-primary">
            Find a Spot
          </Link>
        </div>
      </div>
    </section>
  );
}
