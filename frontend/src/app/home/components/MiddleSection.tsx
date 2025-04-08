import { Clock, Coffee, Battery } from "lucide-react";

export default function MiddleSection() {
  const features = [
    {
      icon: <Clock size = {32} />,
      title: "Smart Break Planning",
      desc: "Use filters for time, cravings, and budget to discover great places without wasting a second.",
    },
    {
      icon: <Coffee size = {32} />,
      title: "Curated Food Experiences",
      desc: "Explore hidden gems and local favorites — whether it’s a power lunch or a casual coffee spot.",
    },
    {
      icon: <Battery size = {32} />,
      title: "Stay Fresh, Stay Informed",
      desc: "Access real reviews from WorkBreak users and TripAdvisor to make confident dining choices.",
    },
  ];

  return (
    <section className = "middle-section">
      <div className = "middle-container">
        <h2 className = "middle-title">Why Take Breaks? </h2>
        <div className = "middle-grid">
          {features.map(({ icon, title, desc }) => (
            <div className = "middle-card" key={title}>
              <div className = "middle-icon">{icon} </div>
              <h3 className = "middle-heading">{title} </h3>
              <p className = "middle-text">{desc} </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}