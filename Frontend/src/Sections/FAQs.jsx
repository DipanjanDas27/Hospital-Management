import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { 
    q: "What are the hospital's visiting hours?", 
    a: "Visiting hours are from 9:00 AM to 7:00 PM every day. For ICU patients, special visiting hours apply from 11:00 AM to 12:00 PM and 4:00 PM to 5:00 PM. Please check with the nursing station for specific ward timings." 
  },
  { 
    q: "How can I make an appointment?", 
    a: "You can book appointments through multiple channels: online via our website, through our mobile app, by calling our 24/7 helpline at (123) 436-7880, or by visiting our reception desk in person. Online booking is available for all departments and specialists." 
  },
  { 
    q: "What insurance do you accept?", 
    a: "We accept all major health insurance providers in India including Star Health, HDFC Ergo, ICICI Lombard, Care Health Insurance, and government schemes like Ayushman Bharat. Please contact our insurance desk for specific plan verification." 
  },
  { 
    q: "Do you have emergency services?", 
    a: "Yes, our fully-equipped emergency department operates 24/7 with trained emergency physicians, nurses, and support staff. We handle all types of medical emergencies with immediate care and advanced life support systems." 
  },
  { 
    q: "What documents do I need for admission?", 
    a: "For admission, please bring a valid photo ID (Aadhaar/PAN/Driving License), insurance card (if applicable), previous medical records, referral letter from your doctor, and any relevant test reports. Our admission desk will guide you through the process." 
  },
  { 
    q: "Do you offer online consultation services?", 
    a: "Yes, we provide teleconsultation services for non-emergency cases. You can book video consultations with our doctors through our website or mobile app. This service is available for follow-ups, prescription renewals, and general health queries." 
  },
];

export default function FAQs() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQ
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services, facilities, and procedures. 
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-xl px-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" className="gap-2">
                <Phone className="w-4 h-4" />
                Call Us Now
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="w-4 h-4" />
                Email Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

