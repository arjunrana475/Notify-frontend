export const category = [
  "DSA",
  "Projects",
  "JavaScript",
  "React",
  "MERN",
  "WebDev",
];

export const categoryMeta = {
  DSA: {
    icon: "⚡",
    colorClass: "cat-badge-dsa",
    bg: "#eff6ff",
    color: "#1d4ed8",
    border: "#bfdbfe",
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
    bg: "#f0fdfa",
    color: "#0f766e",
    border: "#99f6e4",
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
    color: "#6b21a8",
    border: "#e9d5ff",
    desc: "Web development fundamentals, APIs & protocols",
  },
};

export const getCategoryMeta = (catName, customMetas = {}) => {
  if (!catName) {
    return {
      icon: "📁",
      colorClass: "cat-badge-other",
      bg: "#f8fafc",
      color: "#475569",
      border: "#e2e8f0",
      desc: "General notes and snippets",
    };
  }

  // Check custom metas first
  if (customMetas[catName]) {
    return customMetas[catName];
  }

  // Check built-in meta
  if (categoryMeta[catName]) {
    return categoryMeta[catName];
  }

  // Dynamic fallback for any custom category
  return {
    icon: "📁",
    colorClass: "cat-badge-other",
    bg: "rgba(59, 130, 246, 0.12)",
    color: "#3b82f6",
    border: "rgba(59, 130, 246, 0.28)",
    desc: `${catName} category notes and snippets`,
    isCustom: true,
  };
};
