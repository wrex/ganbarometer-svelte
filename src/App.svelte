<script lang="ts">
  import Ganbarometer from "./components/Ganbarometer.svelte";
  import Settings from "./components/Settings.svelte";

  import * as API from "./API/core";

  let apiKey = API.getApiKey();
</script>

<section data-testid="ganbarometer">
    <Ganbarometer />
    <div class="footer">
      The API key is '{apiKey}'
      <Settings />
    </div>
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
    padding: 0;
  }
  .footer {
    grid-column: 1 / span 6;
    text-align: center;
    margin: 0;
  }
</style>