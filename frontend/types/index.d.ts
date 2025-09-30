// Use declaration merging to extend TableState
export declare module "@tanstack/react-table" {
  interface TableState {
    onRefresh?: () => void;
  }
}
