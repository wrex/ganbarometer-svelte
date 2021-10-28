<script>
  import * as API from "../API/core";

  let apiKey = API.getApiKey();
  console.log(`apiKey is: ${apiKey}`);
</script>

<form>
  <label>Enter API key: <input type="text" bind:value={apiKey}></label>
</form>