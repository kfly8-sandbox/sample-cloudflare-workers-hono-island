
interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining(): number;
}

type IdleRequestCallback = (deadline: IdleDeadline) => void;

export const requestIdleCallback =
  window.requestIdleCallback ||
  function(callback: IdleRequestCallback): number {
    const start = Date.now();
    return window.setTimeout(function() {
      callback({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };

