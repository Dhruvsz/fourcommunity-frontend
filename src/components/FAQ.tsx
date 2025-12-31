
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMouseGradient } from "@/hooks/use-mouse-gradient";

const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useMouseGradient(sectionRef, {
    intensity: 0.05,
    color: "rgba(59,130,246,0.08)",
    radius: 350,
  });
  
  const faqs = [
    {
      question: "Is it free to list a group?",
      answer: "Yes, listing your group on our platform is completely free. We believe in connecting great communities with the right members without any barriers."
    },
    {
      question: "Can I list non-WhatsApp groups?",
      answer: "Absolutely! We welcome communities from various platforms including Slack, Discord, Telegram, and more. Our goal is to help quality communities grow regardless of the platform they use."
    },
    {
      question: "How do I get verified?",
      answer: "Verified status is given to groups that meet our quality standards. Submit your group with accurate information, and our team will review it. Groups with consistent activity and valuable content are more likely to be verified."
    },
    {
      question: "Can people message me after seeing my group?",
      answer: "Yes, community owners can be contacted through the platform if they enable this option. You can control your privacy settings in your account dashboard."
    }
  ];

  return (
    <section className="py-24 bg-secondary/30" id="faq" ref={sectionRef}>
      <div className="container max-w-3xl">
        <h2 className="text-center mb-12 md:mb-16">Questions? We Got You.</h2>
        
        <Accordion type="single" collapsible className="w-full md:max-w-xl md:mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="border-b border-border/40 hover:bg-white/5 transition-colors duration-300"
            >
              <AccordionTrigger className="text-lg font-medium py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
