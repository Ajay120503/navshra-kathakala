import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Shield, Sparkles } from "lucide-react";
const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <Link
      to="/"
      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 mb-6"
    >
      <ArrowLeft className="w-4 h-4" /> Back to Home
    </Link>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-display font-bold text-neutral-900 mb-6">
        About Hadmate
      </h1>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          {
            icon: Heart,
            title: "Handcrafted with Love",
            desc: "Each product is made with care by skilled artisans",
          },
          {
            icon: Shield,
            title: "Premium Quality",
            desc: "We use the finest materials for lasting beauty",
          },
          {
            icon: Sparkles,
            title: "Unique Designs",
            desc: "Every piece tells its own story",
          },
        ].map((item, i) => (
          <div key={i} className="card p-6 text-center">
            <item.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-neutral-900">{item.title}</h3>
            <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="prose max-w-none text-neutral-600 leading-relaxed space-y-4">
        <p>
          Hadmate is your destination for unique, handcrafted gifts for every
          occasion. We believe in the beauty of handmade - each piece carries
          the warmth and love of the artisan who created it.
        </p>
        <p>
          Our curated collection features talented artisans from across India,
          bringing you traditional crafts with modern aesthetics. From
          personalized mugs to elegant home decor, every item is crafted with
          attention to detail.
        </p>
        <p>
          We're committed to sustainable practices, eco-friendly packaging, and
          supporting local communities. When you shop at Hadmate, you're not
          just buying a gift - you're supporting a craftsperson's dream.
        </p>
      </div>
    </motion.div>
  </div>
);
export default About;
