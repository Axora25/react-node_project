import React, { useState } from "react";
import "./support.css";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/support/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Message Sent Successfully!");
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert(data.error || "Something went wrong");
      }

    } catch (err) {
      alert("Server Connection Failed!");
    }
  };

  return (
    <div className="support-container">
      <div className="support-grid">

        {/* LEFT SECTION */}
<div className="support-left">
  <h1 className="heading-green">We’re here to help 🌱</h1>

  <p className="text-normal">
    Facing an issue or feeling stuck? You’re not alone.  
    Our support team is always ready to listen, understand, and assist you.
  </p>

  <p className="text-normal">
    Whether it’s a technical problem, a question about features, or guidance
    you need — reach out to us anytime. We make sure every concern is treated
    with care and resolved as quickly as possible.
  </p>

  <h2 className="section-title">🤝 Our Promise</h2>
  <p className="text-normal">
    Once you contact us, our team reviews your request immediately and gets back
    to you with the best possible solution. Your trust matters to us.
  </p>

  <h2 className="section-title">📞 Contact Info</h2>
  <p>Email: <span className="link-green">support@agrigrow.com</span></p>
  <p>Instagram: <span className="link-green">@agrigrow</span></p>
  <p>LinkedIn: <span className="link-green">AgriGrow Official</span></p>

 
</div>

        {/* RIGHT SECTION (FORM) */}
        <div className="support-right">
          <h1 className="heading-green">Contact Support</h1>

          <form className="support-form" onSubmit={handleSubmit}>

            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="input-box"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="input-box"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                className="input-box"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="send-btn">
              Send Message
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
