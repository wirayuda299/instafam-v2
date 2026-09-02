export default function Loading() {
  return (
    <main className="no-scrollbar h-[calc(100dvh-3.5rem)] overflow-y-auto p-5 md:h-screen">
      <div className="max-h-64 min-h-64 w-full border-b border-gray-800 p-2 max-lg:max-h-max md:p-5">
        <div className="mx-auto grid h-full w-full max-w-(--breakpoint-sm) grid-cols-1 items-center gap-4 lg:grid-cols-2">
          <div className="bg-black-1/40 size-36 animate-pulse rounded-full" />
          <div className="space-y-3">
            <div className="bg-black-1/40 h-6 w-40 animate-pulse rounded" />
            <div className="flex gap-6">
              <div className="bg-black-1/40 h-4 w-16 animate-pulse rounded" />
              <div className="bg-black-1/40 h-4 w-16 animate-pulse rounded" />
              <div className="bg-black-1/40 h-4 w-16 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 p-3 md:p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-black-1/40 max-w-[300px] min-w-36 flex-1 basis-36 animate-pulse rounded-lg border border-gray-800"
            style={{ aspectRatio: "1 / 1" }}
          />
        ))}
      </div>
    </main>
  );
}
