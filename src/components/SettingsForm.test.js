/*
 * @jest-environment jsdom
 */

import SettingsForm from "./SettingsForm.svelte";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Settings Form", () => {
  describe("layout", () => {
    it("renders a form with a text input for the API Key", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/api key/i);
      expect(input).toBeInTheDocument();
    });
    it("has a button to save settings", () => {
      render(SettingsForm);
      const button = screen.getByRole("button");
      expect(button.textContent).toBe("Save");
    });
    it("renders an input for the numnber of days to retrieve", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/number of days/i);
      expect(input).toBeInTheDocument();
    });
    it("renders radio buttons for reviews/day or sessions/day", () => {
      render(SettingsForm);
      const option1 = screen.getByLabelText(/reviews\/day/i);
      const option2 = screen.getByLabelText(/sessions\/day/i);
      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();
    });
    it("includes inputs for color theming", () => {
      render(SettingsForm);
      const [bgColor] = screen.getAllByLabelText(/background/i);
      const [fillColor] = screen.getAllByLabelText(/fill/i);
      const [warnColor] = screen.getAllByLabelText(/warning/i);
      const [alertColor] = screen.getAllByLabelText(/alert/i);
      expect(bgColor).toBeInTheDocument();
      expect(fillColor).toBeInTheDocument();
      expect(warnColor).toBeInTheDocument();
      expect(alertColor).toBeInTheDocument();
    });
    it("includes an input for desired number of reviews", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/desired reviews per/i);
      expect(input).toBeInTheDocument();
    });
    it("includes desired number of apprentice items", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/number of apprentice/i);
      expect(input).toBeInTheDocument();
    });
    it("includes an input for percentage of acceptable misses", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/acceptable percentage of misses/i);
      expect(input).toBeInTheDocument();
    });
    it("includes an input for new kanji weighting", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/new kanji/i);
      expect(input).toBeInTheDocument();
    });
    it("includes an input for new extra misses", () => {
      render(SettingsForm);
      const input = screen.getByLabelText(/excess misses/i);
      expect(input).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    let inputs;
    let saveButton;

    // Setup a form with valid input values, and grab the inputs
    const setup = () => {
      const { debug } = render(SettingsForm);

      inputs = {
        apiKey: screen.getByLabelText(/api key/i),
        retrieveDays: screen.getByLabelText(/days to retrieve/i),
        reviewsPer: screen.getByLabelText(/reviews per/i),
        apprenticeItems: screen.getByLabelText(/apprentice items/i),
        acceptableMisses: screen.getByLabelText(
          /acceptable percentage of misses/i
        ),
        newKanjiWeight: screen.getByLabelText(/new kanji/i),
        excessMissWeight: screen.getByLabelText(/excess misses/i),
      };

      saveButton = screen.getByRole("button", { name: "Save" });
      userEvent.type(
        inputs.apiKey,
        "{selectall}78ca70da-d268-4100-96ad-696014a53231"
      );
    };

    describe("settings in localstorage", () => {
      // clear localstorage before each test!
      beforeEach(() => {
        window.localStorage.removeItem("gbSettings");
      });

      test.each`
        input                 | value
        ${"apiKey"}           | ${"ffffffff-d268-4100-96ad-696014a53231"}
        ${"retrieveDays"}     | ${"5"}
        ${"reviewsPer"}       | ${"123"}
        ${"apprenticeItems"}  | ${"231"}
        ${"acceptableMisses"} | ${"17"}
        ${"newKanjiWeight"}   | ${"0.07"}
        ${"excessMissWeight"} | ${"0.08"}
      `("$input stores $value to localstorage", async ({ input, value }) => {
        setup();
        userEvent.clear(inputs[input]);
        userEvent.type(inputs[input], value);
        userEvent.click(saveButton);
        await waitFor(() => {
          const stored = JSON.parse(window.localStorage.getItem("gbSettings"));
          expect(stored[input]).toEqual(value);
        });
      });
    });

    describe("Text and number input field validations", () => {
      test.each`
        input                 | inputValue     | errorMsg
        ${"apiKey"}           | ${""}          | ${"required"}
        ${"apiKey"}           | ${"l33th4x0r"} | ${"invalid"}
        ${"retrieveDays"}     | ${"dog"}       | ${"must be a number"}
        ${"retrieveDays"}     | ${"-1"}        | ${"between 1 and 7"}
        ${"retrieveDays"}     | ${"0"}         | ${"between 1 and 7"}
        ${"retrieveDays"}     | ${"8"}         | ${"between 1 and 7"}
        ${"reviewsPer"}       | ${"dog"}       | ${"must be a number"}
        ${"reviewsPer"}       | ${"-1"}        | ${"between 10 and 500"}
        ${"reviewsPer"}       | ${"0"}         | ${"between 10 and 500"}
        ${"reviewsPer"}       | ${"9"}         | ${"between 10 and 500"}
        ${"reviewsPer"}       | ${"501"}       | ${"between 10 and 500"}
        ${"apprenticeItems"}  | ${"dog"}       | ${"must be a number"}
        ${"apprenticeItems"}  | ${"-1"}        | ${"between 10 and 300"}
        ${"apprenticeItems"}  | ${"0"}         | ${"between 10 and 300"}
        ${"apprenticeItems"}  | ${"9"}         | ${"between 10 and 300"}
        ${"apprenticeItems"}  | ${"301"}       | ${"between 10 and 300"}
        ${"acceptableMisses"} | ${"dog"}       | ${"must be a number"}
        ${"acceptableMisses"} | ${"-1"}        | ${"between 0 and 30"}
        ${"acceptableMisses"} | ${"31"}        | ${"between 0 and 30"}
        ${"newKanjiWeight"}   | ${"dog"}       | ${"must be a number"}
        ${"newKanjiWeight"}   | ${"-1"}        | ${"between 0.01 and 0.1"}
        ${"newKanjiWeight"}   | ${"0"}         | ${"between 0.01 and 0.1"}
        ${"newKanjiWeight"}   | ${"1"}         | ${"between 0.01 and 0.1"}
        ${"newKanjiWeight"}   | ${"0.11"}      | ${"between 0.01 and 0.1"}
        ${"excessMissWeight"} | ${"dog"}       | ${"must be a number"}
        ${"excessMissWeight"} | ${"-1"}        | ${"between 0.01 and 0.1"}
        ${"excessMissWeight"} | ${"0"}         | ${"between 0.01 and 0.1"}
        ${"excessMissWeight"} | ${"1"}         | ${"between 0.01 and 0.1"}
        ${"excessMissWeight"} | ${"0.11"}      | ${"between 0.01 and 0.1"}
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
