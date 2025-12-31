
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from 'framer-motion';

const HomeFAQ = () => {
  const faqs = [
    {
      question: "What kind of groups can I join?",
      answer: "Everything from tech and startups to hobby and city-based communities."
    },
    {
      question: "How do I know if a group is real?",
      answer: "We verify group links and flag suspicious content."
    },
    {
      question: "Can I join multiple communities?",
      answer: "Absolutely. Join as many as match your interests!"
    },
    {
      question: "Is this free to use?",
      answer: "100% free — no hidden costs."
    }
  ];

  return (
    <section className="py-24 bg-gray-900/50" id="faq">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-3xl font-bold mb-12">Questions? We Got You.</h2>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/40">
                <AccordionTrigger className="text-lg font-medium py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFAQ;
