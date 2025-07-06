export function Workflow() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0d0d0f] to-[#1a0418]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-16">
          How It Works
        </h2>
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-8 h-full w-0.5 bg-[#f02e65] top-4" />
          
          {[
            {
              title: "Upload Resume + Job Description",
              description: "Simply upload your resume and the job description you're targeting. Our system will parse and analyze both documents."
            },
            {
              title: "Get AI Optimization Tips",
              description: "Receive instant feedback on how to improve your resume for this specific role, including match score, missing keywords, and suggested improvements."
            },
            {
              title: "Smart Follow-up Tracking",
              description: "If you apply today, we'll automatically track responses and notify you via email when it's time to follow up - typically 7-10 days after application."
            }
          ].map((step, i) => (
            <div key={i} className="relative pl-16 mb-12 last:mb-0">
              <div className="absolute left-0 w-8 h-8 rounded-full bg-[#f02e65] flex items-center justify-center text-white font-bold">
                {i+1}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}