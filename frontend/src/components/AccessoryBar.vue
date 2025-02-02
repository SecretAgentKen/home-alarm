<template>
  <div class="me-2 mt-2 flex flex-row justify-end">
    <button
      class="h-12 w-12 rounded border-2 border-current/50 p-2 text-2xl text-current/50"
      @click="reload"
    >
      <FAIcon icon="refresh"></FAIcon>
    </button>
  </div>
</template>

<script setup lang="ts">
function reload() {
  window.location.reload()
}
</script>
