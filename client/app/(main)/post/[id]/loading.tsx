export default function Loading() {
  return (
    <div className="flex max-h-screen min-h-dvh w-full flex-col items-center justify-center overflow-y-auto px-3 py-3 max-lg:max-h-dvh lg:min-h-screen">
      <div className="flex h-full max-h-[600px] min-h-[510px] w-full max-w-(--breakpoint-lg) overflow-hidden rounded-xl border border-gray-800 bg-zinc-950 shadow-sm max-lg:max-h-full max-lg:flex-col">
        <div className="bg-black-1/40 aspect-auto max-h-[600px] w-full max-w-[450px] animate-pulse max-lg:max-h-[300px] max-lg:max-w-full" />
        <div className="flex w-full flex-col gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-black-1/40 size-10 animate-pulse rounded-full" />
            <div className="bg-black-1/40 h-3 w-24 animate-pulse rounded" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-black-1/40 h-3 w-2/3 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
