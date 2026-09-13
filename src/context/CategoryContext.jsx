import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import API from "../services/api.js";
import { toast } from "react-toastify";
import { category as DEFAULT_CATEGORY_NAMES, getCategoryMeta as baseGetCategoryMeta } from "../constants/category.js";
import { useAuth } from "./AuthContext";

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const stored = localStorage.getItem("notify_custom_categories");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onCreatedCallback, setOnCreatedCallback] = useState(null);

  // Fetch categories from backend when user is logged in
  const fetchCategories = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }
    try {
      setLoading(true);
      const res = await API.get("/api/categories");
      if (res.data?.customCategories) {
        setCustomCategories(res.data.customCategories);
        try {
          localStorage.setItem("notify_custom_categories", JSON.stringify(res.data.customCategories));
        } catch (e) {
          console.warn("Could not save custom categories to localStorage", e);
        }
      }
    } catch (err) {
      console.warn("Could not fetch categories from server:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Combined list of all category names (Default + Custom)
  const categories = useMemo(() => {
    const customNames = customCategories.map((c) => c.name);
    // Combine without duplicates
    const combined = [...DEFAULT_CATEGORY_NAMES];
    customNames.forEach((name) => {
      if (!combined.some((c) => c.toLowerCase() === name.toLowerCase())) {
        combined.push(name);
      }
    });
    return combined;
  }, [customCategories]);

  // Map of custom metas
  const customMetas = useMemo(() => {
    const map = {};
    customCategories.forEach((c) => {
      map[c.name] = {
        icon: c.icon || "📁",
        colorClass: "cat-badge-other",
        bg: c.color ? `${c.color}18` : "rgba(59, 130, 246, 0.12)",
        color: c.color || "#3b82f6",
        border: c.color ? `${c.color}44` : "rgba(59, 130, 246, 0.28)",
        desc: c.desc || `${c.name} category`,
        isCustom: true,
        _id: c._id,
      };
    });
    return map;
  }, [customCategories]);

  const getMeta = useCallback(
    (catName) => {
      return baseGetCategoryMeta(catName, customMetas);
    },
    [customMetas]
  );

  const addCategory = useCallback(
    async ({ name, icon = "📁", color = "#3b82f6", desc = "" }) => {
      if (!name || !name.trim()) {
        toast.error("Category name is required");
        return null;
      }

      const cleanName = name.trim();

      // Check if already in default or custom
      const exists = categories.some((c) => c.toLowerCase() === cleanName.toLowerCase());
      if (exists) {
        toast.error(`Category "${cleanName}" already exists`);
        return null;
      }

      try {
        let createdCat = null;

        if (isLoggedIn) {
          const res = await API.post("/api/categories", {
            name: cleanName,
            icon,
            color,
            desc,
          });
          createdCat = res.data?.category;
        }

        if (!createdCat) {
          createdCat = {
            _id: `local_${Date.now()}`,
            name: cleanName,
            icon,
            color,
            desc,
          };
        }

        setCustomCategories((prev) => {
          const next = [...prev, createdCat];
          try {
            localStorage.setItem("notify_custom_categories", JSON.stringify(next));
          } catch (e) {
            console.warn(e);
          }
          return next;
        });

        toast.success(`Category "${cleanName}" created`);

        if (onCreatedCallback && typeof onCreatedCallback === "function") {
          onCreatedCallback(cleanName, createdCat);
        }

        setIsModalOpen(false);
        setOnCreatedCallback(null);
        return createdCat;
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to create category";
        toast.error(msg);
        return null;
      }
    },
    [categories, isLoggedIn, onCreatedCallback]
  );

  const deleteCategory = useCallback(
    async (idOrName) => {
      const target = customCategories.find((c) => c._id === idOrName || c.name === idOrName);
      if (!target) return;

      try {
        if (isLoggedIn && target._id && !target._id.startsWith("local_")) {
          await API.delete(`/api/categories/${target._id}`);
        }

        setCustomCategories((prev) => {
          const next = prev.filter((c) => c._id !== target._id && c.name !== target.name);
          try {
            localStorage.setItem("notify_custom_categories", JSON.stringify(next));
          } catch (e) {
            console.warn(e);
          }
          return next;
        });

        toast.success(`Category "${target.name}" removed`);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to delete category";
        toast.error(msg);
      }
    },
    [customCategories, isLoggedIn]
  );

  const openCreateModal = useCallback((callback) => {
    if (callback && typeof callback === "function") {
      setOnCreatedCallback(() => callback);
    } else {
      setOnCreatedCallback(null);
    }
    setIsModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsModalOpen(false);
    setOnCreatedCallback(null);
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        customCategories,
        customMetas,
        loading,
        getMeta,
        addCategory,
        deleteCategory,
        isModalOpen,
        openCreateModal,
        closeCreateModal,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};
