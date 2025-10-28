import { useEffect, useState } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";

export default function Profile() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user?._id) {
      // 🔥 এখানে নিজের ইউজার আইডি পাঠাচ্ছি
      API.get(`/projects/user/${user._id}`)
        .then((res) => {
          console.log("Fetched projects:", res.data);
          setProjects(res.data);
        })
        .catch((err) => console.error("Error fetching user projects:", err));
    }
  }, [user]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
          <p>{user.email}</p>
          <p className="text-gray-500 mt-2 mb-6">{user.bio || "No bio yet."}</p>

          <h3 className="text-xl font-semibold mb-3">Your Projects</h3>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              তুমি এখনও কোনো প্রজেক্ট আপলোড করোনি।
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
