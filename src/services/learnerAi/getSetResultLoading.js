/** Ref-counted loading for fetchGetSetResult (overlapping calls keep overlay until all finish). */
let refCount = 0;
const listeners = new Set();

export function subscribeGetSetResultLoading(listener) {
  listeners.add(listener);
  listener(refCount > 0);
  return () => listeners.delete(listener);
}

function notify() {
  const open = refCount > 0;
  listeners.forEach((fn) => {
    try {
      fn(open);
    } catch {
      /* ignore subscriber errors */
    }
  });
}

export function beginGetSetResultRequest() {
  refCount += 1;
  if (refCount === 1) notify();
}

export function endGetSetResultRequest() {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0) notify();
}
