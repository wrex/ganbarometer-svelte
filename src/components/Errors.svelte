<script lang="ts">
  export let result;

  $: errors = result.getErrors();;

  export let path = undefined;
  $: message = 
    errors[path] && errors[path].length ? errors[path][0] : undefined;
</script>

{#if message }
  <span class="errors">
      {message}
  </span>
{/if}

<style>
  .errors {
    color: red;
    font-size: xx-small;
  }
</style>