/*
 * @jest-environment jsdom
 */

import SettingsForm from "./SettingsForm.svelte";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SETTINGSKEY } from "../store/stores";

const renderIt = () => {
  render(SettingsForm, {
    modal: {
      hide: () => {
        return;
      },
    },
  });
};

describe("Settings Form", () => {
  describe("layout", () => {
    renderIt();
    it("has a button to save settings", () => {
      const button = screen.getByRole("button", {
        name: /save/i,
      });
      expect(button).toBeInTheDocument();
    });
    it("has a button to reset settings", () => {
      renderIt();
      const button = screen.getByRole("button", {
        name: /default/i,
      });
      expect(button).toBeInTheDocument();
    });

    // ${"bgnd"}
    // ${"track"}
    // ${"text"}
    // ${"hltext"}
    // ${"fill"}
    // ${"warn"}
    // ${"hltrack"}
    // ${"number of apprentice"}

    // ${"new kanji"}
    // ${"new vocab"}
    // ${"target speed"}
    // ${"MAD cutoff"}
    // ${"target reviews-per"}

    describe("renders Ganbarometer Settings by default", () => {
      test.each`
        inputText
        ${"target minimum"}
        ${"target maximum"}
      `("renders an input element for '$inputText'", ({ inputText }) => {
        renderIt();
        const elem = screen.getByRole("heading", {
          name: new RegExp(inputText, "i"),
        });
        expect(elem).toBeInTheDocument();
      });

      test.each`
        inputText
        ${"below"}
        ${"in range"}
        ${"above"}
      `("renders an input element for '$inputText'", ({ inputText }) => {
        renderIt();
        const elem = screen.getByRole("columnheader", {
          name: new RegExp(inputText, "i"),
        });
        expect(elem).toBeInTheDocument();
      });

      it("Includes settings for the Weights", () => {
        renderIt();
        const weights = screen.getAllByText("Weight");
        expect(weights.length).toBeGreaterThan(0);
      });

      it("Includes settings for what to quiz", () => {
        renderIt();
        const quiz = screen.getByText("Quiz?");
        expect(quiz).toBeInTheDocument();
      });
    });
  });

  describe("interaction", () => {
    let inputs;
    let saveButton;

    // Setup a form with valid input values, and grab the inputs
    const setup = () => {
      const { debug } = renderIt();

      inputs = {
        // retrieveDays: screen.getByLabelText(/days to retrieve/i),
        reviewsPer: screen.getByLabelText(/target reviews-per/i),
        apprenticeItems: screen.getByLabelText(/number of apprentice/i),
        newRWeight: screen.getByLabelText(/new radical/i),
        newKWeight: screen.getByLabelText(/new kanji/i),
        newVWeight: screen.getByLabelText(/new vocab/i),
      };

      saveButton = screen.getByRole("button", { name: /save/i });
    };

    describe("settings in localstorage", () => {
      // clear localstorage before each test!
      beforeEach(() => {
        localStorage.removeItem(SETTINGSKEY);
      });

      xit("stores values to localstorage", async () => {
        setup();
        userEvent.clear(inputs.newKWeight);
        userEvent.type(inputs.newKWeight, "2.5");
        userEvent.click(saveButton);
        await waitFor(() => {
          const stored = JSON.parse(localStorage.getItem(SETTINGSKEY));
          expect(stored).toEqual("2.5");
        });
      });

      test.skip.each`
        input           | value
        ${"newKWeight"} | ${"2.5"}
      `("$input stores $value to localstorage", async ({ input, value }) => {
        setup();
        userEvent.clear(inputs[input]);
        userEvent.type(inputs[input], value);
        userEvent.click(saveButton);
        await waitFor(() => {
          const stored = JSON.parse(localStorage.getItem(SETTINGSKEY));
          console.log(stored);
          expect(stored[input]).toEqual(value);
        });
      });
    });

    // ${"retrieveDays"}     | ${"dog"}   | ${"must be a number"}
    // ${"retrieveDays"}     | ${"-1"}    | ${"between 1 and 7"}
    // ${"retrieveDays"}     | ${"0"}     | ${"between 1 and 7"}
    // ${"retrieveDays"}     | ${"8"}     | ${"between 1 and 7"}

    describe("Text and number input field validations", () => {
      test.skip.each`
        input                 | inputValue | errorMsg
        ${"reviewsPer"}       | ${"dog"}   | ${"must be a number"}
        ${"reviewsPer"}       | ${"-1"}    | ${"between 10 and 500"}
        ${"reviewsPer"}       | ${"0"}     | ${"between 10 and 500"}
        ${"reviewsPer"}       | ${"9"}     | ${"between 10 and 500"}
        ${"reviewsPer"}       | ${"501"}   | ${"between 10 and 500"}
        ${"apprenticeItems"}  | ${"dog"}   | ${"must be a number"}
        ${"apprenticeItems"}  | ${"-1"}    | ${"between 10 and 300"}
        ${"apprenticeItems"}  | ${"0"}     | ${"between 10 and 300"}
        ${"apprenticeItems"}  | ${"9"}     | ${"between 10 and 300"}
        ${"apprenticeItems"}  | ${"301"}   | ${"between 10 and 300"}
        ${"acceptableMisses"} | ${"dog"}   | ${"must be a number"}
        ${"acceptableMisses"} | ${"-1"}    | ${"between 0 and 30"}
        ${"acceptableMisses"} | ${"31"}    | ${"between 0 and 30"}
        ${"newKanjiWeight"}   | ${"dog"}   | ${"must be a number"}
        ${"newKanjiWeight"}   | ${"-1"}    | ${"between 0.01 and 0.1"}
        ${"newKanjiWeight"}   | ${"0"}     | ${"between 0.01 and 0.1"}
        ${"newKanjiWeight"}   | ${"1"}     | ${"between 0.01 and 0.1"}
        ${"newKanjiWeight"}   | ${"0.11"}  | ${"between 0.01 and 0.1"}
        ${"excessMissWeight"} | ${"dog"}   | ${"must be a number"}
        ${"excessMissWeight"} | ${"-1"}    | ${"between 0.01 and 0.1"}
        ${"excessMissWeight"} | ${"0"}     | ${"between 0.01 and 0.1"}
        ${"excessMissWeight"} | ${"1"}     | ${"between 0.01 and 0.1"}
        ${"excessMissWeight"} | ${"0.11"}  | ${"between 0.01 and 0.1"}
      `(
        "$input reports '$errorMsg' for '$inputValue'",
        async ({ input, inputValue, errorMsg }) => {
          setup();
          await userEvent.clear(inputs[input]);
          if (inputValue !== "") {
            await userEvent.type(inputs[input], inputValue);
          }
          await userEvent.click(saveButton);
          const errMessage = await screen.findByText(new RegExp(errorMsg, "i"));
          expect(errMessage).toBeInTheDocument();
        }
      );
    });
  });
});
