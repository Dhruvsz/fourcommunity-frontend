
import { CheckCircle2, Shield, Users } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Users />,
      title: "Submit Your Group",
      description: "Tell us about your community."
    },
    {
      icon: <Shield />,
      title: "Get Reviewed & Verified",
      description: "We check for relevance and quality."
    },
    {
      icon: <CheckCircle2 />,
      title: "Reach the Right Members",
      description: "We help you grow with visibility."
    }
  ];

  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="container">
        <h2 className="text-center mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 rounded-full bg-primary/10 text-primary">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
