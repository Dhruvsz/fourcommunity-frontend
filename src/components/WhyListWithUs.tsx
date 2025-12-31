
import { Check } from "lucide-react";

const benefits = [
  {
    title: "Reach more relevant members",
    description: "Connect with people who are actively searching for communities like yours."
  },
  {
    title: "Only curated groups get featured",
    description: "We maintain high quality standards so members trust all listed groups."
  },
  {
    title: "Get verified badge & visibility",
    description: "Stand out with verification and priority placement in search results."
  },
  {
    title: "Grow organically",
    description: "Get discovered by the right people without paid advertising."
  }
];

const WhyListWithUs = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4">Why List Your Group With Us?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join hundreds of thriving communities that found their ideal members through our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="bg-primary rounded-full p-1 mt-1 shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyListWithUs;
