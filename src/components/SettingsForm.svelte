<script type="ts">
  import {createForm} from 'svelte-forms-lib';
  import * as yup from 'yup';
  import { settings } from '../store/stores';

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: {
      apiKey: "",
    },
    validationSchema: yup.object().shape({
      apiKey: yup
        .string()
        .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
        .required()
    }),
    onSubmit: values => {
      // alert(JSON.stringify(values))
      settings.set({apiKey: values.apiKey});
    }
  });
</script>

<form on:submit={handleSubmit} aria-label="Settings Form">
  <label for="apiKey">API Key: </label>
  <input 
    type="text" 
    id="apiKey" 
    on:change={handleChange}
    on:blur={handleChange}
    bind:value={$form.apiKey}
  />
  {#if $errors.apiKey}
    <small>Invalid token!</small>
  {/if}

  <label for="retrieveDays">
    Number of days to retrieve reviews: 
  </label>
  <input type="text" id="retrieveDays" />

  <div>
    <p>Display reviews or sessions per day?</p>
    <label for="sessionsPerDay">
      Sessions/day
    </label>
    <input type="radio" name="reviewSessions" id="sessionsPerDay" value="sessions"/>

    <label for="reviewsPerDay">
      Reviews/day
    </label>
    <input type="radio" name="reviewSessions" id="reviewsPerDay" value="reviews" />
  </div>

  <div>
    <p>Theming colors</p>
    <label for="bgColor">
      Background
    </label>
    <input type="color" name="bgColor" id="bgColor" value="bgColor"/>

    <label for="fillColor">
      Fill
    </label>
    <input type="color" name="fillColor" id="fillColor" value="fillColor"/>

    <label for="warnColor">
      Warning
    </label>
    <input type="color" name="warnColor" id="warnColor" value="warnColor"/>

    <label for="alertColor">
      Alert
    </label>
    <input type="color" name="alertColor" id="alertColor" value="alertColor"/>
  </div>

  <label for="reviewsPer">Desired reviews per day or session</label>
  <input type="number" name="reviewsPer" id="reviewsPer">

  <label for="apprenticeItems">Desired number of apprentice items</label>
  <input type="number" name="apprenticeItems" id="apprenticeItems">

  <label for="acceptableMisses">Acceptable percentage of misses</label>
  <input type="number" name="acceptableMisses" id="acceptableMisses">

  <label for="newKanjiWeight">Weighting factor for new kanji</label>
  <input type="number" name="newKanjiWeight" id="newKanjiWeight">

  <label for="excessMissWeight">Weighting factor for excess misses</label>
  <input type="number" name="excessMissWeight" id="excessMissWeight">

  <button type="submit">Save</button>
</form>

<style>
  form {
    box-sizing: border-box;
    width: 800px;
  }
  label {
    display: inline;
  }
  input[type="text"] {
    display: block;
    width: 400px;
  }
</style>