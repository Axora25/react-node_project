export default function TestimonialCard({ item }) {
  return (
    <div className="flex justify-center">
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-300 shadow-md px-8 py-10 text-center relative"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)",
        }}
      >
        {/* Quote Icon */}
        <div className="text-5xl text-gray-500 mb-4">“</div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          Testimonial
        </h3>

        {/* Feedback */}
        <p className="text-gray-600 leading-relaxed mb-6">
          {item.generalFeedback}
        </p>

        {/* Stars */}
        <div className="flex justify-center text-gray-700 text-lg mb-4">
          ★ ★ ★ ★ ★
        </div>

        {/* Name */}
        <p className="font-semibold text-gray-900">
          {item.fullName}
        </p>
      </div>
    </div>
  );
}
