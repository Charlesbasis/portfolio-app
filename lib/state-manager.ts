/**
 * State Management utility inspired by ML patterns (JAX/Flax TrainState).
 * Provides structured state with checkpointing (dump/restore) capabilities.
 */

export interface StateSnapshot<T> {
  version: number;
  timestamp: number;
  data: T;
  metadata?: Record<string, any>;
}

export class StateManager<T extends Record<string, any>> {
  private currentState: T;
  private history: StateSnapshot<T>[] = [];
  private maxHistory: number;

  constructor(initialState: T, options: { maxHistory?: number } = {}) {
    this.currentState = JSON.parse(JSON.stringify(initialState));
    this.maxHistory = options.maxHistory || 10;
  }

  /**
   * Returns a deep copy of the current state.
   */
  getState(): T {
    return JSON.parse(JSON.stringify(this.currentState));
  }

  /**
   * Updates the state with a partial update (similar to PyTree mapping).
   */
  update(update: Partial<T> | ((state: T) => T)): void {
    if (typeof update === "function") {
      this.currentState = update(this.getState());
    } else {
      this.currentState = { ...this.currentState, ...update };
    }
  }

  /**
   * Creates a "checkpoint" of the current state.
   * Equivalent to `dump_state` in ML frameworks.
   */
  checkpoint(metadata?: Record<string, any>): StateSnapshot<T> {
    const snapshot: StateSnapshot<T> = {
      version: this.history.length + 1,
      timestamp: Date.now(),
      data: this.getState(),
      metadata,
    };

    this.history.push(snapshot);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    return snapshot;
  }

  /**
   * Restores the state from a snapshot.
   */
  restore(snapshot: StateSnapshot<T>): void {
    this.currentState = JSON.parse(JSON.stringify(snapshot.data));
  }

  /**
   * Restores the state to the last checkpoint.
   */
  rollback(): boolean {
    if (this.history.length === 0) return false;
    const last = this.history.pop();
    if (last) {
      this.currentState = JSON.parse(JSON.stringify(last.data));
      return true;
    }
    return false;
  }

  /**
   * Serializes the entire state and history for persistence.
   */
  serialize(): string {
    return JSON.stringify({
      state: this.currentState,
      history: this.history,
    });
  }

  /**
   * Hydrates the manager from a serialized string.
   */
  static deserialize<T extends Record<string, any>>(serialized: string): StateManager<T> {
    const { state, history } = JSON.parse(serialized);
    const manager = new StateManager<T>(state);
    manager.history = history;
    return manager;
  }
}

/**
 * Utility to map over a "PyTree" (nested object/array structure).
 */
export function treeMap(tree: any, fn: (leaf: any) => any): any {
  if (Array.isArray(tree)) {
    return tree.map((node) => treeMap(node, fn));
  } else if (tree !== null && typeof tree === "object") {
    const result: Record<string, any> = {};
    for (const key in tree) {
      result[key] = treeMap(tree[key], fn);
    }
    return result;
  }
  return fn(tree);
}
