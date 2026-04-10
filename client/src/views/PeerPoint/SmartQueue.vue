<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const queueNumber = ref('A-104');
const estimatedTime = ref('12 mins');
const status = ref('Processing'); // Printing, Ready for Pickup
const pickupPoint = ref('Computing Faculty Desk');
const notificationEnabled = ref(true);

const printOrder = async () => {
    status.value = 'Printing';
    try {
        const res = await fetch('http://localhost:4000/api/peerpoint/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                documentName: 'Uploaded Document',
                copies: 1,
                doubleSided: true
            })
        });
        if (res.ok) {
            const data = await res.json();
            queueNumber.value = data.token;
            // Navigate to separate payment page
            router.push(`/peerpoint/payment?token=${data.token}`);
        }
    } catch (e) {
        console.error(e);
    }
};
</script>

<template>
  <div class="rounded-lg border border-stroke bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(255,111,0,0.2)] dark:border-strokedark dark:bg-boxdark transform hover:-translate-y-1">
    <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center rounded-t-lg" style="background-color: #0A1F44;">
      <h3 class="font-semibold text-white">
        Smart Queue & Payment
      </h3>
      <span class="rounded bg-white px-2 py-1 text-xs font-medium text-black">Token: {{ queueNumber }}</span>
    </div>
    
    <div class="p-6.5">
      <div class="flex flex-col md:flex-row gap-6 justify-between items-center w-full">
        <!-- Status Indicator -->
        <div class="flex-1 w-full relative">
            <div class="flex flex-row justify-between mb-2">
                <span class="text-sm font-medium" :style="{ color: status === 'Processing' ? '#FF6F00' : '' }">Processing</span>
                <span class="text-sm font-medium" :style="{ color: status === 'Printing' ? '#FF6F00' : '' }">Printing</span>
                <span class="text-sm font-medium" :style="{ color: status === 'Ready' ? '#FF6F00' : '' }">Ready</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div class="h-2.5 rounded-full" :class="[status === 'Processing' ? 'w-1/3' : status === 'Printing' ? 'w-2/3' : 'w-full']" style="background-color: #FF6F00;"></div>
            </div>
        </div>

        <div class="flex-1 w-full text-center md:text-right border-l md:border-l-0 border-stroke pl-4 md:pl-0 dark:border-strokedark">
            <h4 class="text-2xl font-bold text-black dark:text-white">{{ estimatedTime }}</h4>
            <span class="text-sm">Estimated Wait</span>
        </div>
      </div>

      <div class="mt-6 border-t border-stroke pt-4 dark:border-strokedark">
        <h4 class="font-medium mb-2 text-black dark:text-white">Pickup Info</h4>
        <div class="flex items-center justify-between mb-4">
            <p class="text-sm"><span class="font-medium text-black dark:text-white">Location:</span> {{ pickupPoint }}</p>
            <label class="flex items-center cursor-pointer">
                <input type="checkbox" v-model="notificationEnabled" class="sr-only peer">
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600" style="peer-checked:bg-orange-500"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Notify Me</span>
            </label>
        </div>

        <div class="flex gap-4">
            <button @click="printOrder" class="flex-1 justify-center rounded py-3 px-6 font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300" style="background-color: #FF6F00;">
            Pay & Print (Rs 250)
            </button>
            <button @click="() => alert('Document saved to Archive!')" class="flex-1 justify-center rounded py-3 px-6 font-bold text-black border border-stroke dark:text-white dark:border-strokedark hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
            Save to Archive
            </button>
        </div>
      </div>
    </div>
  </div>
</template>
