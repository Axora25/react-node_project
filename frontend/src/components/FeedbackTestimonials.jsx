import { useEffect, useState } from "react";
import TestimonialCard from "./TestimonialCard";

export default function FeedbackTestimonials() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch(() => setFeedbacks([]));
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (feedbacks.length <= 3) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + 3 >= feedbacks.length ? 0 : prev + 3
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [feedbacks]);

  const visibleFeedbacks = feedbacks.slice(index, index + 3);

  return (
    <section className="w-full  py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleFeedbacks.map((item) => (
            <TestimonialCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
