<template>
  <div>
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
             dark:border-gray-800 dark:bg-gray-900 lg:p-6"
    >
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex w-full flex-col items-center gap-6 xl:flex-row">
          
          <!-- Avatar container with upload trigger -->
          <div
            @click="triggerFileInput"
            class="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-brand-500 text-lg font-semibold text-white shadow-sm dark:border-gray-800"
          >
            <!-- Display Image if available -->
            <img 
              v-if="authUser?.profile_picture" 
              :src="authUser.profile_picture" 
              class="h-full w-full object-cover" 
              alt="Profile Picture" 
            />
            <!-- Otherwise initials -->
            <span v-else>{{ userInitials }}</span>
            
            <!-- Hover overlay -->
            <div class="invisible absolute inset-0 flex items-center justify-center bg-black/40 group-hover:visible">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <!-- Hidden file input -->
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />
          </div>
          
          <div class="order-3 text-center xl:order-2 xl:text-left">
            <h4 class="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
              {{ authUser?.username || 'User' }}
            </h4>
            <div class="flex flex-col items-center gap-2 xl:items-start">
              <div class="flex flex-wrap justify-center gap-1.5 xl:justify-start">
                <span
                  v-for="chip in roleChips"
                  :key="chip.label"
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="chip.class"
                >
                  {{ chip.label }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p>ID: {{ authUser?.student_id || 'N/A' }}</p>
              </div>
            </div>
          </div>

        </div>
 
      </div>
    </div>
    <Modal v-if="isProfileInfoModal" @close="isProfileInfoModal = false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- Extra profile info can go here -->
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from './Modal.vue'
import { useAuthUser, refreshAuthUser } from '@/composables/useAuthUser'

const isProfileInfoModal = ref(false)

const { authUser, userInitials, roleChips } = useAuthUser()
const fileInput = ref<HTMLInputElement | null>(null)
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000"

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = async () => {
      // Resize logic using canvas to stay well within limits
      const canvas = document.createElement('canvas')
      const MAX_WIDTH = 500
      let width = img.width
      let height = img.height

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)

      // Compress to base64 jpeg
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)

      // Call API
      try {
        const userId = authUser.value?._id || authUser.value?.id
        if (!userId) {
          alert('User ID not found')
          return
        }

        const res = await fetch(`${apiUrl}/api/auth-users/${userId}/profile-picture`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_picture: compressedDataUrl })
        })

        if (!res.ok) {
          throw new Error('Failed to upload profile picture')
        }

        const updatedUserResponse = await res.json()
        
        // Update local storage
        const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser')
        if (raw) {
          const parsed = JSON.parse(raw)
          parsed.profile_picture = compressedDataUrl
          
          if (localStorage.getItem('authUser')) {
            localStorage.setItem('authUser', JSON.stringify(parsed))
          } else {
            sessionStorage.setItem('authUser', JSON.stringify(parsed))
          }
          
          refreshAuthUser()
        }
      } catch (err: any) {
        alert(err.message || 'Error uploading profile picture')
      }
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}
</script>
