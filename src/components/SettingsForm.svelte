<script type="ts">
  import {createForm} from 'svelte-forms-lib';
  import * as yup from 'yup';
  import { settings } from '../store/stores';
  // import * as api from "../API/core";

  const storedSettings = JSON.parse(window.localStorage.getItem("gbSettings"));

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: {
      apiKey: "",
      retrieveDays: "",
    },
    validationSchema: yup.object().shape({
      apiKey: yup
        .string()
        .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid API token!")
        .required(),
      retrieveDays: yup
        .number()
        .min(1, "Must be between 1 and 7")
        .max(7, "Must be between 1 and 7")
        .required()
    }),
    onSubmit: values => {
      settings.set(values);
    }
  });

</script>

<form on:click={handleSubmit} aria-label="Settings Form">
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
    <input type="color" name="bgColor" id="bgColor" value="#ff0000" />

    <label for="fillColor">
      Fill
    </label>
    <input type="color" name="fillColor" id="fillColor" value="red"/>

    <label for="warnColor">
      Warning
    </label>
    <input type="color" name="warnColor" id="warnColor" value="red"/>

    <label for="alertColor">
      Alert
    </label>
    <input type="color" name="alertColor" id="alertColor" value="red"/>
  </fieldset>

  <fieldset>
    <legend>Pace Gauge</legend>
    <div >
      <label for="sessionsPerDay">
        Sessions/day
      </label>
      <input type="radio" name="reviewSessions" id="sessionsPerDay" value="sessions"/>
      <label for="reviewsPerDay">
        Reviews/day
      </label>
      <input type="radio" name="reviewSessions" id="reviewsPerDay" value="reviews" />
    </div>


    <label for="reviewsPer">Desired reviews per day or session</label>
    <input type="number" name="reviewsPer" id="reviewsPer">
  </fieldset>


  <fieldset>
    <legend>Difficulty Gauge</legend>
    <label for="apprenticeItems">Desired number of apprentice items</label>
    <input type="number" name="apprenticeItems" id="apprenticeItems">

    <label for="acceptableMisses">Acceptable percentage of misses</label>
    <input type="number" name="acceptableMisses" id="acceptableMisses">

    <label for="newKanjiWeight">Weighting factor for new kanji</label>
    <input type="number" name="newKanjiWeight" id="newKanjiWeight">

    <label for="excessMissWeight">Weighting factor for excess misses</label>
    <input type="number" name="excessMissWeight" id="excessMissWeight">
  </fieldset>

  <fieldset>
    <legend>Interval Chart</legend>
    <label for="barStarts">Starting seconds for each bar</label>
    <input type="string" name="barStarts" id="barStarts">
    
    <br>
    <label for="barLabels">Labels for each bar</label>
    <input type="string" name="barLabels" id="barLabels">
  </fieldset>
  

  <!-- <button on:click={handleSubmit}>Save</button> -->
  <button type="submit">Save</button>
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

  /* input {
    display: block;
  } */

  input[type="radio"] {
    display: inline-block;
  }

  input[type="color"] {
    display: inline-block;
    width: 20px;
  }
</style>