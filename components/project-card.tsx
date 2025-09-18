import { ProjectData } from "@/types";
import { GithubIcon } from "lucide-react";

import { motion } from "motion/react";
import Image from "next/image";

export const ProjectCard: React.FC<ProjectData> = ({ projectTitle, projectGithub, projectDescription, projectLink, projectImage }) => {
  return (
      <a href={projectLink ||''}>
        
        <div className="row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input p-4 justify-between flex flex-col space-y-4 cursor-pointer bg-white/10 backdrop-blur-md overflow-hidden border border-white/20 hover:bg-white/20">
          
          <div className="relative z-10">
              <Image
                src={projectImage}
                alt={projectTitle}
                width={500}
                height={500}
                className="rounded-xl"
              />
            <motion.div
              className="py-4 relative z-20"
            >
              <div className="flex justify-between">
                <p className="text-white uppercase text-xs text-left font-bold">
                  {projectTitle}
                </p>
                <a href={projectGithub}>
                  <GithubIcon size={20}/>
                </a>

              </div>
              <p className="text-neutral-200 font-thin capitalize text-xs text-left  mt-4">
                {(projectDescription).slice(0, 80)}
              </p>
            </motion.div>
          </div>
        </div>
      </a>
  )
}