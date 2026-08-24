<script setup name="OrderDetailPanel">
import {
  formatAmount,
  formatDateTime,
  getOptionLabel,
  getOrderStateTagType,
  getPayStateTagType,
  orderStateOptions,
  payStateOptions,
  payTypeOptions,
  terminalOptions
} from '@/views/commerce/utils'

const props = defineProps({
  order: { type: Object, required: true }
})

function optionLabel(options, value) {
  return getOptionLabel(options, value)
}
</script>

<template>
  <div class="order-detail">
    <section class="order-hero">
      <div class="order-hero__identity">
        <span class="order-hero__eyebrow">ORDER LEDGER</span>
        <h1 class="order-hero__number">{{ props.order.orderNo || '-' }}</h1>
        <p class="order-hero__time">创建于 {{ formatDateTime(props.order.joinTime) }}</p>
      </div>
      <div class="order-hero__status">
        <el-tag
          :type="getOrderStateTagType(props.order.orderState)"
          effect="light"
          size="large"
          round
        >
          {{ optionLabel(orderStateOptions, props.order.orderState) }}
        </el-tag>
      </div>
    </section>

    <div class="metric-grid">
      <article class="metric-card">
        <span class="metric-card__label">订单金额</span>
        <strong class="metric-card__value">{{ formatAmount(props.order.amount) }}</strong>
        <span class="metric-card__hint">商品成交金额</span>
      </article>
      <article class="metric-card">
        <span class="metric-card__label">支付状态</span>
        <strong class="metric-card__value metric-card__value--text">
          {{ optionLabel(payStateOptions, props.order.payState) }}
        </strong>
        <span class="metric-card__hint">
          {{ optionLabel(payTypeOptions, props.order.payType) }}
        </span>
      </article>
      <article class="metric-card">
        <span class="metric-card__label">Token 数量</span>
        <strong class="metric-card__value">{{ props.order.num ?? '-' }}</strong>
        <span class="metric-card__hint">商品发放数量</span>
      </article>
      <article class="metric-card">
        <span class="metric-card__label">下单终端</span>
        <strong class="metric-card__value metric-card__value--text">
          {{ optionLabel(terminalOptions, props.order.terminal) }}
        </strong>
        <span class="metric-card__hint">终端代码 {{ props.order.terminal ?? '-' }}</span>
      </article>
    </div>

    <div class="detail-grid">
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="detail-card__heading">
            <span>订单信息</span>
            <el-tag
              :type="getPayStateTagType(props.order.payState)"
              effect="plain"
              round
            >
              {{ optionLabel(payStateOptions, props.order.payState) }}
            </el-tag>
          </div>
        </template>

        <dl class="detail-list">
          <div class="detail-list__item">
            <dt class="detail-list__label">订单 ID</dt>
            <dd class="detail-list__value">{{ props.order.orderId ?? '-' }}</dd>
          </div>
          <div class="detail-list__item">
            <dt class="detail-list__label">用户 ID</dt>
            <dd class="detail-list__value">{{ props.order.userId ?? '-' }}</dd>
          </div>
          <div class="detail-list__item">
            <dt class="detail-list__label">支付单号</dt>
            <dd class="detail-list__value detail-list__value--break">
              {{ props.order.payNo || '-' }}
            </dd>
          </div>
          <div class="detail-list__item">
            <dt class="detail-list__label">支付时间</dt>
            <dd class="detail-list__value">{{ formatDateTime(props.order.payTime) }}</dd>
          </div>
          <div class="detail-list__item">
            <dt class="detail-list__label">支付方式</dt>
            <dd class="detail-list__value">
              {{ optionLabel(payTypeOptions, props.order.payType) }}
            </dd>
          </div>
          <div class="detail-list__item">
            <dt class="detail-list__label">订单状态</dt>
            <dd class="detail-list__value">
              {{ optionLabel(orderStateOptions, props.order.orderState) }}
            </dd>
          </div>
        </dl>
      </el-card>

      <el-card class="detail-card detail-card--goods" shadow="never">
        <template #header>
          <div class="detail-card__heading">
            <span>商品快照</span>
            <span class="detail-card__meta">ID {{ props.order.goodsId ?? '-' }}</span>
          </div>
        </template>

        <div class="goods-ticket">
          <span class="goods-ticket__marker">DIGITAL GOODS</span>
          <h2 class="goods-ticket__name">{{ props.order.goodsName || '-' }}</h2>
          <div class="goods-ticket__rule" />
          <div class="goods-ticket__row">
            <span>商品金额</span>
            <strong class="goods-ticket__value">{{ formatAmount(props.order.amount) }}</strong>
          </div>
          <div class="goods-ticket__row">
            <span>发放数量</span>
            <strong class="goods-ticket__value">{{ props.order.num ?? '-' }} Token</strong>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.order-detail {
  margin-top: 14px;
}

.order-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 132px;
  overflow: hidden;
  padding: 24px 28px;
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  background:
    linear-gradient(90deg, rgba(242, 105, 16, 0.04) 1px, transparent 1px) 0 0 / 28px 28px,
    var(--app-surface);
}

.order-hero::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background: var(--brand-logo);
  content: '';
}

.order-hero__identity {
  min-width: 0;
}

.order-hero__eyebrow {
  color: var(--brand-600);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.order-hero__number {
  margin-top: 7px;
  overflow: hidden;
  color: var(--app-ink);
  font-size: clamp(18px, 2vw, 26px);
  font-weight: 750;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-hero__time {
  margin-top: 8px;
  color: var(--app-text);
  font-size: 12px;
}

.order-hero__status {
  flex: 0 0 auto;
  margin-left: 24px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.metric-card {
  display: flex;
  min-height: 118px;
  flex-direction: column;
  justify-content: center;
  padding: 18px 20px;
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  background: var(--app-surface);
}

.metric-card__label,
.metric-card__hint {
  color: var(--app-text);
  font-size: 12px;
}

.metric-card__value {
  margin: 6px 0 3px;
  color: var(--app-ink);
  font-size: 24px;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
}

.metric-card__value--text {
  font-size: 18px;
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 12px;
  margin-top: 12px;
}

.detail-card__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-card__meta {
  color: var(--app-text);
  font-size: 12px;
  font-weight: 500;
}

.detail-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;
}

.detail-list__item {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px dashed var(--app-border);
}

.detail-list__label {
  color: var(--app-text);
}

.detail-list__value {
  min-width: 0;
  color: var(--app-ink);
  font-weight: 600;
}

.detail-list__value--break {
  overflow-wrap: anywhere;
}

.detail-card--goods {
  background: var(--app-surface-muted);
}

.goods-ticket {
  position: relative;
  min-height: 220px;
  padding: 20px;
  border: 1px solid var(--brand-200);
  border-radius: 12px;
  background: var(--app-surface);
}

.goods-ticket__marker {
  color: var(--brand-600);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.goods-ticket__name {
  margin-top: 10px;
  color: var(--app-ink);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.45;
}

.goods-ticket__rule {
  height: 1px;
  margin: 20px 0 12px;
  background: repeating-linear-gradient(
    90deg,
    var(--app-border-strong),
    var(--app-border-strong) 5px,
    transparent 5px,
    transparent 10px
  );
}

.goods-ticket__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 0;
  color: var(--app-text);
}

.goods-ticket__value {
  color: var(--app-ink);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 1050px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .order-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-hero__status {
    margin-top: 16px;
    margin-left: 0;
  }

  .metric-grid,
  .detail-list {
    grid-template-columns: 1fr;
  }
}
</style>
