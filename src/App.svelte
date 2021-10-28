<script lang="ts">
  import Ganbarometer from "./components/Ganbarometer.svelte";
  import KeyForm from "./components/KeyForm.svelte";
  import Settings from "./components/Settings.svelte";

  import * as API from "./API/core";

  let apiKey = API.getApiKey();

  let renderSettings = false;
</script>

<section data-testid="ganbarometer">
  {#if apiKey}
    <Ganbarometer />
    {:else if renderSettings}
    <Settings />
    {:else }
    <KeyForm />
    {/if}
    <p>The API key is '{apiKey}'</p>
</section>


<style>
  section {
    /* border: 1px solid black; */
    background-color: #f4f4f4;
    border-radius: 5px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 150px auto;
    gap: 10px 20px;
    margin: 0 0 20px;
    align-items: center;
    padding: 0 30px 0 0;
  }
  p {
    grid-column: 1 / span 6;
    padding: 0 30px;
    text-align: center;
    margin: 0;
  }
</style>