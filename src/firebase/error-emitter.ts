'use client';

// A simple event emitter for cross-component communication
type Listener<T> = (data: T) => void;

class EventEmitter<TEventMap> {
  private listeners: { [K in keyof TEventMap]?: Listener<TEventMap[K]>[] } = {};

  on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }

  emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach(listener => listener(data));
  }
}

// Define the event map for our application
interface AppEvents {
  'permission-error': Error;
}

// Create and export a singleton instance of the event emitter
export const errorEmitter = new EventEmitter<AppEvents>();
