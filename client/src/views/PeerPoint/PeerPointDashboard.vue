<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0A1F44] via-[#0A1F44] to-[#1a2f54]">
    <!-- Animated Futuristic Background Elements -->
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6F00] rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
    </div>

    <div class="relative z-10 mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <PageBreadcrumb pageTitle="Welcome to Peer Point" class="text-white" />

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8 mt-4">
        
        <router-link to="/peerpoint/printing" class="col-span-1 md:col-span-2 lg:col-span-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,111,0,0.5)] hover:border-orange-500/50 group cursor-pointer" style="border-top: 5px solid #FF6F00;">
          <h3 class="mb-2 text-2xl font-bold text-white group-hover:text-[#FF6F00] transition-colors flex items-center gap-3">
            <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Start Document Printing
          </h3>
          <p class="font-medium text-gray-300">Upload your documents, apply AI formatting, choose eco-friendly options, and proceed to secure payment.</p>
          <div class="mt-6 flex items-center text-[#FF6F00] font-bold text-lg group-hover:translate-x-2 transition-transform">
              Initialize Print Sequence &rarr;
          </div>
        </router-link>

        <router-link to="/peerpoint/documents" class="col-span-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:border-blue-500/50" style="border-left: 4px solid #3b82f6;">
          <h4 class="mb-2 text-xl font-semibold text-white">Faculty Documents</h4>
          <p class="text-sm font-medium text-gray-300">Explore guidelines, past papers, and university-approved templates.</p>
        </router-link>

        <router-link to="/peerpoint/kits" class="col-span-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:border-blue-500/50" style="border-left: 4px solid #3b82f6;">
          <h4 class="mb-2 text-xl font-semibold text-white">Stationery Kits</h4>
          <p class="text-sm font-medium text-gray-300">Browse recommended tools and kits for your specific faculty modules.</p>
        </router-link>

      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.text-gray-800) {
  color: #ffffff !important;
}
:deep(.text-gray-500) {
  color: #e2e8f0 !important;
}
</style>
