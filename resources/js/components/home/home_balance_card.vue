<script setup lang="ts">
import type { HomeBalance } from '../../types/home/home_page.types'
import HomeWithdrawButton from './home_withdraw_button.vue'
import { computed } from 'vue'
import { formatMajorAmount } from '../../utils/home/home_currency_formatter'

const props = defineProps<{
  balance: HomeBalance
  eyebrow: string
  title: string
  withdrawLabel: string
}>()

const emit = defineEmits<{ withdraw: [] }>()

const amountLabel = computed<string>(() =>
  formatMajorAmount(props.balance.amountMinor, props.balance.currency),
)

const productLine = computed<string>(
  () => `${props.balance.productLabel} • ${props.balance.interestRateLabel}`,
)

function handleWithdraw(): void {
  emit('withdraw')
}
</script>

<template>
  <section class="home-balance" :aria-label="title">
    <div class="home-balance__meta">
      <div class="home-balance__meta-text">
        <p class="home-balance__eyebrow">{{ eyebrow }}</p>
        <h2 class="home-balance__title">{{ title }}</h2>
      </div>
      <p class="home-balance__status">{{ balance.statusLabel }}</p>
    </div>

    <div class="home-balance__amount-block">
      <p class="home-balance__amount">{{ amountLabel }}</p>
      <p class="home-balance__product">{{ productLine }}</p>
    </div>

    <HomeWithdrawButton
      :label="withdrawLabel"
      :is-enabled="balance.isWithdrawEnabled"
      :hint="balance.availabilityMessage"
      @withdraw="handleWithdraw"
    />

    <p id="home-withdraw-hint" class="home-balance__availability">
      <span class="home-balance__rule" aria-hidden="true" />
      <span>{{ balance.availabilityMessage }}</span>
    </p>
  </section>
</template>

<style scoped>
.home-balance {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 20px;
  border-radius: var(--home-radius-balance);
  background-image: var(--home-brand-gradient);
  box-shadow: var(--home-shadow-balance);
  gap: 12px;
}

.home-balance__meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.home-balance__meta-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-balance__eyebrow {
  color: var(--home-surface-accent-soft);
  font-size: 13px;
  font-weight: var(--home-weight-light);

  --home-tracking: 0.01em;

  letter-spacing: var(--home-tracking);
  text-indent: calc(var(--home-tracking) / 2);
  line-height: 16px;
}

.home-balance__title {
  min-height: 24px;
  max-width: 150px;
  padding-top: var(--home-line-trim);
  color: var(--home-surface-accent-soft);
  font-size: 10px;
  font-weight: var(--home-weight-semibold);

  --home-tracking: 0.01em;

  letter-spacing: var(--home-tracking);
  text-indent: calc(var(--home-tracking) / 2);
  line-height: 1;
}

.home-balance__status {
  box-sizing: border-box;
  width: 130px;
  padding: 4px 10px;
  border-radius: var(--home-radius-pill);
  background-color: rgb(255 255 255 / 20%);
  color: var(--home-text-inverse);
  font-size: 11px;
  font-weight: var(--home-weight-bold);
  line-height: 13px;
  white-space: nowrap;
  flex: none;
}

.home-balance__amount-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.home-balance__amount {
  color: var(--home-text-inverse);
  font-size: 36px;
  font-weight: var(--home-weight-bold);

  --home-tracking: -0.015em;

  letter-spacing: var(--home-tracking);
  text-indent: calc(var(--home-tracking) / 2);
  line-height: 44px;
}

.home-balance__product {
  color: var(--home-surface-accent-soft);
  font-size: 12px;
  font-weight: var(--home-weight-regular);
  line-height: 15px;
}

.home-balance__availability {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--home-surface-accent-soft);
  font-size: 12px;
  font-weight: var(--home-weight-medium);
  gap: 16px;
  line-height: 15px;
}

.home-balance__rule {
  display: none;
  width: 100px;
  height: 1px;
  background-color: rgb(255 255 255 / 31.3725%);
  flex: none;
}

@media (width >= 768px) {
  .home-balance {
    padding: 32px;
    gap: 16px;
  }

  .home-balance__meta-text {
    gap: 22px;
  }

  .home-balance__eyebrow {
    font-size: 13px;
    font-weight: var(--home-weight-semibold);
    line-height: 16px;
  }

  .home-balance__title {
    min-height: 0;
    max-width: none;
    padding-top: 0;
    font-size: 16px;
    line-height: 19px;
  }

  .home-balance__amount {
    font-size: 52px;
    line-height: 63px;
  }

  .home-balance__product {
    font-size: 14px;
    line-height: 17px;
  }

  .home-balance__availability {
    height: 23px;
    align-items: flex-end;
    justify-content: flex-start;
    font-weight: var(--home-weight-regular);
  }

  .home-balance__rule {
    display: block;
    margin-bottom: 7px;
  }
}
</style>
