import React from 'react';

const collections = [
  { id: 1, name: "Women", count: 9, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" },
  { id: 2, name: "Men", count: 29, image: "https://images.unsplash.com/photo-1490578474895-699bc4e3f444?w=400&q=80" },
  { id: 3, name: "Kids", count: 4, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80" },
  { id: 4, name: "Gadget", count: 11, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80" },
  { id: 5, name: "Foods", count: 2, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
  { id: 6, name: "Sports", count: 5, image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80" },
];

export default function Collections() {
  return (
    <div className="py-6 mb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h6 className="font-bold text-lg">Collections</h6>
          <a href="/collections" className="btn btn-sm btn-ghost">View all</a>
        </div>
        
        <div className="carousel rounded-box gap-4 w-full snap-x">
          {collections.map(col => (
            <div key={col.id} className="carousel-item w-32 sm:w-40 snap-center relative rounded-xl overflow-hidden group border border-base-200">
              <img src={col.image} alt={col.name} className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white flex justify-between items-center">
                <span className="font-bold text-sm sm:text-base">{col.name}</span>
                <span className="badge badge-error badge-sm text-white font-bold">{col.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
