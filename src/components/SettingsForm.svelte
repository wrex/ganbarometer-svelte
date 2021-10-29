<form aria-label="Settings Form">
  <label for="apiKey">API Key: </label>
  <input type="text" id="apiKey" />

  <label for="retrieveDays">
    Number of days to retrieve reviews: 
  </label>
  <input type="text" id="retrieveDays">

  <button>Save</button>
</form>

<style>
  form {
    /* grid-column: 1 / span 6; */
    box-sizing: border-box;
  }
  label {
    display: inline;
  }
  input[type="text"] {
    display: block;
    width: 400px;
  }
</style>