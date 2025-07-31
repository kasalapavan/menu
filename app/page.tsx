"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { menuData } from "./data/menuData" // Adjust the import path as necessary

interface MenuItem {
  name: string
  price: string
  description?: string
  image?: string // Optional image URL
}

export default function OptimizedMenu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar


  // Refs
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoized calculations
  const groupedMenuItems = menuData.reduce(
    (acc, section) => {
      acc[section.title] = section.items;
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const sortedCategories = Object.keys(groupedMenuItems).sort();

  const filteredCategories = sortedCategories.filter((category) => {
    const itemsInCategory = groupedMenuItems[category];
    return itemsInCategory.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())));
  });

  // Initialize expanded categories
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    sortedCategories.forEach((category) => {
      initialExpandedState[category] = true;
    });
    setExpandedCategories(initialExpandedState);

    // Set initial active category
    if (filteredCategories.length > 0) {
      setActiveCategory(filteredCategories[0]);
    }
  }, []);

  // Optimized scroll to category function
  const scrollToCategory = useCallback((category: string) => {
    const element = categoryRefs.current[category];
    if (!element) return;

    setActiveCategory(category);

    // Calculate offset considering fixed headers (80px header + 72px nav)
    const headerOffset = 152;
    const elementPosition = element.offsetTop - headerOffset;

    window.scrollTo({
      top: Math.max(0, elementPosition),
      behavior: "smooth",
    });

    // Center the active tab
    centerActiveTab(category);
  }, []);

  // Optimized tab centering
  const centerActiveTab = useCallback((category: string) => {
    const activeButton = categoryButtonRefs.current[category];
    const container = categoryNavRef.current;

    if (!activeButton || !container) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    const scrollLeft = activeButton.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;

    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: "smooth",
    });
  }, []);

  // Simplified intersection observer
  useEffect(() => {
    if (filteredCategories.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return; // Don't update during programmatic scrolling

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries[0];
          const categoryName = topEntry.target.getAttribute("data-category");

          if (categoryName && categoryName !== activeCategory) {
            setActiveCategory(categoryName);
            centerActiveTab(categoryName);
          }
        }
      },
      {
        root: null,
        rootMargin: "-152px 0px -50% 0px", // Account for fixed headers
        threshold: [0, 0.1, 0.5],
      },
    );

    filteredCategories.forEach((category) => {
      const element = categoryRefs.current[category];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [filteredCategories, activeCategory, isScrolling, centerActiveTab]);

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans text-gray-800">
      {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          {/* Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          
          {/* Search Bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search your craving..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </header>

      {/* Sidebar and Overlay */}
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={toggleSidebar}
          ></div>
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <ul className="p-4">
              {menuData.map((section) => (
                <li key={section.title} className="mb-2">
                  <a
                    href={`#${section.title.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToCategory(section.title);
                      toggleSidebar(); // Close sidebar after clicking
                    }}
                    className={`block py-2 px-4 rounded-lg text-lg font-medium transition-colors duration-200 ${
                      activeCategory === section.title
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Fixed Category Navigation */}
      <nav className="fixed top-20 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="py-4 px-4 max-w-7xl mx-auto">
        <div
          ref={categoryNavRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex space-x-3 pb-2 min-w-max">
            {menuData.map((section) => {
              const category = section.title;
              // Check if the category is in the filtered list before rendering
              if (!filteredCategories.includes(category)) {
                return null; // Skip this category if it doesn't match the search filter
              }
              return (
                <button
                  key={category}
                  ref={(el) => {
                    categoryButtonRefs.current[category] = el;
                  }}
                  onClick={() => scrollToCategory(category)}
                  className={`flex items-center justify-center px-4 py-2 rounded-full border-2 transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeCategory === category
                      ? "bg-blue-500 text-white border-blue-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-sm font-bold rounded-full mr-2 ${
                      activeCategory === category ? "bg-white text-blue-500" : "bg-gray-400 text-white"
                    }`}
                  >
                    {category.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-base font-medium">{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>

        {/* Main Content */}
      <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto ">
        {filteredCategories.length > 0 ? (
          <>
            {menuData
              .filter(section => filteredCategories.includes(section.title))
              .map((section) => (
                <section
                  key={section.title}
                  ref={(el) => {
                    categoryRefs.current[section.title] = el;
                  }}
                  data-category={section.title}
                  className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden "
                >
                  {/* Category Header */}
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => toggleCategory(section.title)}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      {section.title}
                      <span className="ml-2 text-base font-medium text-gray-500">
                        ({section.items.length})
                      </span>
                    </h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-gray-600 transition-transform duration-300 ${
                        expandedCategories[section.title] ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Menu Items */}
                  {expandedCategories[section.title] && (
                    <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {section.items
                        .filter((item) =>
                          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((item) => (
                          <div
                            key={item.name}
                            className="bg-white border border-gray-100 rounded-lg shadow-sm p-3 flex items-center hover:shadow-md transition-all duration-200"
                          >
                            {/* Text Content */}
                            <div className="flex-1 mr-3">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xl font-bold text-green-600">
                                  {item.price}
                                </span>
                              </div>
                            </div>
                            {/* Image */}
                            {item.image !== '/burger.jpg' && (
                              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </section>
              ))}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-600">
                No items found matching your search criteria. Try a different search term!
              </p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}