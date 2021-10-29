<form aria-label="Settings Form">
  <label for="apiKey">API Key: </label>
  <input type="text" id="apiKey" />

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