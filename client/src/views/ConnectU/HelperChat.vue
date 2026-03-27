<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-6 flex flex-col h-[calc(100vh-200px)]">
      
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full flex-grow overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg">
            {{ isCurrentHelper ? 'S' : 'H' }}
          </div>
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white">{{ isCurrentHelper ? 'Student Consultation' : 'Helper Consultation' }}</h3>
            <p class="text-xs text-green-500 font-medium">Active</p>
          </div>
        </div>
        
        <!-- Messages Area -->
        <div class="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900/30" id="messages-container">
          
          <div v-for="msg in messages" :key="msg._id" :class="[
            'flex flex-col',
            msg.sender === currentUser?.username ? 'items-end w-full' : 'items-start w-full'
          ]">
            <div :class="[
              'max-w-[75%] rounded-2xl px-5 py-3 text-sm shadow-sm break-words',
              msg.sender === currentUser?.username 
                ? 'bg-green-500 text-white rounded-tr-sm' 
                : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-tl-sm'
            ]">
              {{ msg.text }}
            </div>
            <span class="text-xs text-gray-400 mt-1" :class="msg.sender === currentUser?.username ? 'mr-1' : 'ml-1'">
              {{ msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now' }}
            </span>
          </div>

          <div v-if="messages.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-10">
            No messages yet. Send a message to start the consultation!
          </div>
          
        </div>
        
        <!-- Input Area -->
        <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form @submit.prevent="sendMessage" class="flex items-center gap-3">
            <input 
              v-model="messageInput" 
              type="text" 
              placeholder="Type your message..." 
              class="flex-grow rounded-full border border-stroke bg-transparent py-2.5 px-5 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input"
            />
            <button type="submit" :disabled="!messageInput.trim()" class="w-11 h-11 bg-brand-500 hover:bg-brand-600 rounded-full text-white flex items-center justify-center transition-colors disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 -ml-0.5 mt-0.5 transform rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
        
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";

const route = useRoute();
const currentPageTitle = ref("Consultation");
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const readAuthUser = () => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  try { return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
};
const currentUser = ref(readAuthUser());
const helperId = route.params.id;
const studentId = computed(() => route.query.studentId || currentUser.value?.username);
const isCurrentHelper = computed(() => !!route.query.studentId); // if accessed from inbox

const messageInput = ref("");
const messages = ref([]);
let pollInterval = null;

const fetchMessages = async () => {
  if (!studentId.value) return;
  try {
    const res = await fetch(`${apiUrl}/api/academic/chat/${helperId}?studentId=${studentId.value}`);
    if (res.ok) {
      const data = await res.json();
      if (data.length !== messages.value.length) {
        messages.value = data;
        scrollToBottom();
      }
    }
  } catch(e) { console.error(e); }
};

const scrollToBottom = () => {
  nextTick(() => {
    const container = document.getElementById("messages-container");
    if(container) container.scrollTop = container.scrollHeight;
  });
};

onMounted(() => {
  fetchMessages();
  pollInterval = setInterval(fetchMessages, 3000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

const sendMessage = async () => {
  if (!messageInput.value.trim() || !currentUser.value) return;
  
  const text = messageInput.value.trim();
  messageInput.value = "";
  
  // Optimistic UI
  messages.value.push({
    _id: Date.now().toString(),
    sender: currentUser.value.username,
    text,
    timestamp: new Date()
  });
  scrollToBottom();
  
  try {
    await fetch(`${apiUrl}/api/academic/chat/${helperId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: studentId.value,
        sender: currentUser.value.username,
        text
      })
    });
    fetchMessages(); // re-sync
  } catch(e) { console.error(e); }
};
</script>
