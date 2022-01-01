<script type= "ts">
  let something = "something";
</script>

<div class="settingsComp">

  <h4>MAD cutoff</h4>
  <input id="madCutoff" type="range">
  <label for="madCutoff">10</label>

  <hr>

  <h4>Timezone Offset</h4>
  <input id="tzOffset" type="range">
  <label for="tzOffset">0 hours</label>
</div>
        
<style>
  h4 {
    font-size: small;
    margin: 0;
    grid-column: 1 / span 2;
    text-align: right;
  }

  label {
    grid-column: 5 / span 2;
    margin: 0;
  }
  input[type="range"] {
    grid-column: 3 / span 2;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    margin: 0;
  }

  hr {
    grid-column: 1 / span 6;
  }
</style>
        