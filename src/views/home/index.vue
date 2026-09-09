<script setup name="home">
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
import { getStatisticsUser, getUserCount } from '@/api/home'
import { getCookie } from '@/utils/support'
import RegistrationTrendChart from './RegistrationTrendChart.vue'
import avatar from '@/assets/images/user.png'

const trueName = shallowRef(getCookie('trueName') || '')
const statsLoading = shallowRef(false)
const statisticsLoading = shallowRef(false)
const statisticsQueryType = shallowRef(0)
const statisticsList = ref([])

const greetingText = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const stats = reactive({
  userCount: '-',
  userBindProductCount: '-',
  orderAmount: '-',
  productCount: '-',
  productFaqCount: '-'
})

const queryTypeOptions = [
  { value: 0, label: '近一周' },
  { value: 1, label: '近一个月' },
  { value: 2, label: '近一年' }
]

const cards = computed(() => [
  {
    key: 'userCount',
    label: '用户总数',
    value: stats.userCount,
    icon: 'User',
    unit: '位',
    span: 8
  },
  {
    key: 'userBindProductCount',
    label: '绑定设备',
    value: stats.userBindProductCount,
    icon: 'Connection',
    unit: '台',
    span: 8
  },
  {
    key: 'orderAmount',
    label: '订单金额',
    value: stats.orderAmount,
    icon: 'Wallet',
    unit: '元',
    span: 8
  },
  {
    key: 'productCount',
    label: '产品型号',
    value: stats.productCount,
    icon: 'Goods',
    unit: '款',
    span: 12
  },
  {
    key: 'productFaqCount',
    label: '常见问题解答',
    value: stats.productFaqCount,
    icon: 'QuestionFilled',
    unit: '条',
    span: 12
  }
])

function formatCount(value) {
  return value ?? '-'
}

async function loadStats() {
  statsLoading.value = true
  try {
    const res = await getUserCount()
    const data = res.retData || {}
    stats.userCount = formatCount(data.userCount)
    stats.userBindProductCount = formatCount(data.userBindProductCount)
    stats.orderAmount = formatCount(data.orderAmount)
    stats.productCount = formatCount(data.productCount)
    stats.productFaqCount = formatCount(data.productFaqCount)
  } finally {
    statsLoading.value = false
  }
}

async function loadRegistrationStats() {
  statisticsLoading.value = true
  try {
    const res = await getStatisticsUser({
      queryType: statisticsQueryType.value
    })
    statisticsList.value = res.retData || []
  } finally {
    statisticsLoading.value = false
  }
}

onMounted(() => {
  loadStats()
  loadRegistrationStats()
})
</script>

<template>
  <div class="app-container home">
    <!-- 欢迎与系统概况横幅 -->
    <el-card shadow="never" class="welcome-card">
      <div class="welcome-inner">
        <div class="avatar-wrap">
          <img :src="avatar" class="avatar-img" alt="avatar" />
          <span class="online-indicator" title="在线状态正常" />
        </div>
        <div class="welcome-text">
          <div class="greeting">
            {{ greetingText }}，<span class="user-highlight">{{ trueName || '管理员' }}</span>
          </div>
          <div class="welcome-desc">欢迎回到 YSplanter 花盆管理中心，系统运行平稳</div>
        </div>
        <div class="welcome-chips">
          <div class="chip-item">
            <span class="chip-dot" />
            <span class="chip-label">智能设备状态</span>
            <span class="chip-val">正常连线</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 便当盒 Bento 核心指标卡片 -->
    <el-row v-loading="statsLoading" :gutter="16" class="stat-row">
      <el-col
        v-for="card in cards"
        :key="card.key"
        :xs="24"
        :sm="12"
        :md="card.span"
      >
        <el-card shadow="never" class="stat-card">
          <div class="stat-body">
            <div class="stat-icon-wrap">
              <el-icon class="stat-icon"><component :is="card.icon" /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">{{ card.label }}</div>
              <div class="stat-value-line">
                <span class="stat-value">{{ card.value }}</span>
                <span v-if="card.value !== '-'" class="stat-unit">{{ card.unit }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户注册趋势可视化卡片 -->
    <el-card v-loading="statisticsLoading" shadow="never" class="trend-card">
      <template #header>
        <div class="trend-header">
          <div class="trend-title-box">
            <el-icon class="trend-title-icon"><TrendCharts /></el-icon>
            <span class="trend-title-text">用户注册增长趋势</span>
          </div>
          <el-radio-group
            v-model="statisticsQueryType"
            size="small"
            class="trend-range-toggle"
            @change="loadRegistrationStats"
          >
            <el-radio-button
              v-for="item in queryTypeOptions"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <RegistrationTrendChart v-if="statisticsList.length" :list="statisticsList" />
      <el-empty v-else description="暂无数据" :image-size="70" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.home {
  margin-top: 16px;
}

// 欢迎卡片：纯净开阔呼吸感
.welcome-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--app-radius);
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  :deep(.el-card__body) {
    padding: 22px 28px;
  }
}

.welcome-inner {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  .avatar-wrap {
    position: relative;
    margin-right: 20px;
    flex-shrink: 0;

    .avatar-img {
      width: 54px;
      height: 54px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 14px;
      background: var(--brand-50);
      object-fit: cover;
    }

    .online-indicator {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--app-success);
      border: 2px solid #ffffff;
    }
  }

  .welcome-text {
    flex: 1;
    min-width: 0;

    .greeting {
      font-size: 20px;
      color: var(--app-ink);
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.3;

      .user-highlight {
        color: var(--brand-600);
      }
    }

    .welcome-desc {
      font-size: 13px;
      color: var(--app-text-secondary);
      margin-top: 4px;
    }
  }

  .welcome-chips {
    display: flex;
    align-items: center;
    gap: 8px;

    .chip-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.03);
      border: none;
      font-size: 12px;

      .chip-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--app-success);
      }

      .chip-label {
        color: var(--app-text-secondary);
      }

      .chip-val {
        color: var(--app-ink);
        font-weight: 500;
      }
    }
  }
}

.stat-row {
  margin-top: 16px;
}

// Bento 指标卡片：苹果极简平滑悬浮
.stat-card {
  margin-bottom: 16px;
  border-radius: var(--app-radius);
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition:
    transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.24s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.045);
  }

  :deep(.el-card__body) {
    padding: 22px 24px;
  }

  .stat-body {
    display: flex;
    align-items: center;
  }

  .stat-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    border: none;
    background: rgba(32, 101, 108, 0.06);
    color: var(--brand-500);
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 18px;
    flex-shrink: 0;
  }

  .stat-content {
    min-width: 0;
  }

  .stat-label {
    font-size: 13px;
    color: var(--app-text-secondary);
    font-weight: 500;
  }

  .stat-value-line {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-top: 4px;

    .stat-value {
      font-size: 28px;
      font-weight: 600;
      color: var(--app-ink);
      letter-spacing: -0.03em;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }

    .stat-unit {
      font-size: 12px;
      color: var(--app-text-muted);
      font-weight: 400;
    }
  }
}

// 增长趋势卡片
.trend-card {
  margin-top: 2px;
  border-radius: var(--app-radius);
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.trend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .trend-title-box {
    display: flex;
    align-items: center;
    gap: 8px;

    .trend-title-icon {
      color: var(--brand-500);
      font-size: 16px;
    }

    .trend-title-text {
      font-size: 14px;
      font-weight: 600;
      color: var(--app-ink);
      letter-spacing: -0.01em;
    }
  }
}

@media (max-width: 768px) {
  .welcome-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .welcome-chips {
      margin-top: 6px;
    }
  }

  .trend-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
