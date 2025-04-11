const fakeProjects = [
  {
    title: "Portfolio Website",
    description:
      "A personal portfolio showcasing projects and skills, built with React and Tailwind CSS.",
    projectLink: "https://myportfolio.vercel.app",
    sourceCode: "https://github.com/yourname/portfolio",
    imageUrl:
      "https://raw.githubusercontent.com/yourname/portfolio/main/public/preview.png",
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    isFeatured: true,
  },
  {
    title: "E-commerce Store",
    description:
      "A full-stack shoe store built with MERN stack featuring shopping cart and admin panel.",
    projectLink: "https://shoestore.onrender.com",
    sourceCode: "https://github.com/yourname/ecommerce-store",
    imageUrl:
      "https://raw.githubusercontent.com/yourname/ecommerce-store/main/public/cover.png",
    techStack: ["MongoDB", "Express", "React", "Node.js"],
    isFeatured: true,
  },
  {
    title: "Blog Platform",
    description:
      "A blogging platform where users can create, edit, and delete blog posts.",
    projectLink: "https://blogit.vercel.app",
    sourceCode: "https://github.com/yourname/blog-platform",
    imageUrl:
      "https://raw.githubusercontent.com/yourname/blog-platform/main/assets/blog-preview.png",
    techStack: ["React", "Node.js", "MongoDB", "JWT"],
    isFeatured: false,
  },
  {
    title: "Task Manager API",
    description:
      "RESTful API for managing daily tasks with CRUD operations and JWT authentication.",
    projectLink: "",
    sourceCode: "https://github.com/yourname/task-manager-api",
    imageUrl:
      "https://raw.githubusercontent.com/yourname/task-manager-api/main/assets/api-docs.png",
    techStack: ["Node.js", "Express", "MongoDB"],
    isFeatured: false,
  },
  {
    title: "Weather App",
    description:
      "A simple weather forecast app using OpenWeatherMap API with dynamic UI updates.",
    projectLink: "https://weatherapp.netlify.app",
    sourceCode: "https://github.com/yourname/weather-app",
    imageUrl:
      "https://raw.githubusercontent.com/yourname/weather-app/main/public/weather-preview.png",
    techStack: ["HTML", "CSS", "JavaScript", "API"],
    isFeatured: false,
  },
];

module.exports = fakeProjects;
