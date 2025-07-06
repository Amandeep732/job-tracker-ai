import Image from "next/image";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      quote: "Landing my dream job became so much easier with this platform. The auto-tracking feature saved me hours of manual work."
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      quote: "The response predictor was scarily accurate. It helped me focus on applications that were most likely to get replies."
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      quote: "Within 2 weeks of using the profile optimizer, my interview requests tripled. Worth every penny!"
    }
  ];

  return (
    <section className="py-20 bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-16">
          Trusted by Job Seekers
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#0d0d0f] p-6 rounded-lg">
              <p className="text-gray-300 italic mb-4">"{t.quote}"</p>
              <div className="mt-4">
                <p className="text-white font-medium">{t.name}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-8 opacity-80">
          {['google', 'amazon', 'netflix'].map((company) => (
            <Image 
              key={company}
              src={`/logos/${company}.svg`}
              alt={`${company} logo`}
              width={60}
              height={40}
              className="red hover:grayscale-0 transition-all"
            />
          ))}
        </div>
      </div>
    </section>
  );
}