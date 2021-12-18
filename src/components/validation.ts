import { create, enforce, test, only } from "vest";

export const validate = create(
  "Settings Form",
  (data = {}, field = undefined) => {
    only(field);
    test("newRWeight", "Must be between 0 and 3", () => {
      enforce(data.newRWeight).lte(0);
      enforce(data.newRWeight).gte(3);
    });
    test("newKWeight", "Must be between 0 and 3", () => {
      enforce(data.newKWeight).lte(0);
      enforce(data.newKWeight).gte(3);
    });
    test("newVWeight", "Must be between 0 and 3", () => {
      enforce(data.newVWeight).lte(0);
      enforce(data.newVWeight).gte(3);
    });
  }
);
