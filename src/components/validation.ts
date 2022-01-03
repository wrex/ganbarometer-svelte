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
    test("targetSpeed", "Not between min&max", () => {
      enforce(data.targetSpeed).gt(data.speedMin);
      enforce(data.targetSpeed).lt(data.speedMax);
    });
    test("speedMin", "Min can't exceed target", () => {
      enforce(data.speedMin).lt(data.targetSpeed);
    });
    test("speedMin", "Min can't exceed max", () => {
      enforce(data.speedMin).lt(data.speedMax);
    });
    test("speedMax", "Target can't exceed max", () => {
      enforce(data.speedMax).gt(data.targetSpeed);
    });
    test("speedMax", "Min can't exceed max", () => {
      enforce(data.speedMax).gt(data.targetSpeed);
    });
    test("rpdMin", "Min can't exceed max", () => {
      enforce(data.rpdMin).lt(data.rpdMax);
    });
    test("rpdMax", "Min can't exceed max", () => {
      enforce(data.rpdMin).lt(data.rpdMax);
    });
  }
);
