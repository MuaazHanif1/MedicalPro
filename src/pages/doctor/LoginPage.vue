<template>
    <LoginPage :information="information"></LoginPage>
</template>
<script setup>
import { ref } from "vue";
import LoginPage from "@/partials/LoginPage.vue";
const information = ref({
    role: 'doctor',
    api_end_point: 'doctors/login',
    redirect_route_name: 'dashboard'
});
</script>