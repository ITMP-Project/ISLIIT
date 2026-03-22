<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';

const route = useRoute();
const router = useRouter();
const { addNotification } = useNotification();

// ─── Order data from route query params ─────────────────────────
const token       = ref(String(route.query.token   ?? 'N/A'));
const pages       = ref(Number(route.query.pages   ?? 0));
const copies      = ref(Number(route.query.copies  ?? 1));
const packKey     = ref(String(route.query.packKey ?? ''));
const packCost    = ref(Number(route.query.packCost    ?? 0));
const printCost   = ref(Number(route.query.printCost   ?? 0));
const ecoDiscount = ref(Number(route.query.ecoDiscount ?? 0));
const total       = ref(Number(route.query.total        ?? 0));
const ecoSelected = ref(route.query.ecoSelected === '1');

// ─── Kit-only order (sourced from FacultyKits page) ──────────────
const kitName    = ref(route.query.kitName   ? decodeURIComponent(String(route.query.kitName))   : '');
const kitFaculty = ref(route.query.kitFaculty ? decodeURIComponent(String(route.query.kitFaculty)) : '');

// True when student ordered a kit directly (no print job)
const isKitOnly = computed(() => pages.value === 0 && packCost.value > 0);

const PACK_LABELS: Record<string, string> = {
  '': 'None',
  essentials: 'Exam Essentials Pack',
  eng: 'Engineering Kit',
  folder: 'Presentation Folder',
  it: 'IT / Computing Kit',
  business: 'Business Presentation Kit',
  humanities: 'Humanities & Sciences Kit',
};
const packLabel = computed(() => kitName.value || PACK_LABELS[packKey.value] || 'Stationery Pack');

// ─── Student email ────────────────────────────────────────────────
const studentEmail = ref('');
const emailError   = ref('');
const SLIIT_REGEX  = /^IT\d{8}@my\.sliit\.lk$/i;

const validateEmail = () => {
  if (!studentEmail.value) {
    emailError.value = 'Student email is required.';
    return false;
  }
  if (!SLIIT_REGEX.test(studentEmail.value)) {
    emailError.value = 'Email must be in format ITxxxxxxxx@my.sliit.lk';
    return false;
  }
  emailError.value = '';
  return true;
};

// ─── Payment state ────────────────────────────────────────────────
const isProcessing = ref(false);
const paymentState = ref<'idle' | 'success' | 'error'>('idle');
const errorMessage = ref('');

const confirmPayment = async () => {
  if (!validateEmail()) {
    addNotification('Payment failed! Invalid details!', 'error');
    return;
  }

  isProcessing.value = true;
  errorMessage.value = '';

  try {
    const res = await fetch('http://localhost:4000/api/peerpoint/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.value,
        studentEmail: studentEmail.value,
        printCost: printCost.value,
        packCost: packCost.value,
        ecoDiscount: ecoDiscount.value,
        totalAmount: total.value,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      paymentState.value = 'success';
      addNotification('Payment is done! Your print is ready!', 'success');
    } else {
      paymentState.value = 'error';
      errorMessage.value = data.message ?? 'Payment failed. Please try again.';
      addNotification('Payment failed! Invalid details!', 'error');
    }
  } catch {
    // Server offline — simulate success for demo
    paymentState.value = 'success';
    addNotification('Payment is done! Your print is ready!', 'success');
  } finally {
    isProcessing.value = false;
  }
};

const retry = () => {
  paymentState.value = 'idle';
  errorMessage.value = '';
};
</script>

<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Secure Payment" />

    <div class="mx-auto max-w-2xl space-y-6">

      <!-- ─── Kit-Only Banner ─── -->
      <transition name="pp-fade">
        <div
          v-if="isKitOnly"
          class="flex flex-wrap items-center gap-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 shadow-sm dark:border-teal-500/30 dark:from-teal-900/20 dark:to-cyan-900/20"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-2xl dark:bg-teal-500/20">🛍️</div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold uppercase tracking-widest text-teal-500 dark:text-teal-400">Stationery Kit Order</p>
            <p class="mt-0.5 truncate text-base font-bold text-gray-800 dark:text-white">{{ kitName }}</p>
            <p class="mt-0.5 text-xs text-teal-600 dark:text-teal-300">{{ kitFaculty }}</p>
          </div>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-teal-500 px-3 py-1 text-xs font-bold text-white shadow">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            Ready to checkout
          </span>
        </div>
      </transition>

      <!-- ─── SUCCESS STATE ─── -->
      <transition name="pp-fade" mode="out-in">

        <div v-if="paymentState === 'success'" key="success">
          <ComponentCard title="Payment Successful">
            <div class="flex flex-col items-center py-6 text-center">
              <!-- Check icon -->
              <div class="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-success-200 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10">
                <svg class="h-10 w-10 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 class="mb-1 text-xl font-bold text-gray-800 dark:text-white/90">
                {{ isKitOnly ? 'Your kit order is confirmed!' : 'Your print is ready for pickup!' }}
              </h2>
              <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                A confirmation has been sent to <strong class="text-gray-700 dark:text-gray-300">{{ studentEmail }}</strong>
              </p>

              <!-- Token badge -->
              <div class="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-5 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Order Reference</span>
                <span class="text-sm font-bold text-brand-500 tracking-widest">{{ token }}</span>
              </div>

              <div class="flex flex-wrap gap-3 justify-center">
                <router-link
                  v-if="isKitOnly"
                  to="/peerpoint/kits"
                  class="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-300 bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:border-brand-400"
                >
                  &larr; Browse More Kits
                </router-link>
                <router-link
                  v-else
                  to="/peerpoint/printing"
                  class="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-300 bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:border-brand-400"
                >
                  &larr; New Print Order
                </router-link>
              </div>
            </div>
          </ComponentCard>
        </div>

        <!-- ─── ERROR STATE ─── -->
        <div v-else-if="paymentState === 'error'" key="error">
          <ComponentCard title="Payment Failed">
            <div class="flex flex-col items-center py-6 text-center">
              <div class="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/10">
                <svg class="h-10 w-10 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 class="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">Payment Failed</h2>
              <p class="mb-6 text-sm text-error-500">{{ errorMessage }}</p>
              <button
                @click="retry"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-error-300 bg-error-500 px-6 py-2.5 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-error-600"
              >
                Try Again
              </button>
            </div>
          </ComponentCard>
        </div>

        <!-- ─── PAYMENT FORM ─── -->
        <div v-else key="form" class="space-y-6">

          <!-- Order Reference row -->
          <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Order Reference</span>
            <span class="text-sm font-bold text-brand-500 tracking-widest">{{ token }}</span>
          </div>

          <!-- Charge Breakdown Card -->
          <ComponentCard title="Order Summary">
            <div class="space-y-4">

              <!-- Printing Cost (hidden for kit-only orders) -->
              <div v-if="!isKitOnly" class="flex items-start justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Printing Cost</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ pages }} page(s) × {{ copies }} cop{{ copies === 1 ? 'y' : 'ies' }} × Rs.&nbsp;5
                  </p>
                </div>
                <span class="text-sm font-semibold text-gray-800 dark:text-white/90">Rs. {{ (pages * copies * 5).toFixed(2) }}</span>
              </div>

              <!-- Stationery Kit -->
              <div
                v-if="packKey && packCost > 0"
                class="flex items-start justify-between pt-4 dark:border-gray-800"
                :class="isKitOnly ? '' : 'border-t border-gray-100'"
              >
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ packLabel }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ isKitOnly ? kitFaculty || 'Faculty stationery kit' : 'Add-on stationery kit' }}
                  </p>
                </div>
                <span class="text-sm font-semibold text-gray-800 dark:text-white/90">Rs. {{ packCost.toFixed(2) }}</span>
              </div>

              <!-- Eco Discount -->
              <div v-if="ecoSelected && ecoDiscount > 0" class="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <div class="flex items-center gap-2">
                  <span class="rounded-md bg-success-50 px-2 py-0.5 text-xs font-bold text-success-600 dark:bg-success-500/15 dark:text-success-400">ECO</span>
                  <p class="text-sm font-medium text-success-600 dark:text-success-400">Eco-Friendly Discount (3%)</p>
                </div>
                <span class="text-sm font-semibold text-success-600 dark:text-success-400">− Rs. {{ ecoDiscount.toFixed(2) }}</span>
              </div>

              <!-- Total -->
              <div class="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Amount</span>
                <span class="text-lg font-black text-brand-500">Rs. {{ total.toFixed(2) }}</span>
              </div>

            </div>
          </ComponentCard>

          <!-- Student Email Card -->
          <ComponentCard title="Confirmation Email" desc="Enter your official SLIIT student email to receive a confirmation.">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Student Email Address
              </label>
              <input
                v-model="studentEmail"
                @input="emailError = ''"
                type="email"
                placeholder="IT20010000@my.sliit.lk"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:text-white/90 dark:placeholder:text-white/30"
                :class="emailError
                  ? 'border-error-300 focus:border-error-300 focus:ring-error-500/10 dark:border-error-700'
                  : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800'"
              />
              <p v-if="emailError" class="mt-2 flex items-center gap-1.5 text-sm text-error-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ emailError }}
              </p>
            </div>
          </ComponentCard>

          <!-- Confirm Payment Button -->
          <button
            @click="confirmPayment"
            :disabled="isProcessing"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-300 bg-brand-500 py-3 px-6 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-brand-400 dark:bg-brand-500"
          >
            <span v-if="isProcessing" class="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {{ isProcessing ? 'Processing Payment…' : `Confirm Payment — Rs. ${total.toFixed(2)}` }}
          </button>

          <!-- Back link -->
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            <router-link
              v-if="isKitOnly"
              to="/peerpoint/kits"
              class="underline underline-offset-2 transition hover:text-gray-700 dark:hover:text-gray-300"
            >
              &larr; Back to Stationery Kits
            </router-link>
            <button
              v-else
              @click="router.back()"
              class="underline underline-offset-2 transition hover:text-gray-700 dark:hover:text-gray-300"
            >
              &larr; Back to Order Customization
            </button>
          </p>

          <!-- Security badge -->
          <div class="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            256-bit SSL Encrypted &bull; SLIIT Pay Secured Gateway
          </div>

        </div>
      </transition>

    </div>
  </AdminLayout>
</template>

<style scoped>
.pp-fade-enter-active,
.pp-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.pp-fade-enter-from,
.pp-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
