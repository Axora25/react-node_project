import { useState } from "react";

export default function Feedback() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    generalFeedback: "",
    suggestions: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/feedback/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    alert("Feedback submitted successfully");
    setFormData({
      fullName: "",
      email: "",
      generalFeedback: "",
      suggestions: "",
    });
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      generalFeedback: "",
      suggestions: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-green-700 mb-2">
        🌾 Crop Advisory Feedback
      </h2>
      <p className="text-gray-600 mb-6">
        Help us improve our services by sharing your experience
      </p>

      <form onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 w-full"
          />
        </div>

        <label className="font-medium">General Feedback *</label>
        <textarea
          name="generalFeedback"
          placeholder="Share your experience, suggestions, or concerns..."
          value={formData.generalFeedback}
          onChange={handleChange}
          required
          className="border rounded-lg p-3 w-full mb-4"
          rows="4"
        />

        <label className="font-medium">Suggestions for Improvement</label>
        <textarea
          name="suggestions"
          placeholder="What can we do to serve you better?"
          value={formData.suggestions}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full mb-6"
          rows="3"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="border border-gray-400 px-6 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
