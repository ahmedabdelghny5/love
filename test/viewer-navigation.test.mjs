import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/viewer-navigation.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
runInNewContext(outputText, { exports });
const { adjacentPhotoIndex, navigationStep } = exports;

test("next after the last of 18 photos wraps to the first", () => {
  assert.equal(adjacentPhotoIndex(17, 1, 18), 0);
});

test("previous from the first photo wraps to the last", () => {
  assert.equal(adjacentPhotoIndex(0, -1, 18), 17);
});

test("navigation moves one position within the selected gallery", () => {
  assert.equal(adjacentPhotoIndex(7, 1, 18), 8);
  assert.equal(adjacentPhotoIndex(7, -1, 18), 6);
});

test("a one-photo gallery never navigates to a missing photo", () => {
  assert.equal(adjacentPhotoIndex(0, 1, 1), 0);
  assert.equal(adjacentPhotoIndex(0, -1, 1), 0);
});

test("Arabic RTL arrows match the gallery reading order", () => {
  assert.equal(navigationStep("ArrowLeft"), 1);
  assert.equal(navigationStep("ArrowRight"), -1);
  assert.equal(navigationStep("Tab"), undefined);
  assert.equal(navigationStep("Escape"), undefined);
});
