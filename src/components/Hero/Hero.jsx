
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Image from 'next/image';

export function Hero() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/signup")
  }
  return (
    <section className="bg-gradient-to-r from-[#1a1a1a] to-[#3b0112] py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">
            AI <span className="text-[#f02e65]">JobTracker</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Smart job management powered by AI. Track applications, predict responses, 
            and optimize your profile automatically.
          </p>
          <div className="flex gap-4">
            <Button
             onClick = {() => handleClick()}
             className="bg-[#f02e65] cursor-pointer hover:bg-[#d82555] text-white px-8 py-6 text-lg">
              Get Started
            </Button>
          </div>
        </div>
        <div className="relative">
          <Image 
            src="/dashboard-preview.svg" 
            alt="Dashboard Preview"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl border border-white/10"
          />
          <div className="absolute inset-0 bg-[#f02e65]/10 rounded-lg" />
        </div>
      </div>
    </section>
  );
}