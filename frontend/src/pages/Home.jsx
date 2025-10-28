import { useEffect, useState } from "react";
import { API } from "../api/api";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        console.log("📦 Fetched projects:", res.data); // 🔥 Debug: Projects check করা
        console.log("🖼️ First project image:", res.data[0]?.imageUrl); // 🔥 Debug: Image URL check
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No projects found</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Upload some projects to get started!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 🔥 Pinterest style masonry layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-6 gap-4 space-y-4">
        {projects.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
      </div>
    </div>
  );
}