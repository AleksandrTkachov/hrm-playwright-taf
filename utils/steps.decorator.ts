import { test } from "@playwright/test";

export function step(customName?: string, options?: { secure?: boolean }) {
  return function (arg1: any, arg2: any, arg3?: any): any {
    
    // Internal data formatting engine
    const formatStepName = (instance: any, methodName: string, args: any[]) => {
      // 1. Determine the name of the class (Page Object) where the method is called
      const className = instance?.constructor?.name || "Page";

      // 2. Generate a base step name
      let baseName = customName || methodName
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());

      // 3. Automatically select emoji based on the type of action
      let emoji = "⚙️ "; // default technical step
      const lowerMethod = methodName.toLowerCase();
      if (lowerMethod.startsWith("click")) emoji = "🖱️ ";
      if (lowerMethod.startsWith("fill") || lowerMethod.startsWith("type")) emoji = "⌨️ ";
      if (lowerMethod.startsWith("verify") || lowerMethod.startsWith("check") || lowerMethod.startsWith("assert")) emoji = "🔍 ";
      if (lowerMethod.startsWith("navigate") || lowerMethod.startsWith("open")) emoji = "🌐 ";

      // 4. Processing arguments
      if (args.length === 0) {
        return `[${className}] ➔ ${emoji}${baseName}`;
      }

      if (options?.secure) {
        return `[${className}] ➔ ${emoji}${baseName} [***]`;
      }

      const readableArgs = args
        .map(arg => {
          if (typeof arg !== 'string') return JSON.stringify(arg);
          
          // Reverse search in process.env
          const envKey = Object.keys(process.env).find(key => process.env[key] === arg);
          if (envKey) return `env.${envKey}`;

          // Smart compression of long strings (over 50 characters)
          return arg.length > 50 ? `${arg.substring(0, 50)}...` : arg;
        })
        .join(', ');

      return `[${className}] ➔ ${emoji}${baseName} [${readableArgs}]`;
    };

    // Modern Stage 3 Spec
    if (arg2 && typeof arg2 === 'object' && 'kind' in arg2) {
      const originalMethod = arg1;
      const context = arg2;
      return async function (this: any, ...args: any[]) {
        const finalStepName = formatStepName(this, String(context.name), args);
        return test.step(finalStepName, async () => originalMethod.apply(this, args));
      };
    }

    // Legacy Stage 2 Spec
    const propertyKey = arg2;
    const descriptor = arg3;
    if (descriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (this: any, ...args: any[]) {
        const finalStepName = formatStepName(this, propertyKey, args);
        return test.step(finalStepName, async () => originalMethod.apply(this, args));
      };
      return descriptor;
    }
  };
}