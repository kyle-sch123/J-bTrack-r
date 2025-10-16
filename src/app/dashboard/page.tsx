import DashboardSection from "@/sections/dashboard";
import JobApplicationForm from "@/sections/JobApplicationForm";
import Navbar from "@/sections/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <>
        <Navbar />
        <JobApplicationForm />
        <DashboardSection />
      </>
    </div>
  );
}
