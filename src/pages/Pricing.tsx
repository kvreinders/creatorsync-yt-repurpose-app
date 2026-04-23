import React from 'react';
import { motion } from 'framer-motion';
import { Check, Bolt, Users } from 'lucide-react';
import { GlassCard, CyberButton } from '../components/ui/CyberBase';

const PricingTier: React.FC<{
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  icon: React.ReactNode;
}> = ({ title, price, description, features, cta, recommended, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className={recommended ? 'relative scale-105 z-10' : 'relative'}
  >
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary-dim px-4 py-1 rounded-full shadow-lg z-20">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-background">Recommended</span>
      </div>
    )}
    <GlassCard className={recommended ? 'border-primary/50 bg-surface-high/60 shadow-[0_0_50px_rgba(139,92,246,0.15)]' : 'bg-surface/40'}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className={recommended ? 'text-primary font-black text-2xl' : 'text-on-surface font-bold text-xl'}>{title}</h3>
          <p className="text-on-surface-variant text-xs mt-1">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-on-surface">{price}</span>
          <span className="block text-[8px] uppercase tracking-widest text-on-surface-variant mt-1">Per Month</span>
        </div>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-xs text-on-surface-variant">
            <div className={recommended ? "text-primary" : "text-on-surface-variant/50"}>
              {icon}
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <CyberButton 
        variant={recommended ? 'primary' : 'outline'} 
        className="w-full py-4 text-xs tracking-tighter"
      >
        {cta}
      </CyberButton>
    </GlassCard>
  </motion.div>
);

export const PricingPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-10">
      <section className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-display font-black tracking-tight"
        >
          SCALE YOUR <span className="text-primary italic">VISION</span>
        </motion.h1>
        <p className="text-on-surface-variant text-sm max-w-[300px] mx-auto">
          Choose the fuel for your creative engine. Transparent pricing for every stage of growth.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center pt-8">
        <PricingTier 
          title="Hobby"
          price="$0"
          description="Perfect for beginners"
          cta="Start Free"
          icon={<Check size={16} />}
          features={[
            "3 Repurposed clips / mo",
            "Standard AI export (720p)",
            "1 Active project"
          ]}
        />

        <PricingTier 
          title="Creator"
          price="$29"
          description="Most popular choice"
          cta="Unlock Premium"
          recommended
          icon={<Bolt size={16} fill="currentColor" />}
          features={[
            "Unlimited clip generation",
            "4K Ultra-HD exports",
            "Priority AI processing",
            "Custom brand templates"
          ]}
        />

        <PricingTier 
          title="Agency"
          price="$99"
          description="For high-volume teams"
          cta="Contact Sales"
          icon={<Users size={16} />}
          features={[
            "Up to 10 Team members",
            "Advanced team analytics",
            "24/7 Dedicated support",
            "API access for workflows"
          ]}
        />
      </div>

      <section className="text-center">
         <p className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant/30 font-black">
           Trusted by 50,000+ creators
         </p>
      </section>
    </div>
  );
};
