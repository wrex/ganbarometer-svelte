/*
 * @jest-environment jsdom
 */

import SettingsForm from "./SettingsForm.svelte";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { settings } from "../store/stores";
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
    let apiKeyInput;
    let retrieveDaysInput;
    let reviewsPerInput;
    let apprenticeItemsInput;
    let acceptableMissesInput;
    let newKanjiWeightInput;
    let excessMissWeightInput;
    let saveButton;

    // Setup a form with valid input values
    const setup = () => {
      render(SettingsForm);
      apiKeyInput = screen.getByLabelText(/api key/i);
      retrieveDaysInput = screen.getByLabelText(/days to retrieve/i);
      reviewsPerInput = screen.getByLabelText(/reviews per/i);
      apprenticeItemsInput = screen.getByLabelText(/apprentice items/i);
      acceptableMissesInput = screen.getByLabelText(
        /acceptable percentage of misses/i
      );
      newKanjiWeightInput = screen.getByLabelText(/new kanji/i);
      excessMissWeightInput = screen.getByLabelText(/excess misses/i);

      saveButton = screen.getByRole("button", { name: "Save" });
      userEvent.type(apiKeyInput, "78ca70da-d268-4100-96ad-696014a53231");
      userEvent.type(reviewsPerInput, "150");
      userEvent.type(retrieveDaysInput, "3");
      userEvent.type(apprenticeItemsInput, "100");
      userEvent.type(acceptableMissesInput, "20");
      userEvent.type(newKanjiWeightInput, "0.05");
      userEvent.type(excessMissWeightInput, "0.03");
      inputs = {
        apiKeyInput: apiKeyInput,
        retrieveDaysInput: retrieveDaysInput,
        reviewsPerInput: reviewsPerInput,
        apprenticeItemsInput: apprenticeItemsInput,
        acceptableMissesInput: acceptableMissesInput,
        newKanjiWeightInput: newKanjiWeightInput,
        excessMissWeightInput: excessMissWeightInput,
      };
    };

    it("does not allow an invalid API key", async () => {
      setup();
      await userEvent.type(apiKeyInput, "invalid");
      await userEvent.click(saveButton);
      const errMessage = await screen.findByText(/invalid api token/i);
      expect(errMessage).toBeInTheDocument();
    });

    it("saves valid form to settings store", async () => {
      setup();
      await userEvent.click(saveButton);
      await waitFor(() => {
        const stored = JSON.parse(window.localStorage.getItem("gbSettings"));
        expect(stored.apiKey).toEqual("78ca70da-d268-4100-96ad-696014a53231");
      });
    });

    describe("Text and number input field validations", () => {
      test.each`
        input                      | inputValue     | errorMsg
        ${"apiKeyInput"}           | ${""}          | ${"required"}
        ${"apiKeyInput"}           | ${"l33th4x0r"} | ${"invalid"}
        ${"retrieveDaysInput"}     | ${"dog"}       | ${"must be a number"}
        ${"retrieveDaysInput"}     | ${"-1"}        | ${"between 1 and 7"}
        ${"retrieveDaysInput"}     | ${"0"}         | ${"between 1 and 7"}
        ${"retrieveDaysInput"}     | ${"8"}         | ${"between 1 and 7"}
        ${"reviewsPerInput"}       | ${"dog"}       | ${"must be a number"}
        ${"reviewsPerInput"}       | ${"-1"}        | ${"between 10 and 500"}
        ${"reviewsPerInput"}       | ${"0"}         | ${"between 10 and 500"}
        ${"reviewsPerInput"}       | ${"9"}         | ${"between 10 and 500"}
        ${"reviewsPerInput"}       | ${"501"}       | ${"between 10 and 500"}
        ${"apprenticeItemsInput"}  | ${"dog"}       | ${"must be a number"}
        ${"apprenticeItemsInput"}  | ${"-1"}        | ${"between 10 and 300"}
        ${"apprenticeItemsInput"}  | ${"0"}         | ${"between 10 and 300"}
        ${"apprenticeItemsInput"}  | ${"9"}         | ${"between 10 and 300"}
        ${"apprenticeItemsInput"}  | ${"301"}       | ${"between 10 and 300"}
        ${"acceptableMissesInput"} | ${"dog"}       | ${"must be a number"}
        ${"acceptableMissesInput"} | ${"-1"}        | ${"between 0 and 30"}
        ${"acceptableMissesInput"} | ${"31"}        | ${"between 0 and 30"}
        ${"newKanjiWeightInput"}   | ${"dog"}       | ${"must be a number"}
        ${"newKanjiWeightInput"}   | ${"-1"}        | ${"between 0.01 and 0.1"}
        ${"newKanjiWeightInput"}   | ${"0"}         | ${"between 0.01 and 0.1"}
        ${"newKanjiWeightInput"}   | ${"1"}         | ${"between 0.01 and 0.1"}
        ${"newKanjiWeightInput"}   | ${"0.11"}      | ${"between 0.01 and 0.1"}
        ${"excessMissWeightInput"} | ${"dog"}       | ${"must be a number"}
        ${"excessMissWeightInput"} | ${"-1"}        | ${"between 0.01 and 0.1"}
        ${"excessMissWeightInput"} | ${"0"}         | ${"between 0.01 and 0.1"}
        ${"excessMissWeightInput"} | ${"1"}         | ${"between 0.01 and 0.1"}
        ${"excessMissWeightInput"} | ${"0.11"}      | ${"between 0.01 and 0.1"}
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
