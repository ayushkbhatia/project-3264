// The 03–05 canvas and its 03 build talk through one global (rebuild-platform.logic.js):
// t is the timeline the canvas wants (null: the build auto-plays), shown what the build last drew.
declare global {
  interface Window {
    __rbCtl?: { t: number | null; shown: number } | null;
  }
}

export {};
