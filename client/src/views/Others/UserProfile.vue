<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <profile-card />
      <personal-info-card />
      <academic-card />
    </div>
  </admin-layout>
</template>

<script setup>
import AdminLayout from '../../components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref } from 'vue'
import ProfileCard from '../../components/profile/ProfileCard.vue'
import PersonalInfoCard from '../../components/profile/PersonalInfoCard.vue'
import AcademicCard from '../../components/profile/AcademicCard.vue'
const currentPageTitle = ref('User Profile')
</script>
