import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Worker
class MockWorker {
  constructor(url, options) {
    this.url = url;
    this.options = options;
  }
  postMessage = vi.fn();
  onmessage = vi.fn();
  terminate = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}
global.Worker = MockWorker;

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    clear: vi.fn(() => { store = {}; }),
    removeItem: vi.fn(key => { delete store[key]; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Fetch
global.fetch = vi.fn();
