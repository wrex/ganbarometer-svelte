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
    let saveButton;
    const setup = async () => {
      render(SettingsForm);
      apiKeyInput = screen.getByLabelText(/api key/i);
      retrieveDaysInput = screen.getByLabelText(/days to retrieve/i);
      inputs = {
        apiKeyInput: apiKeyInput,
        retrieveDaysInput: retrieveDaysInput,
      };
      saveButton = screen.getByRole("button", { name: "Save" });
      await userEvent.type(apiKeyInput, "78ca70da-d268-4100-96ad-696014a53231");
      await userEvent.type(retrieveDaysInput, "3");
    };

    it("does not allow an invalid API key", async () => {
      setup();
      await userEvent.type(apiKeyInput, "invalid");
      await userEvent.click(saveButton);
      const errMessage = await screen.findByText(/invalid api token/i);
      expect(errMessage).toBeInTheDocument();
    });

    it("saves a valid API key to settings store", async () => {
      // Aaaaaaand it's failing again. WHAT IS GOING ON?!!!!
      setup();
      await userEvent.type(apiKeyInput, "78ca70da-d268-4100-96ad-696014a53231");
      await userEvent.click(saveButton);
      await waitFor(() => {
        const stored = JSON.parse(window.localStorage.getItem("gbSettings"));
        expect(stored.apiKey).toEqual("78ca70da-d268-4100-96ad-696014a53231");
      });
    });

    describe("Validations", () => {
      test.each`
        input                  | inputValue     | errorMsg
        ${"apiKeyInput"}       | ${"l33th4x0r"} | ${"invalid"}
        ${"retrieveDaysInput"} | ${"-1"}        | ${"between 1 and 7"}
        ${"retrieveDaysInput"} | ${"8"}         | ${"between 1 and 7"}
      `(
        "$input reports '$errorMsg' for '$inputValue'",
        async ({ input, inputValue, errorMsg }) => {
          setup();
          await userEvent.type(inputs[input], inputValue);
          await userEvent.click(saveButton);
          const errMessage = await screen.findByText(new RegExp(errorMsg, "i"));
          expect(errMessage).toBeInTheDocument();
        }
      );
    });
  });
});
