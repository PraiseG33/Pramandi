<script setup>defineProps({text: String})</script>
<template><span class="inline-flex items-center gap-1.5"><span class="star text-lg" aria-hidden="true">✱</span><span class="logo font-display font-black tracking-tight" :data-t="text">{{ text }}</span></span></template>
