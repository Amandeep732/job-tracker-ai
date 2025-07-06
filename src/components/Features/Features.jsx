import { Search, TrendingUp, Bot } from 'lucide-react';


const features = [
  {
    icon: <Search className="w-8 h-8 text-[#f02e65]" />,
    title: "Auto-Tracking",
    desc: "Automatically imports applications from 50+ job boards"
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-[#f02e65]" />,
    title: "Response Predictor",
    desc: "85% accurate AI-driven interview likelihood prediction"
  },
  {
    icon: <Bot className="w-8 h-8 text-[#f02e65]" />,
    title: "Profile Optimizer",
    desc: "Real-time suggestions to improve your resume"
  }
];

export function Features() {
  return (
    <section className="py-20 bg-[#0d0d0f]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          AI-Powered Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-[#1a1a1a] p-8 rounded-lg border border-white/10 hover:border-[#f02e65]/30 transition-all">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}