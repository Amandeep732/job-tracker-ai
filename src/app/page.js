'use client';
import { Hero } from "@/components/Hero/Hero";
import Navbar from '@/components/Navbar/Navbar';
import { Features } from "@/components/Features/Features";
import { Workflow } from "@/components/WorkFlow/WorkFlow";
import { CTA } from "@/components/GetStartBtn/GetStart";
import { Testimonials } from "@/components/Testimonials/Testimonials";
import { Footer } from "@/components/Footer/Footer";
import { DummyDashboard } from "@/components/DummyDashboard/DummyDashboard";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <DummyDashboard />
      <Features />
      <Workflow />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
