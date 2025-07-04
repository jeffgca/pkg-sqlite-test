# Node / Tauri Sidecar packaging example

This is a dumb-as-possible example of using node.js as a sidecar process in Tauri.

## Features:

- bundles all JS into a single CommonJS file using esbuild
- builds a binary runnable on macOS using @yao-pkg/pkg
- app-specific handling of the binary extension for better-sqlite3
- relatively simple set of script commands to run

## Notes

This was surprisingly hard to get working nicely, some of the main issues were:

1. `pkg` [does not work well with esm syntax](https://github.com/yao-pkg/pkg/issues/16#issuecomment-1945486658)
2. node's sea is interesting, but does not support binary extensions
3. `esbuild` [does not even try to work with top-level `async/await`](https://github.com/evanw/esbuild/issues/253)
4. it can be tricky figuring out where to copy .node extensions to in order for the bundled / packaged binary to find them.
5. while relative paths as arguments works in the original script and the esbuild / commonJS version, the pkg- (er..) _packaged_ binary really wants absolute paths for things like eg a sql script to use as a schema, or a directory to store the database. Relative paths will get resolved to the internal filesystem instead.
6. this repo uses a magical set of files I [found on the internet](https://github.com/zwave-js/zwave-js-ui/blob/master/esbuild.js) that do all the esbuild heavy lifting. This stuff should probably get baked into proper tooling, but the pool of people using esbuild -> pkg seems fairly niche right now.
