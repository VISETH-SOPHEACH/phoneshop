<template>
  <Navbar @search-product="updateSearch" />
  
  <router-view :searchQuery="searchString" />
  
  <Footer />
</template>

<script setup>
import { ref } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

// This variable holds the text typed in the Navbar
const searchString = ref("");

const updateSearch = (text) => {
  searchString.value = text;
};
</script>