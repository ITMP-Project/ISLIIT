<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loyaltyPoints = ref(450);
const textbooks = ref([]);

onMounted(async () => {
    try {
        const res = await fetch('http://localhost:4000/api/bookshop/marketplace');
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
                textbooks.value = data;
            } else {
                // Fallback dummy data if db is empty
                textbooks.value = [
                    { id: 1, title: 'Calculus Early Transcendentals', author: 'James Stewart', price: 'Rs 1500', seller: 'Kamal P.' },
                    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', price: 'Rs 800', seller: 'Nimali S.' },
                ];
            }
        }
    } catch (e) {
        console.error(e);
    }
});

</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Rewards Card -->
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <h3 class="font-semibold text-black dark:text-white mb-4" style="color: #0A1F44;">
          My Loyalty Rewards
        </h3>
        <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-full" style="background-color: rgba(255, 111, 0, 0.1); color: #FF6F00;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </div>
            <div>
                <h4 class="text-2xl font-bold text-black dark:text-white">{{ loyaltyPoints }} Pts</h4>
                <p class="text-sm">Earn 50 more for a free print!</p>
            </div>
        </div>
    </div>

    <!-- Marketplace Card -->
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6 dark:border-strokedark">
            <h3 class="font-semibold text-black dark:text-white" style="color: #0A1F44;">
            Peer Marketplace
            </h3>
        </div>
        <div class="p-6">
            <div class="flex flex-col gap-4">
                <div v-for="book in textbooks" :key="book.id" class="flex justify-between items-start border-b border-stroke pb-3 last:border-0 last:pb-0 dark:border-strokedark">
                    <div>
                        <h5 class="text-sm font-medium text-black dark:text-white">{{ book.title }}</h5>
                        <p class="text-xs">{{ book.author }} • Seller: {{ book.seller }}</p>
                    </div>
                    <span class="text-sm font-semibold" style="color: #FF6F00;">{{ book.price }}</span>
                </div>
            </div>
            <button class="mt-4 w-full justify-center rounded border border-primary py-2 px-6 font-medium text-primary hover:bg-opacity-90 transition" style="color: #0A1F44; border-color: #0A1F44;">
                View All Listings
            </button>
        </div>
    </div>

  </div>
</template>
