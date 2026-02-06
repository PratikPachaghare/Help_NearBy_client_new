import React, { useRef } from 'react';
import './CategoryFilter.css';

const categories = [
  'All', 'Electrician', 'Plumber', 'Carpenter', 'Painter',
  'Driver', 'Cook', 'Cleaner', 'AC Mechanic'
];

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (scrollOffset) => {
    scrollContainerRef.current.scrollBy({
      left: scrollOffset,
      behavior: 'smooth',
    });
  };

  return (
    <div className="category-filter-wrapper">
      <button
        className="scroll-button"
        onClick={() => scroll(-150)}
      >
        &lt;
      </button>

      <div className="category-scroll" ref={scrollContainerRef}>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <button
        className="scroll-button"
        onClick={() => scroll(150)}
      >
        &gt;
      </button>
    </div>
  );
};

export default CategoryFilter;
