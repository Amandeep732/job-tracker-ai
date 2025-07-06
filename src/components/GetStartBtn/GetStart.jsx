import { Button } from "../ui/button";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#f02e65] to-[#ff5e5e]">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Job Search?
        </h2>
        <Button 
          className="bg-white text-[#f02e65] hover:bg-gray-100 px-10 py-6 text-lg font-bold shadow-lg"
          size="lg"
        >
          Get Started Now
        </Button>
      </div>
    </section>
  );
}