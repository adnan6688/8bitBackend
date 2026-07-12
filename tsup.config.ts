import { defineConfig } from "tsup";





// export default defineConfig({

//     entry: ["src/server.ts"],

//     format: ["esm"], // Keep this as ESM

//     target: "esnext",

//     outDir: "dist",

//     clean: true,

//     bundle: true,

//     splitting: false,

//     sourcemap: true,

//     // Add this banner to shim require() for CJS dependencies

//     banner: {

//         js: `

//    import { createRequire } from 'module';

//    const require = createRequire(import.meta.url);

//   `,

//     },

// });


export default defineConfig({
    entry: ["src/server.ts"],
    format: ["esm"], 
    target: "esnext",
    outDir: "api", // 'dist' থেকে বদলে 'api' করুন
    clean: true,
    bundle: true,
    splitting: false,
    sourcemap: true,
    banner: {
        js: `
   import { createRequire } from 'module';
   const require = createRequire(import.meta.url);
  `,
    },
});