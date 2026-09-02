export default function Loading() {
  return (
    <div className="h-[calc(100dvh-3.5rem)] w-full overflow-y-auto p-1 md:h-screen md:p-2">
      <div className="columns-2 gap-1 sm:columns-3 md:gap-2 lg:columns-4 xl:columns-5">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bg-black-1/40 mb-1 aspect-square w-full animate-pulse rounded-md md:mb-2"
          />
        ))}
      </div>
    </div>
  );
}
