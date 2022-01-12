/*
 * @jest-environment jsdom
 */

import SettingsForm from "./SettingsForm.svelte";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SETTINGSKEY } from "../store/stores";

let gbNav, speedNav, appearanceNav, advancedNav;

const renderIt = () => {
  render(SettingsForm, {
    modal: {
      hide: () => {
        return;
      },
    },
  });
  gbNav = screen.getByRole("listitem", {
    name: "Ganbarometer",
  });
  speedNav = screen.getByRole("listitem", {
    name: "Speed/Reviews",
  });
  appearanceNav = screen.getByRole("listitem", {
    name: "Appearance",
  });
  advancedNav = screen.getByRole("listitem", {
    name: "Advanced",
  });
};

describe("Settings Form", () => {
  describe("layout", () => {
    it("has a button to save settings", () => {
      renderIt();
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

    test.each`
      inputText
      ${"Ganbarometer"}
      ${"Speed/Reviews"}
      ${"Appearance"}
      ${"Advanced"}
    `("renders a menu link for '$inputText'", ({ inputText }) => {
      renderIt();
      const elem = screen.getByRole("listitem", {
        name: new RegExp(inputText, "i"),
      });
      expect(elem).toBeInTheDocument();
    });

    describe("renders Ganbarometer Settings by default", () => {
      describe("Target range", () => {
        it("Renders a target range slider", () => {
          renderIt();
          const slider = screen.getByRole("heading", {
            name: /target range/i,
          });
          expect(slider).toBeInTheDocument();
        });

        it("Uses the default ganbarometer range", () => {
          renderIt();
          const elem = screen.getByTestId("gbRangeLabel");
          expect(elem.innerHTML).toEqual("130 – 170");
        });

        it("Includes an renders an info button", () => {
          renderIt();
          const btn = screen.getByTestId("gbRangeInfo");
          expect(btn).toBeInTheDocument();
        });

        // This doesn't work. Why not?!!
        xit("Pulls up the info modal when clicked", async () => {
          renderIt();
          const btn = screen.getByTestId("gbRangeInfo");
          userEvent.click(btn);
          const elem = await screen.findByText(/this controls/);
          expect(elem).toBeInTheDocument();
        });
      });

      test.each`
        inputText
        ${"below"}
        ${"in range"}
        ${"above"}
        ${"Radical1-2 Weight"}
        ${"Radical1-2 Quiz"}
        ${"Kanji1-2 Weight"}
        ${"Kanji1-2 Quiz"}
        ${"Vocab1-2 Weight"}
        ${"Vocab1-2 Quiz"}
        ${"Appr3-4"}
        ${"Guru"}
        ${"Master"}
        ${"Enlightened"}
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

    it("Does not render the other dialogs before clicking", () => {
      renderIt();
      const rte = screen.queryByRole("heading", {
        name: /reviews to examine/i,
      });
      const mad = screen.queryByRole("heading", {
        name: /MAD cutoff/i,
      });
      const sample = screen.queryByTestId("colorSample");
      expect(rte).not.toBeInTheDocument();
      expect(mad).not.toBeInTheDocument();
      expect(sample).not.toBeInTheDocument();
    });
  });

  describe("Renders the Speed/Reviews dialog when clicked", () => {
    test.each`
      inputText
      ${"Reviews to examine"}
      ${"Target answer speed"}
      ${"Target daily load"}
    `("has a slider for '$inputText'", async ({ inputText }) => {
      renderIt();
      userEvent.click(speedNav);
      const elem = await screen.findByRole("heading", {
        name: new RegExp(inputText, "i"),
      });
      expect(elem).toBeInTheDocument();
    });
  });

  describe("Renders the Appearance dialog when clicked", () => {
    it("Displays a color sample", async () => {
      renderIt();
      userEvent.click(appearanceNav);
      const sample = await screen.findByTestId("colorSample");
      expect(sample).toBeInTheDocument();
    });

    it("Has buttons for light/dark themes", async () => {
      renderIt();
      userEvent.click(appearanceNav);
      const light = await screen.findByRole("button", {
        name: /light theme/i,
      });
      const dark = await screen.findByRole("button", {
        name: /light theme/i,
      });
      expect(light).toBeInTheDocument();
      expect(dark).toBeInTheDocument();
    });

    test.each`
      inputRE
      ${"bgnd"}
      ${"^track"}
      ${"hltrack"}
      ${"^text"}
      ${"hltext"}
      ${"fill"}
      ${"^warn$"}
    `("Has color pickers for '$inputRE' override", async ({ inputRE }) => {
      renderIt();
      userEvent.click(appearanceNav);
      await screen.findByTestId("colorSample");
      const elem = screen.getByText(new RegExp(inputRE, "i"));
      expect(elem).toBeInTheDocument();
    });
  });

  describe("Renders the Advanced dialog when clicked", () => {
    test.each`
      inputText
      ${"MAD cutoff"}
    `("has a slider for '$inputText'", async ({ inputText }) => {
      renderIt();
      userEvent.click(advancedNav);
      const elem = await screen.findByRole("heading", {
        name: new RegExp(inputText, "i"),
      });
      expect(elem).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    let belowInput;
    let saveButton;

    // Setup a form with valid input values, and grab the inputs
    const setup = () => {
      renderIt();
      (belowInput = screen.getByTestId("belowInput")),
        (saveButton = screen.getByRole("button", { name: /save/i }));
    };

    describe("settings in localstorage", () => {
      // clear localstorage before each test!
      beforeEach(() => {
        localStorage.removeItem(SETTINGSKEY);
      });

      it("stores values to localstorage", async () => {
        setup();
        userEvent.clear(belowInput);
        userEvent.type(belowInput, "Hi Mom");
        userEvent.click(saveButton);
        await waitFor(() => {
          const stored = JSON.parse(localStorage.getItem("gbSettings"));
          expect(stored.belowTerm).toEqual("Hi Mom");
        });
      });
    });
  });
});
