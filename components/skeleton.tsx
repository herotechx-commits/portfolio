import { motion } from "framer-motion";
import { JSX } from "react";

export const AboutMeSkeleton: React.FC = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] rounded-lg flex-col space-y-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(-45deg, rgba(238, 119, 82, 0.3), rgba(231, 60, 126, 0.3), rgba(35, 166, 213, 0.3), rgba(35, 213, 171, 0.3))",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};

export const SkillSkeleton: React.FC = () => {
  const codeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: [0.5, 1, 0.8, 1],
      y: [20, 0, -2, 0],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
  };

  const skills: string[] = ["React", "JS", "Node", "CSS", "Git", "DB"];
  const skillColors: string[] = [
    "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300",
    "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300",
    "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300",
    "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300",
    "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-300",
    "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-300"
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] flex-col justify-center items-center relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-6 md:grid-cols-8 grid-rows-4 md:grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-white/20"></div>
          ))}
        </div>
      </div>
      
      <motion.div
        variants={codeVariants}
        className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4"
      >
        {skills.map((skill, index) => (
          <div key={skill} className={`bg-gradient-to-r ${skillColors[index]} rounded-lg p-2 text-center border`}>
            <span className="text-xs font-mono">{skill}</span>
          </div>
        ))}
      </motion.div>
      
      <motion.div 
        className="absolute bottom-2 right-2 text-green-400/30 font-mono text-xs"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        &lt;/skills&gt;
      </motion.div>
    </motion.div>
  );
};

export const ProjectSkeleton = (): JSX.Element => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };

  const skillCards = [
    {
      title: "React & Java",
      gradient: "from-pink-500 to-violet-500",
      level: "Expert",
      levelColor: "border-green-500/50 bg-green-500/20 text-green-300"
    },
    {
      title: "AI/ML",
      gradient: "from-blue-500 to-cyan-500",
      level: "Learning",
      levelColor: "border-orange-500/50 bg-orange-500/20 text-orange-300"
    },
    {
      title: "Three.js & WebGL",
      gradient: "from-orange-500 to-yellow-500",
      level: "Advanced",
      levelColor: "border-blue-500/50 bg-blue-500/20 text-blue-300"
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/20 flex flex-col items-center justify-center"
      >
        <div className={`rounded-full h-10 w-10 bg-gradient-to-r ${skillCards[0].gradient}`}></div>
        <p className="sm:text-sm text-xs text-center font-semibold text-white/80 mt-4">
          {skillCards[0].title}
        </p>
        <p className={`${skillCards[0].levelColor} text-xs rounded-full px-2 py-0.5 mt-4`}>
          {skillCards[0].level}
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/20 flex flex-col items-center justify-center">
        <div className={`rounded-full h-10 w-10 bg-gradient-to-r ${skillCards[1].gradient}`}></div>
        <p className="sm:text-sm text-xs text-center font-semibold text-white/80 mt-4">
          {skillCards[1].title}
        </p>
        <p className={`${skillCards[1].levelColor} text-xs rounded-full px-2 py-0.5 mt-4`}>
          {skillCards[1].level}
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/20 flex flex-col items-center justify-center"
      >
        <div className={`rounded-full h-10 w-10 bg-gradient-to-r ${skillCards[2].gradient}`}></div>
        <p className="sm:text-sm text-xs text-center font-semibold text-white/80 mt-4">
          {skillCards[2].title}
        </p>
        <p className={`${skillCards[2].levelColor} text-xs rounded-full px-2 py-0.5 mt-4`}>
          {skillCards[2].level}
        </p>
      </motion.div>
    </motion.div>
  );
};

export const ConnectSkeleton: React.FC = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-white/20 p-2 items-start space-x-2 bg-white/10 backdrop-blur-sm"
      >
        <div className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-gradient-to-r from-purple-500 to-pink-500 shrink-0"></div>
        <p className="text-xs text-white/70">
          Have a project in mind? Let&apos;s discuss your ideas and bring them to life with modern web technologies...
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-white/20 p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white/10 backdrop-blur-sm"
      >
        <p className="text-xs text-white/70">Get in touch!</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
      </motion.div>
    </motion.div>
  );
};

