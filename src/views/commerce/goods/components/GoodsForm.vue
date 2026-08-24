<script setup name="GoodsForm">
import { computed } from 'vue'
import PageHeader from '@/components/PageHeader/index.vue'
import { formatAmount, getVerifyTagType } from '@/views/commerce/utils'
import { useGoodsForm } from '../useGoodsForm'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: value => ['add', 'edit', 'detail'].includes(value)
  }
})

const {
  formRef,
  formData,
  loading,
  submitting,
  rules,
  isAdd,
  isReadOnly,
  pageTitle,
  submitForm,
  backToList
} = useGoodsForm(props.mode)

const totalTokenCount = computed(
  () => Number(formData.num || 0) + Number(formData.giveNum || 0)
)
</script>

<template>
  <div class="app-container">
    <PageHeader :title="pageTitle" icon="Goods">
      <template v-if="!isAdd && formData.verify !== null" #extra>
        <el-tag :type="getVerifyTagType(formData.verify)" effect="light" round>
          {{ Number(formData.verify) === 1 ? '启用中' : '已禁用' }}
        </el-tag>
      </template>
    </PageHeader>

    <el-card v-loading="loading" class="goods-form-card" shadow="never">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        size="default"
      >
        <section class="form-section">
          <div class="section-heading">
            <span class="section-index">01</span>
            <div>
              <h2 class="section-title">商品基础信息</h2>
              <p class="section-description">配置售价、Token 发放量与列表排序。</p>
            </div>
          </div>

          <div class="form-grid">
            <el-form-item class="form-field form-field--wide" label="商品名称" prop="goodsName">
              <el-input
                v-model="formData.goodsName"
                :disabled="isReadOnly"
                maxlength="30"
                placeholder="例如：30 元 / 3000 Token"
                show-word-limit
              />
            </el-form-item>

            <el-form-item class="form-field" label="商品金额" prop="amount">
              <el-input-number
                v-model="formData.amount"
                class="number-input"
                :disabled="isReadOnly"
                :min="0.01"
                :max="99999999"
                :precision="2"
                :step="0.01"
                controls-position="right"
              />
            </el-form-item>

            <el-form-item class="form-field" label="基础 Token 数量" prop="num">
              <el-input-number
                v-model="formData.num"
                class="number-input"
                :disabled="isReadOnly"
                :min="1"
                :max="2147483647"
                :precision="0"
                controls-position="right"
              />
            </el-form-item>

            <el-form-item class="form-field" label="赠送 Token 数量" prop="giveNum">
              <el-input-number
                v-model="formData.giveNum"
                class="number-input"
                :disabled="isReadOnly"
                :min="0"
                :max="2147483647"
                :precision="0"
                controls-position="right"
              />
            </el-form-item>

            <el-form-item class="form-field" label="商品权重" prop="grade">
              <el-input-number
                v-model="formData.grade"
                class="number-input"
                :disabled="isReadOnly"
                :min="0"
                :max="2147483647"
                :precision="0"
                controls-position="right"
              />
            </el-form-item>
          </div>

          <div class="token-summary">
            <span class="token-summary__label">单次购买预计发放</span>
            <strong class="token-summary__value">{{ totalTokenCount }}</strong>
            <span class="token-summary__unit">Token</span>
            <span v-if="!isAdd" class="token-summary__meta">
              接口单价：{{ formatAmount(formData.unitPrice) }}
            </span>
          </div>
        </section>

        <section class="form-section form-section--platform">
          <div class="section-heading">
            <span class="section-index">02</span>
            <div>
              <h2 class="section-title">支付平台映射</h2>
              <p class="section-description">对应微信与 Apple 平台后台配置的产品标识。</p>
            </div>
          </div>

          <div class="form-grid form-grid--platform">
            <el-form-item class="form-field" label="微信产品 ID" prop="wxProductId">
              <el-input
                v-model="formData.wxProductId"
                :disabled="isReadOnly"
                maxlength="100"
                placeholder="请输入微信平台产品 ID"
              />
            </el-form-item>

            <el-form-item class="form-field" label="Apple 产品 ID" prop="appleProductId">
              <el-input
                v-model="formData.appleProductId"
                :disabled="isReadOnly"
                maxlength="100"
                placeholder="请输入 Apple 平台产品 ID"
              />
            </el-form-item>
          </div>
        </section>

        <div class="form-actions">
          <el-button @click="backToList">返回列表</el-button>
          <el-button
            v-if="!isReadOnly"
            type="primary"
            :loading="submitting"
            @click="submitForm"
          >
            {{ isAdd ? '创建商品' : '保存修改' }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.goods-form-card {
  margin-top: 14px;
}

.goods-form-card :deep(.el-card__body) {
  padding: 0;
}

.form-section {
  padding: 28px 30px 30px;
}

.form-section--platform {
  border-top: 1px solid var(--app-border);
  background: var(--app-surface-muted);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.section-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--brand-200);
  border-radius: 10px;
  color: var(--brand-600);
  background: var(--brand-50);
  font-size: 12px;
  font-weight: 700;
}

.section-title {
  color: var(--app-ink);
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
}

.section-description {
  margin-top: 4px;
  color: var(--app-text);
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2px 20px;
}

.form-grid--platform {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-field--wide {
  grid-column: span 2;
}

.number-input {
  width: 100%;
}

.token-summary {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 8px;
  padding: 14px 18px;
  border-left: 3px solid var(--brand-logo);
  border-radius: 0 10px 10px 0;
  background: var(--brand-50);
}

.token-summary__label,
.token-summary__unit,
.token-summary__meta {
  color: var(--app-text);
}

.token-summary__value {
  color: var(--app-ink);
  font-size: 24px;
  font-variant-numeric: tabular-nums;
}

.token-summary__meta {
  margin-left: auto;
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 18px 30px;
  border-top: 1px solid var(--app-border);
  background: var(--app-surface);
}

@media (max-width: 1100px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .form-section {
    padding: 22px 18px;
  }

  .form-grid,
  .form-grid--platform {
    grid-template-columns: 1fr;
  }

  .form-field--wide {
    grid-column: auto;
  }

  .token-summary {
    flex-wrap: wrap;
  }

  .token-summary__meta {
    width: 100%;
    margin-left: 0;
  }
}
</style>
