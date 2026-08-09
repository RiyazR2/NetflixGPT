import React from "react";

const ShimmerUI = () => {
  return (
    <div className="bg-gray-900/30 rounded-2xl border border-gray-800/50 p-4 backdrop-blur-sm">
      {/* Header Shimmer */}
      <div className="mb-4 text-center animate-pulse">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-800/50 rounded-lg">
          <div className="w-5 h-5 bg-gray-700 rounded" />
          <div className="h-6 w-40 bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-32 bg-gray-800 rounded mx-auto mt-2" />
      </div>

      {/* Movie Lists Shimmer */}
      <div className="space-y-4">
        {[1, 2, 3].map((category) => (
          <div
            key={category}
            className="animate-pulse bg-gray-800/30 rounded-xl border border-gray-700/30 p-3 backdrop-blur-sm"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800/50">
              <div className="w-8 h-8 bg-gray-700 rounded-lg" />
              <div className="flex-1">
                <div className="h-5 w-48 bg-gray-700 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-800 rounded" />
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-700/50 rounded-full">
                <div className="w-4 h-4 bg-gray-600 rounded-full" />
                <div className="h-3 w-16 bg-gray-600 rounded" />
              </div>
            </div>

            {/* Movie Cards Shimmer */}
            <div className="flex overflow-x-hidden gap-4 px-2">
              {[1, 2, 3, 4, 5].map((card) => (
                <div key={card} className="flex-shrink-0">
                  {/* Movie Card */}
                  <div className="w-36 md:w-56 pr-4">
                    <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-800">
                      {/* Poster Shimmer */}
                      <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative overflow-hidden">
                        {/* Animated shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/20 to-transparent" />

                        {/* Play Icon Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-700/50" />
                        </div>
                      </div>

                      {/* Title Shimmer */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                        <div className="h-3 bg-gray-600 rounded mb-2 w-3/4" />
                        <div className="h-3 bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Loading Text */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-3 text-gray-400">
          <div className="relative">
            <div className="w-5 h-5 border-2 border-gray-600 border-t-red-500 rounded-full animate-spin" />
          </div>
          <span className="text-sm animate-pulse">
            Finding perfect movies for you...
          </span>
        </div>
      </div>
    </div>
  );
};

// Shimmer animation is handled by Tailwind CSS classes

export default ShimmerUI;
