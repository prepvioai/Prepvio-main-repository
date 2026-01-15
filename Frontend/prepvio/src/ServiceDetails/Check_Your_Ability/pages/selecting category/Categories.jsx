import React, { useState } from "react";
import { ArrowRight, Sparkles, BookOpen, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const categories = [
    {
      id: "aptitude",
      name: "Aptitude",
      icon: BookOpen,
      description: "Test your logical reasoning and problem-solving skills",
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      id: "interview",
      name: "Interview",
      icon: MessageSquare,
      description: "Practice with AI-powered mock interviews",
      color: "from-pink-500 to-orange-500",
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
    },
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      // Navigate based on selection
      if (selectedCategory === "aptitude") {
        navigate("/services/check-your-ability/aptitude");
      } else if (selectedCategory === "interview") {
        navigate("/services/check-your-ability/interview");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-6 font-sans selection:bg-[#D4F478] selection:text-black flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none -z-50">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-t from-pink-50 to-transparent rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[3rem] shadow-2xl shadow-gray-200/50 p-10 md:p-16 space-y-10 relative overflow-hidden"
      >
        {/* Floating decoration */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 4, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-8 -right-8 w-32 h-32 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"
        />

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-3 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-[#D4F478]" />
            </motion.div>
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Choose Your Path
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
            Select a Category
          </h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-1.5 bg-[#D4F478] mx-auto rounded-full"
          />
          
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto font-medium pt-2">
            Pick the type of assessment you'd like to practice
          </p>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-6 relative z-10"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategorySelect(category.id)}
                className={`
                  relative p-8 rounded-3xl cursor-pointer border-3 transition-all
                  ${
                    isSelected
                      ? "border-[#D4F478] bg-white shadow-xl shadow-[#D4F478]/20"
                      : "border-gray-200 bg-white/90 hover:border-gray-300 shadow-sm"
                  }
                `}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute top-4 right-4 w-6 h-6 bg-[#D4F478] rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-3 h-3 bg-[#1A1A1A] rounded-full"
                    />
                  </motion.div>
                )}

                {/* Icon with gradient */}
                <div className={`w-16 h-16 rounded-2xl ${category.bgColor} flex items-center justify-center mb-4 relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />
                  <Icon className="w-8 h-8 text-gray-700 relative z-10" strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {category.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-gray-200/50 flex justify-center relative z-10"
        >
          <motion.button
            whileHover={selectedCategory ? "hover" : {}}
            whileTap={selectedCategory ? "tap" : {}}
            onClick={handleContinue}
            disabled={!selectedCategory}
            className={`
              flex items-center gap-0 group cursor-pointer
              ${!selectedCategory ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <span
              className={`
                px-10 py-4 rounded-l-full font-bold text-lg shadow-xl z-10 relative
                ${
                  selectedCategory
                    ? "bg-[#1A1A1A] text-white shadow-gray-300/50"
                    : "bg-gray-300 text-gray-500"
                }
              `}
            >
              Continue
            </span>
            <motion.span
              className={`
                w-14 h-[3.75rem] flex items-center justify-center rounded-r-full border-l-2 origin-left
                ${
                  selectedCategory
                    ? "bg-[#D4F478] border-[#1A1A1A] group-hover:bg-[#cbf060]"
                    : "bg-gray-200 border-gray-300"
                }
                transition-colors
              `}
              variants={{
                hover: { x: 5 },
                tap: { x: 0 },
              }}
            >
              <ArrowRight
                className={`w-6 h-6 transition-transform duration-300 ${
                  selectedCategory
                    ? "text-black group-hover:rotate-[-45deg]"
                    : "text-gray-500"
                }`}
              />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 pt-4"
        >
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              selectedCategory ? "bg-[#D4F478]" : "bg-gray-300"
            }`}
          />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Categories;