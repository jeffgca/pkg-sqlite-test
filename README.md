# Node / Tauri Sidecar packaging example

This is a dumb-as-possible example of using node.js as a sidecar process in Tauri.

## Features:

- bundles all JS into a single CommonJS file using esbuild
- builds a binary runnable on macOS using @yao-pkg/pkg
- app-specific handling of the binary extension for better-sqlite3
- relatively simple set of script commands to run

## Notes

This was surprisingly hard to get working nicely, some of the main issues were:

1. `pkg` dfoe snot work well with esm syntax
2. `esbuild` does not even tryo to work with top-level `async/await`
