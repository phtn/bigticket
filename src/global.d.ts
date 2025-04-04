declare global {
  namespace globalThis {
    interface Global {
      emailQueue: string[];
    }
  }
}

// Required to make the file a module
export {};
