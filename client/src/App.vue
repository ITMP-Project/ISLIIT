<template>
  <ThemeProvider>
    <SidebarProvider>
      <NotificationToast />
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import NotificationToast from './components/common/NotificationToast.vue'
</script>
