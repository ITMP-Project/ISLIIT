<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <!-- Chat Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50">
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white">Consultation Session</h3>
          <p class="text-xs text-brand-500 font-medium">Active</p>
        </div>
      </div>
      
      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50" ref="messagesContainer">
         <div v-if="loading" class="text-center text-gray-500 py-10">Loading messages...</div>
         <div v-else-if="messages.length === 0" class="text-center text-gray-500 py-10 flex flex-col items-center">
             <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
             </div>
             <p>No messages yet. Send a message to start the consultation.</p>
             <p class="text-xs text-gray-400 mt-1">This space is safe and private.</p>
         </div>
         <div v-else v-for="msg in messages" :key="msg._id" 
              class="flex" 
              :class="msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'">
          <div :class="msg.sender_id === currentUserId ? 'bg-brand-500 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-green-500 text-white rounded-r-2xl rounded-tl-2xl'" class="px-5 py-3 max-w-[75%] shadow-sm">
             <p class="text-[15px] leading-relaxed">{{ msg.text }}</p>
             <p :class="msg.sender_id === currentUserId ? 'text-brand-100' : 'text-green-100'" class="text-[11px] mt-1">{{ new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
         <form @submit.prevent="sendMessage" class="flex gap-3 relative max-w-4xl mx-auto">
            <input 
              v-model="newMessage" 
              type="text" 
              placeholder="Type your message here..." 
              class="flex-1 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-5 py-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:text-white outline-none shadow-inner"
              :disabled="sending"
            />
            <button 
              type="submit" 
              :disabled="!newMessage.trim() || sending" 
              class="rounded-full bg-brand-500 p-3 text-white hover:bg-brand-600 transition-colors disabled:opacity-50 flex items-center justify-center h-11 w-11 shrink-0 shadow-sm shadow-brand-500/30">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
         </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';

const route = useRoute();
const currentPageTitle = ref('Consultation');

const conversation = ref(null);
const messages = ref([]);
const loading = ref(true);
const newMessage = ref('');
const sending = ref(false);
const messagesContainer = ref(null);
const currentUserId = ref('');

let pollingInterval = null;
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

onMounted(() => {
    // try to get student_id from auth if possible
    const userStr = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    if(userStr) {
        try {
            const user = JSON.parse(userStr);
            currentUserId.value = user.id || user._id || '';
        } catch(e) {}
    } 
    
    if (!currentUserId.value) {
        let mockId = localStorage.getItem('mockUserId');
        if (!mockId) {
            mockId = `USER-${Date.now()}`;
            localStorage.setItem('mockUserId', mockId);
        }
        currentUserId.value = mockId;
    }

    fetchMessages();
    pollingInterval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
});

onUnmounted(() => {
    if(pollingInterval) clearInterval(pollingInterval);
});

const scrollToBottom = () => {
   nextTick(() => {
     if(messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
     }
   });
};

const fetchMessages = async () => {
    const convoId = route.params.conversationId;
    if(!convoId) return;
    
    try {
       const res = await fetch(`${apiUrl}/api/chat/conversations/${convoId}/messages`);
       if(res.ok) {
           const data = await res.json();
           const prevLen = messages.value.length;
           messages.value = data;
           loading.value = false;
           
           if(data.length > prevLen) {
              scrollToBottom();
           }
       }
    } catch(err) {
       console.warn("Polling error:", err);
    }
};

const sendMessage = async () => {
    const text = newMessage.value.trim();
    if(!text) return;
    
    sending.value = true;
    const payload = {
       conversation_id: route.params.conversationId,
       sender_id: currentUserId.value,
       text: text
    };
    
    try {
        const res = await fetch(`${apiUrl}/api/chat/messages`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            newMessage.value = '';
            await fetchMessages(); // Immediate fetch
            scrollToBottom();
        }
    } catch(err) {
        console.error("Send error:", err);
    } finally {
        sending.value = false;
    }
};
</script>
