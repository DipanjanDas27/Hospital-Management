import { useState } from "react";

const faqs = [
  { q: "What are the hospital’s visiting hours?", a: "Visiting hours are from 9:00 AM to 7:00 PM every day." },
  { q: "How can I make an appointment?", a: "You can book online through our website or call our reception desk." },
  { q: "What insurance do you accept?", a: "We accept all major health insurance providers in India." },
  { q: "Do you have emergency services?", a: "Yes, our emergency department is open 24/7." },
];

export default function FAQs() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section id="faq" className="px-8 py-16 bg-gray-50">
      <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border rounded-xl bg-white shadow-sm">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex justify-between items-center p-4 font-medium"
            >
              {faq.q}
              <span>{openFaq === i ? "-" : "+"}</span>
            </button>
            {openFaq === i && <div className="p-4 text-gray-600">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
