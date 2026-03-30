<template>
  <div class="app-shell">
    <Navbar @search-product="updateSearch" />

    <main class="pb-12">
      <router-view :searchQuery="searchString" />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

const searchString = ref("");

const updateSearch = (text) => {
  searchString.value = text;
};
</script>
