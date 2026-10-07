import WorkflowHero from "@/components/home/WorkflowHero";
import BusinessSystemStory from "@/components/home/BusinessSystemStory";
import ProblemExplorer from "@/components/home/ProblemExplorer";
import SelectedWork from "@/components/home/SelectedWork";
import SystemProcess from "@/components/home/SystemProcess";
import TeamEditorial from "@/components/home/TeamEditorial";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <WorkflowHero />
      <BusinessSystemStory />
      <ProblemExplorer />
      <SelectedWork />
      <SystemProcess />
      <TeamEditorial />
      <CTA index="06" />
    </>
  );
}
