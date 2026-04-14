import { computed, ref } from 'vue'

type AuthUser = {
  _id?: string
  id?: string
  username?: string
  student_id?: string
  faculty_id?: string
  specialization_id?: string
  modules?: string[]
  roles?: string[]
  year?: number
  semester?: number
  profile_picture?: string
  createdAt?: string | { $date?: string }
}

const authUserRef = ref<AuthUser | null>(null)

export function refreshAuthUser() {
  const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser')
  if (!raw) {
    authUserRef.value = null
    return
  }

  try {
    authUserRef.value = JSON.parse(raw)
  } catch {
    authUserRef.value = null
  }
}

export function clearAuthUser() {
  localStorage.removeItem('authUser')
  sessionStorage.removeItem('authUser')
  authUserRef.value = null
}

export function useAuthUser() {
  if (!authUserRef.value) {
    refreshAuthUser()
  }

  const authUser = computed(() => authUserRef.value)

  const userInitials = computed(() => {
    const name = authUser.value?.username?.trim() || 'AN'
    const parts = name.split(/\s+/)
    if (parts.length === 1) {
      return name.slice(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  })

  const rolesLabel = computed(() => {
    const roles = authUser.value?.roles
    if (roles && roles.length) {
      return roles.join(', ')
    }
    return 'Student'
  })

  const roleChips = computed(() => {
    const roleBadgeClass = (role?: string) => {
      const normalized = String(role ?? '').toLowerCase()
      if (normalized === 'admin') return 'bg-error-500 text-white'
      if (normalized === 'helper') return 'bg-warning-500 text-white'
      if (normalized === 'student' || normalized === 'students') return 'bg-blue-light-500 text-white'
      if (normalized === 'user') return 'bg-success-500 text-white'
      return 'bg-gray-500 text-white'
    }

    const roles = authUser.value?.roles || []

    if (!roles.length) {
      return [
        {
          label: 'Student',
          class: roleBadgeClass('student'),
        },
      ]
    }

    return roles.map((role) => {
      return {
        label: role,
        class: roleBadgeClass(role),
      }
    })
  })

  const createdAtDisplay = computed(() => {
    const raw = authUser.value?.createdAt
    if (!raw) return 'N/A'

    if (typeof raw === 'string') {
      return new Date(raw).toLocaleString()
    }

    if (raw && typeof raw === 'object' && '$date' in raw && raw.$date) {
      return new Date(raw.$date as string).toLocaleString()
    }

    return 'N/A'
  })

  return {
    authUser,
    userInitials,
    rolesLabel,
    roleChips,
    createdAtDisplay,
  }
}
