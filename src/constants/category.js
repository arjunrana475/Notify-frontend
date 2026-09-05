export const category = [
  "DSA",
  "Projects",
  "JavaScript",
  "React",
  "MERN",
  "WebDev",
  "SQL",
  "HTML/CSS",
  "College",
  "Other",
];

export const categoryMeta = {
  DSA: {
    icon: "⚡",
    colorClass: "cat-badge-dsa",
    bg: "#eef2ff",
    color: "#4f46e5",
    border: "#c7d2fe",
    desc: "Algorithms, Data Structures & Problem Solving",
  },
  Projects: {
    icon: "🚀",
    colorClass: "cat-badge-projects",
    bg: "#f0fdf4",
    color: "#15803d",
    border: "#bbf7d0",
    desc: "Full-stack apps, mini projects & codebases",
  },
  JavaScript: {
    icon: "💛",
    colorClass: "cat-badge-javascript",
    bg: "#fefce8",
    color: "#a16207",
    border: "#fef08a",
    desc: "Core JS concepts, ES6+, async & tricks",
  },
  React: {
    icon: "⚛️",
    colorClass: "cat-badge-react",
    bg: "#f0f9ff",
    color: "#0369a1",
    border: "#bae6fd",
    desc: "Hooks, components, state management & UI",
  },
  MERN: {
    icon: "🍃",
    colorClass: "cat-badge-mern",
    bg: "#ecfdf5",
    color: "#047857",
    border: "#a7f3d0",
    desc: "MongoDB, Express, React & Node.js architecture",
  },
  WebDev: {
    icon: "🌐",
    colorClass: "cat-badge-webdev",
    bg: "#faf5ff",
    color: "#7e22ce",
    border: "#e9d5ff",
    desc: "Web development fundamentals, APIs & protocols",
  },
  SQL: {
    icon: "🗄️",
    colorClass: "cat-badge-sql",
    bg: "#fff1f2",
    color: "#be123c",
    border: "#fecdd3",
    desc: "Queries, schemas, normalization & relational databases",
  },
  "HTML/CSS": {
    icon: "🎨",
    colorClass: "cat-badge-htmlcss",
    bg: "#fff7ed",
    color: "#c2410c",
    border: "#ffedd5",
    desc: "Semantic markup, styling, grid & layouts",
  },
  College: {
    icon: "🎓",
    colorClass: "cat-badge-college",
    bg: "#f5f3ff",
    color: "#6d28d9",
    border: "#ddd6fe",
    desc: "Coursework, exams, syllabus & lecture notes",
  },
  Other: {
    icon: "📁",
    colorClass: "cat-badge-other",
    bg: "#f8fafc",
    color: "#475569",
    border: "#e2e8f0",
    desc: "Miscellaneous notes, thoughts & bookmarks",
  },
};

export const getCategoryMeta = (catName) => {
  return (
    categoryMeta[catName] || {
      icon: "📌",
      colorClass: "cat-badge-other",
      bg: "#f8fafc",
      color: "#475569",
      border: "#e2e8f0",
      desc: "Category notes and snippets",
    }
  );
};
