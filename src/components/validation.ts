import { create, enforce, test, only } from "vest";

export const validate = create(
  "Settings Form",
  (data = {}, field = undefined) => {
    only(field);
    test("gbMinTarget", "Min can't exceed max", () => {
      enforce(data.gbMinTarget).lt(data.gbMaxTarget);
    });
    test("gbMaxTarget", "Min can't exceed max", () => {
      enforce(data.gbMinTarget).lt(data.gbMaxTarget);
    });
    test("targetQPM", "Not between min&max", () => {
      enforce(data.targetQPM).gt(data.minQPM);
      enforce(data.targetQPM).lt(data.maxQPM);
    });
    test("minQPM", "Min can't exceed target", () => {
      enforce(data.minQPM).lt(data.targetQPM);
    });
    test("minQPM", "Min can't exceed max", () => {
      enforce(data.minQPM).lt(data.maxQPM);
    });
    test("maxQPM", "Target can't exceed max", () => {
      enforce(data.maxQPM).gt(data.targetQPM);
    });
    test("maxQPM", "Min can't exceed max", () => {
      enforce(data.maxQPM).gt(data.targetQPM);
    });
    test("rpdMin", "Min can't exceed max", () => {
      enforce(data.rpdMin).lt(data.rpdMax);
    });
    test("rpdMax", "Min can't exceed max", () => {
      enforce(data.rpdMin).lt(data.rpdMax);
    });
  }
);
