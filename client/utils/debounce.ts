export function debounce(func: () => void, timeout = 1000) {
  let timer: any;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args as any);
    }, timeout);
  };
}
