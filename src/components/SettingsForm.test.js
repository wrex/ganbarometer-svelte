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
    let saveButton;

    // Setup a form with valid input values
    const setup = async () => {
      render(SettingsForm);
      apiKeyInput = screen.getByLabelText(/api key/i);
      retrieveDaysInput = screen.getByLabelText(/days to retrieve/i);
      reviewsPerInput = screen.getByLabelText(/reviews per/i);
      apprenticeItemsInput = screen.getByLabelText(/apprentice items/i);
      inputs = {
        apiKeyInput: apiKeyInput,
        retrieveDaysInput: retrieveDaysInput,
        reviewsPerInput: reviewsPerInput,
        apprenticeItemsInput: apprenticeItemsInput,
      };
      saveButton = screen.getByRole("button", { name: "Save" });
      await userEvent.type(apiKeyInput, "78ca70da-d268-4100-96ad-696014a53231");
      await userEvent.type(retrieveDaysInput, "3");
      await userEvent.type(reviewsPer, "150");
      await userEvent.type(apprenticeItems, "100");
    };

    it("does not allow an invalid API key", async () => {
      await setup();
      await userEvent.type(apiKeyInput, "invalid");
      await userEvent.click(saveButton);
      const errMessage = await screen.findByText(/invalid api token/i);
      expect(errMessage).toBeInTheDocument();
    });

    it("saves valid form to settings store", async () => {
      await setup();
      await userEvent.click(saveButton);
      await waitFor(() => {
        const stored = JSON.parse(window.localStorage.getItem("gbSettings"));
        expect(stored.apiKey).toEqual("78ca70da-d268-4100-96ad-696014a53231");
      });
    });

    describe("Text and number input field validations", () => {
      test.each`
        input                     | inputValue     | errorMsg
        ${"apiKeyInput"}          | ${""}          | ${"required"}
        ${"apiKeyInput"}          | ${"l33th4x0r"} | ${"invalid"}
        ${"retrieveDaysInput"}    | ${""}          | ${"required"}
        ${"retrieveDaysInput"}    | ${"-1"}        | ${"between 1 and 7"}
        ${"retrieveDaysInput"}    | ${"0"}         | ${"between 1 and 7"}
        ${"retrieveDaysInput"}    | ${"8"}         | ${"between 1 and 7"}
        ${"reviewsPerInput"}      | ${""}          | ${"required"}
        ${"reviewsPerInput"}      | ${"-1"}        | ${"between 10 and 500"}
        ${"reviewsPerInput"}      | ${"0"}         | ${"between 10 and 500"}
        ${"reviewsPerInput"}      | ${"9"}         | ${"between 10 and 500"}
        ${"reviewsPerInput"}      | ${"501"}       | ${"between 10 and 500"}
        ${"apprenticeItemsInput"} | ${""}          | ${"required"}
        ${"apprenticeItemsInput"} | ${"-1"}        | ${"between 10 and 300"}
        ${"apprenticeItemsInput"} | ${"0"}         | ${"between 10 and 300"}
        ${"apprenticeItemsInput"} | ${"9"}         | ${"between 10 and 300"}
        ${"apprenticeItemsInput"} | ${"301"}       | ${"between 10 and 300"}
      `(
        "$input reports '$errorMsg' for '$inputValue'",
        async ({ input, inputValue, errorMsg }) => {
          await setup();
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
