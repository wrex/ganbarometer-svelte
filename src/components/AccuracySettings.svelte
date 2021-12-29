<script type= "ts">
  let something = "something";
</script>

<div class="settingsComp">

  <div class=slider>
    <h4>Target Reviews-per-day</h4>
    <label>
      <input id="apprTarget" type="range"><span class="value">150 reviews</span>
    </label>
  </div>

  <hr>

  <div class=slider>
    <h4>Warning Level</h4>
    <label for="apprTarget">
      <input id="apprTarget" type="range"><span class="value">20% min</span>
    </label>
  </div>
</div>
        
<style>
  .slider {
    display: grid;
    margin-inline: 10px;
    grid-template-columns: repeat(6, 1fr);
    column-gap: 10px;
  }

  .slider h4 {
    font-size: small;
    margin: 0;
    grid-column: 1 / span 2;
    text-align: right;
  }

  .slider label {
    grid-column: 3 / span 4;
  }

  .value {
    font-size: small;
    padding-left: 10px;
  }

  hr {
    margin-inline: 2em;
  }

  input {
    width: 3em;
    text-align: center;
    vertical-align: middle;
    margin: 0;
  }
 .slider input {
   width: 160px;
 }

</style>