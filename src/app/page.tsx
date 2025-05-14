"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Hammer, 
  ChevronRight, 
  CheckCircle, 
  GraduationCap, 
  Award, 
  Briefcase,
  ArrowRight,
  ClipboardCheck
} from "lucide-react";

// Feature card component with animations
function FeatureCard({ feature, index }) {
  const ref = React.useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center text-center p-8 rounded-xl bg-zinc-800 text-white border border-zinc-700 shadow-sm transition-all relative overflow-hidden"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.5)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Sheen effect overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 pointer-events-none"
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ 
          opacity: isHovered ? [0, 0.3, 0] : 0,
          x: isHovered ? ['-100%', '200%', '200%'] : '-100%'
        }}
        transition={{ 
          duration: isHovered ? 1.2 : 0, 
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
      />
      
      <motion.div 
        className="w-16 h-16 rounded-full bg-primary/20 text-white flex items-center justify-center mb-6 relative"
        animate={{ 
          backgroundColor: isHovered ? "var(--primary)" : "rgba(var(--primary-rgb), 0.2)",
          color: isHovered ? "var(--primary-foreground)" : "white"
        }}
      >
        {feature.icon}
        
        {/* Animated ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{ 
            scale: isHovered ? [1, 1.2, 1.1] : 1,
            opacity: isHovered ? [1, 0.7, 0] : 1 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: isHovered ? Infinity : 0,
          }}
        />
      </motion.div>
      <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
      <p className="text-zinc-300 text-lg">{feature.description}</p>
    </motion.div>
  );
}

const features = [
  {
    icon: <GraduationCap size={32} />,
    title: "Learn As You Go",
    description: "Practice with hundreds of professional Red Seal Carpenter questions and detailed explanations."
  },
  {
    icon: <CheckCircle size={32} />,
    title: "Track Progress",
    description: "Monitor your knowledge growth with real-time performance tracking and improvement suggestions."
  },
  {
    icon: <Award size={32} />,
    title: "Certification Ready",
    description: "Expertly designed to prepare you for passing your Red Seal examination with confidence."
  },
  {
    icon: <Briefcase size={32} />,
    title: "Industry Standard",
    description: "Content aligned with the latest Canadian building codes, techniques, and certification requirements."
  }
];

// Modern illustration component
function BlueprintIllustration() {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-10 dark:opacity-15"></div>
      
      {/* House blueprint outline */}
      <motion.div
        className="relative w-4/5 max-w-[420px] aspect-square"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* House outline */}
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full stroke-primary"
          style={{ strokeWidth: 2, fill: 'none' }}
        >
          {/* Foundation */}
          <motion.rect 
            x="50" y="300" width="300" height="20"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="fill-primary/10"
          />
          
          {/* Left wall */}
          <motion.line 
            x1="50" y1="300" x2="50" y2="150"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          
          {/* Right wall */}
          <motion.line 
            x1="350" y1="300" x2="350" y2="150"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          
          {/* Roof left */}
          <motion.line 
            x1="50" y1="150" x2="200" y2="80"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          
          {/* Roof right */}
          <motion.line 
            x1="350" y1="150" x2="200" y2="80"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          
          {/* Door */}
          <motion.rect 
            x="150" y="220" width="50" height="80"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          />
          
          {/* Window left */}
          <motion.rect 
            x="80" y="200" width="40" height="40"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          />
          
          {/* Window right */}
          <motion.rect 
            x="280" y="200" width="40" height="40"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          />
          
          {/* Dimensions arrows */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <line x1="30" y1="150" x2="30" y2="300" className="stroke-blue-500" />
            <line x1="25" y1="150" x2="35" y2="150" className="stroke-blue-500" />
            <line x1="25" y1="300" x2="35" y2="300" className="stroke-blue-500" />
            <text x="15" y="225" className="text-xs fill-blue-500">150cm</text>
            
            <line x1="50" y1="320" x2="350" y2="320" className="stroke-blue-500" />
            <line x1="50" y1="315" x2="50" y2="325" className="stroke-blue-500" />
            <line x1="350" y1="315" x2="350" y2="325" className="stroke-blue-500" />
            <text x="190" y="335" className="text-xs fill-blue-500">300cm</text>
          </motion.g>
        </svg>
        
        {/* Animated measurement points */}
        <div className="absolute inset-0">
          {[
            { x: 50, y: 150 },
            { x: 350, y: 150 },
            { x: 200, y: 80 },
            { x: 50, y: 300 },
            { x: 350, y: 300 }
          ].map((point, i) => (
            <motion.div 
              key={i}
              className="absolute w-3 h-3 rounded-full bg-primary"
              style={{ 
                left: `${point.x / 4}%`, 
                top: `${point.y / 4}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 1],
                opacity: [0, 1, 0.8]
              }}
              transition={{ 
                duration: 0.8, 
                delay: 1.4 + (i * 0.1),
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-20 pb-16 md:py-24 gap-12">
        {/* Left Content */}
        <motion.div 
          className="w-full md:w-1/2 space-y-8 z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-white border border-primary/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: "rgba(var(--primary-rgb), 0.15)",
              boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.3)"
            }}
          >
            <Hammer size={18} />
            <span className="text-sm font-medium tracking-wide">RED SEAL CARPENTER PREP</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.span 
                className="font-serif block bg-clip-text text-white"
                whileHover={{ scale: 1.02 }}
              >
                Nail It
              </motion.span>
              <motion.span 
                className="text-2xl md:text-3xl mt-4 block font-normal text-zinc-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Master your carpenter certification
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-zinc-400 max-w-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Interactive practice questions and detailed explanations to help you succeed on your Red Seal exam.
            </motion.p>
          </div>
          
          <div className="flex mt-8 gap-4">
            <Link href="/practice">
              <Button size="lg" className="gap-2">
                <ArrowRight className="h-5 w-5" />
                Start Practice
              </Button>
            </Link>
            <Link href="/exam">
              <Button size="lg" variant="outline" className="gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Exam Simulation
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Right Content - Blueprint Illustration */}
        <motion.div 
          className="w-full md:w-1/2 h-[350px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 z-10 shadow-xl"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          whileHover={{ 
            boxShadow: "0 20px 40px -20px rgba(var(--primary-rgb), 0.3)",
            borderColor: "rgba(var(--primary-rgb), 0.3)"
          }}
        >
          <BlueprintIllustration />
        </motion.div>
        
        {/* Background elements */}
        <div className="absolute -z-10 inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl opacity-20" />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-6 bg-zinc-950">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Why Nail It Works</h2>
            <p className="text-xl text-zinc-400">Our comprehensive approach helps carpenters achieve certification faster.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-20" />
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Ready to ace your Red Seal exam?
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-zinc-200 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Join thousands of carpenters who have prepared efficiently and passed their certification exams.
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="gap-2 text-lg px-10 py-7 h-auto rounded-full font-bold bg-white text-primary hover:bg-zinc-100"
            >
              <Link href="/practice">
                Begin Practice Now
                <ArrowRight size={20} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
      </section>
      
      <footer className="border-t border-zinc-800 py-12 px-6 bg-zinc-900">
        <motion.div 
          className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center md:items-start">
            <motion.h3 
              className="text-2xl font-serif font-bold text-white mb-2"
              whileHover={{ scale: 1.05 }}
            >
              Nail It
            </motion.h3>
            <p className="text-zinc-400">© 2024 Nail It. All rights reserved.</p>
          </div>
          
          <p className="text-zinc-400 text-center md:text-right">
            Designed for Canadian Red Seal Carpenter certification preparation.
            <br />
            Built with precision and care.
          </p>
        </motion.div>
      </footer>

      {/* CSS Variables */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --primary-rgb: 239, 68, 68;
            --primary-dark: #c32030;
          }
          
          .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
          }

          .bg-blueprint-grid {
            background-size: 20px 20px;
            background-image:
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          }
        `
      }} />
    </div>
  );
}
