import { Card, colors, spacing } from '../design-system';

/**
 * Loading skeleton for StudyMode component
 * Displays while the lazy-loaded StudyMode bundle is being fetched
 */
export default function StudyModeLoading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <Card
        variant="elevated"
        padding="none"
        className="w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-pulse"
      >
        {/* Header Skeleton */}
        <div
          className="bg-gradient-to-r from-sky-500 to-green-500 text-white p-3"
          style={{ minHeight: '120px' }}
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <div
                className="h-8 bg-white/30 rounded w-80 mb-2"
                aria-hidden="true"
              />
              <div
                className="h-4 bg-white/20 rounded w-64"
                aria-hidden="true"
              />
            </div>
            <div className="flex gap-1">
              <div className="h-9 w-32 bg-white/20 rounded" aria-hidden="true" />
              <div className="h-9 w-20 bg-white/20 rounded" aria-hidden="true" />
            </div>
          </div>
          {/* Progress bar skeleton */}
          <div className="bg-white/20 rounded-full h-2 mt-2">
            <div className="bg-white/40 rounded-full h-2 w-1/3" aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left Panel Skeleton */}
          <div className="flex-1 overflow-hidden border-r border-gray-200 p-3">
            {/* Filter tabs skeleton */}
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 rounded w-24"
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Card grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-lg overflow-hidden"
                  style={{ height: '140px' }}
                >
                  <div className="w-full h-1 bg-gray-300" aria-hidden="true" />
                  <div className="p-3 space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-3/4" aria-hidden="true" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" aria-hidden="true" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel Skeleton */}
          <div className="w-1/3 overflow-hidden flex flex-col bg-gray-50 p-3">
            <div className="text-center py-12">
              <div
                className="inline-block h-12 w-12 rounded-full bg-gray-200 mb-4"
                aria-hidden="true"
              />
              <div
                className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"
                aria-hidden="true"
              />
              <div
                className="h-4 bg-gray-100 rounded w-64 mx-auto"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Loading status for screen readers */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Cargando modo de estudio...
        </div>
      </Card>
    </div>
  );
}
