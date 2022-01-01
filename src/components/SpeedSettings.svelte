<script type= "ts">
  let something = "something";
</script>


<div class="settingsComp">

  <h4>Speed Target</h4>
  <input id="speedTarget" type="range">
  <label for="speedTarget">6.0 seconds</label>

  <hr>

  <h4>Warning Levels</h4>
  <input id="minWarning" type="range">
  <label for="minWarning">20% minimum</label>

  <input id="maxWarning" type="range">
  <label for="maxWarning">80% maximum</label>

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
        