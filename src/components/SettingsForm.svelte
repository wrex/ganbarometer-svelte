<script type="ts">
  import {createForm} from 'svelte-forms-lib';
  import * as yup from 'yup';
  import { settings } from '../store/stores';
import { getModal } from './Modal.svelte';
  // import * as api from "../API/core";

  const storedSettings = JSON.parse(window.localStorage.getItem("gbSettings"));

  const { form, errors, state, handleChange, handleSubmit, isValid } = createForm({
    initialValues: {
      apiKey: "",
      retrieveDays: "3",
      reviewsPer: "150",
      apprenticeItems: "100",
      acceptableMisses: "20",
      newKanjiWeight: "0.05",
      excessMissWeight: "0.03",
      bgColor: "#cccccc",
      fillColor: "#00ff00",
      warnColor: "#ffff00",
      alertColor: "#ff0000",
      reviewSessions: "sessions",
    },
    validationSchema: yup.object().shape({
      apiKey: yup
        .string()
        .nullable()
        .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid API token")
        .required("Required field"),
      retrieveDays: yup
        .number()
        .typeError("Must be a number")
        .nullable()
        .min(1, "Must be between 1 and 7")
        .max(7, "Must be between 1 and 7"),
      reviewsPer: yup
        .number()
        .typeError("Must be a number")
        .nullable()
        .min(10, "Must be between 10 and 500")
        .max(500, "Must be between 10 and 500"),
      apprenticeItems: yup
        .number()
        .typeError("Must be a number")
        .nullable()
        .min(10, "Must be between 10 and 300")
        .max(300, "Must be between 10 and 300"),
      acceptableMisses: yup
        .number()
        .typeError("Must be a number")
        .nullable()
        .min(0, "Must be between 0 and 30")
        .max(30, "Must be between 0 and 30"),
      newKanjiWeight: yup
        .number()
        .typeError("Must be a number")
        .min(0.01, "Must be between 0.01 and 0.1")
        .max(0.1, "Must be between 0.01 and 0.1"),
      excessMissWeight: yup
        .number()
        .typeError("Must be a number")
        .min(0.01, "Must be between 0.01 and 0.1")
        .max(0.1, "Must be between 0.01 and 0.1"),
      bgColor: yup.string(),
      fillColor: yup.string(),
      warnColor: yup.string(),
      alertColor: yup.string(),
      reviewSessions: yup.string(),
    }),
    onSubmit: values => {
      settings.set(values);
      getModal().close();
    }
  });

</script>

<form on:submit={handleSubmit} aria-label="Settings Form">
  <fieldset>
    <legend>General</legend>
    <label class="form-label" for="apiKey">API Key:</label>
    <input 
    class="form-control"
    type="text" 
    id="apiKey" 
    on:change={handleChange}
    on:blur={handleChange}
    bind:value={$form.apiKey}
    />
    {#if $errors.apiKey}
    <small>{$errors.apiKey}</small>
    {/if}
    
    <label for="retrieveDays">
      Number of days to retrieve reviews: 
    </label>
    <input 
      type="number" 
      id="retrieveDays" 
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.retrieveDays}
    />
    {#if $errors.retrieveDays}
    <small>{$errors.retrieveDays}</small>
    {/if}
    
    <br>
    <label for="bgColor">
      Background
    </label>
    <input 
      type="color" 
      name="bgColor" 
      id="bgColor" 
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.bgColor}
    />

    <label for="fillColor">
      Fill
    </label>
    <input 
      type="color" 
      name="fillColor" 
      id="fillColor" 
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.fillColor}
    />

    <label for="warnColor">
      Warning
    </label>
    <input 
      type="color" 
      name="warnColor" 
      id="warnColor" 
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.warnColor}
    />

    <label for="alertColor">
      Alert
    </label>
    <input 
      type="color" 
      name="alertColor" 
      id="alertColor"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.alertColor}
    />
  </fieldset>

  <fieldset>
    <legend>Pace Gauge</legend>
    <div >
      <label for="sessionsPerDay">
        Sessions/day
      </label>
      <input 
        type="radio" 
        name="reviewSessions" 
        id="sessionsPerDay" 
        bind:group={$form.reviewSessions}
        on:change={handleChange}
        on:blur={handleChange}
        value="sessions"
      />
      <label for="reviewsPerDay">
        Reviews/day
      </label>
      <input 
        type="radio" 
        name="reviewSessions" 
        id="reviewsPerDay" 
        bind:group={$form.reviewSessions}
        on:change={handleChange}
        on:blur={handleChange}
        value="reviews"
      />
    </div>


    <label for="reviewsPer">Desired reviews per day or session</label>
    <input 
      type="number" 
      name="reviewsPer" 
      id="reviewsPer"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.reviewsPer}
    />
    {#if $errors.reviewsPer}
    <small>{$errors.reviewsPer}</small>
    {/if}
  </fieldset>


  <fieldset>
    <legend>Difficulty Gauge</legend>
    <label for="apprenticeItems">Desired number of apprentice items</label>
    <input 
      type="number" 
      name="apprenticeItems" 
      id="apprenticeItems"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.apprenticeItems}
    />
    {#if $errors.apprenticeItems}
    <small>{$errors.apprenticeItems}</small>
    {/if}

    <label for="acceptableMisses">Acceptable percentage of misses</label>
    <input 
      type="number" 
      name="acceptableMisses" 
      id="acceptableMisses"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.acceptableMisses}
    />
    {#if $errors.acceptableMisses}
    <small>{$errors.acceptableMisses}</small>
    {/if}

    <label for="newKanjiWeight">Weighting factor for new kanji</label>
    <input 
      type="number" 
      name="newKanjiWeight" 
      id="newKanjiWeight"
      step="0.01"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.newKanjiWeight}
    />
    {#if $errors.newKanjiWeight}
    <small>{$errors.newKanjiWeight}</small>
    {/if}

    <label for="excessMissWeight">Weighting factor for excess misses</label>
    <input 
      type="number" 
      name="excessMissWeight" 
      id="excessMissWeight"
      step="0.01"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.excessMissWeight}
    />
    {#if $errors.excessMissWeight}
    <small>{$errors.excessMissWeight}</small>
    {/if}
  </fieldset>

  <fieldset>
    <legend>Interval Chart</legend>
    <label for="barStarts">Starting seconds for each bar</label>
    <input type="string" name="barStarts" id="barStarts"/>
    
    <br>
    <label for="barLabels">Labels for each bar</label>
    <input type="string" name="barLabels" id="barLabels"/>
  </fieldset>
  

  <!-- <button on:click={handleSubmit}>Save</button> -->
  <button disabled={!$isValid} type="submit">Save</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 80vh;
    overflow-y: scroll;
  }
  label {
    display: inline-block;
    text-align: right;
  }
  button {
    padding: 0 1em;
  }
  small {
    display: block;
    color: red;
  }

  /* input {
    display: block;
  } */

  input[type="radio"] {
    display: inline-block;
  }

  input[type="color"] {
    display: inline-block;
    width: 3rem;
    min-height: 20px;
    padding: 0;
    margin: 5px;
  }
</style>