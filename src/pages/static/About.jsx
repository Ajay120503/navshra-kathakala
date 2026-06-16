import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Shield, Sparkles, Loader2 } from "lucide-react";
import usePage from "../../hooks/usePage";

const iconMap = {
  0: Heart,
  1: Shield,
  2: Sparkles,
};

const About = () => {
  const { page, loading, error } = usePage("about");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const content = page?.content
    ? typeof page.content === "string"
      ? JSON.parse(page.content)
      : page.content
    : {};
  const title = page?.title || "About Hadmate";
  const features = content.features || [
    {
      title: "Handcrafted with Love",
      description: "Each product is made with care by skilled artisans",
    },
    {
      title: "Premium Quality",
      description: "We use the finest materials for lasting beauty",
    },
    { title: "Unique Designs", description: "Every piece tells its own story" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-6">
          {title}
        </h1>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {features.map((item, i) => {
            const Icon = iconMap[i] || Sparkles;
            return (
              <div key={i} className="card p-6 text-center">
                <Icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
        <div className="prose max-w-none text-neutral-600 leading-relaxed space-y-4">
          {content.intro && <p>{content.intro}</p>}
          {content.body && <p>{content.body}</p>}
          {content.outro && <p>{content.outro}</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default About;
