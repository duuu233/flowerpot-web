<script setup name="home">
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
import { getStatisticsUser, getUserCount } from '@/api/home'
import { getCookie } from '@/utils/support'
import avatar from '@/assets/images/user.png'

const trueName = shallowRef(getCookie('trueName') || '')
const statsLoading = shallowRef(false)
const statisticsLoading = shallowRef(false)
const statisticsQueryType = shallowRef(0)
const statisticsList = ref([])

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
    span: 8
  },
  {
    key: 'userBindProductCount',
    label: '绑定设备',
    value: stats.userBindProductCount,
    icon: 'Connection',
    span: 8
  },
  {
    key: 'orderAmount',
    label: '订单金额',
    value: stats.orderAmount,
    icon: 'Wallet',
    span: 8
  },
  {
    key: 'productCount',
    label: '产品数量',
    value: stats.productCount,
    icon: 'Goods',
    span: 6
  },
  {
    key: 'productFaqCount',
    label: '常见问题',
    value: stats.productFaqCount,
    icon: 'QuestionFilled',
    span: 6
  }
])

const maxRegistrationCount = computed(() => {
  return statisticsList.value.reduce((max, item) => {
    const count = Number(item.userCount) || 0
    return Math.max(max, count)
  }, 0)
})

function formatCount(value) {
  return value ?? '-'
}

function getBarWidth(count) {
  const value = Number(count) || 0
  if (!value || !maxRegistrationCount.value) return '0%'
  return `${Math.max((value / maxRegistrationCount.value) * 100, 6)}%`
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
    <el-card shadow="never" class="welcome">
      <div class="welcome-inner">
        <img :src="avatar" class="avatar" alt="avatar" />
        <div class="hello">
          <div class="title">你好，{{ trueName || '管理员' }}</div>
          <div class="sub">欢迎使用 曝石相框 管理中心</div>
        </div>
      </div>
    </el-card>

    <el-row v-loading="statsLoading" :gutter="16" class="stat-row">
      <el-col v-for="card in cards" :key="card.key" :xs="24" :sm="12" :md="card.span">
        <el-card shadow="never" class="stat-card">
          <div class="stat-icon">
            <el-icon><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card v-loading="statisticsLoading" shadow="never" class="trend-card">
      <template #header>
        <div class="trend-header">
          <span class="font-title-medium">用户注册统计</span>
          <el-radio-group
            v-model="statisticsQueryType"
            size="small"
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

      <div v-if="statisticsList.length" class="trend-list">
        <div
          v-for="item in statisticsList"
          :key="item.queryDate"
          class="trend-row"
        >
          <span class="trend-date">{{ item.queryDate || '-' }}</span>
          <div class="trend-track">
            <div
              class="trend-bar"
              :style="{ width: getBarWidth(item.userCount) }"
            />
          </div>
          <span class="trend-count">{{ item.userCount ?? 0 }}</span>
        </div>
      </div>
      <el-empty v-else description="暂无数据" :image-size="80" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.home {
  margin-top: 16px;
}

.welcome {
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    top: -52px;
    right: -52px;
    width: 170px;
    height: 170px;
    border: 26px solid var(--brand-50);
    border-radius: 50%;
    content: '';
    pointer-events: none;
  }
}

.welcome-inner {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  .avatar {
    width: 60px;
    height: 60px;
    border: 4px solid var(--brand-50);
    border-radius: 16px;
    margin-right: 18px;
  }

  .title {
    font-size: 20px;
    color: var(--app-ink);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .sub {
    font-size: 13px;
    color: var(--app-text);
    margin-top: 6px;
  }
}

.stat-row {
  margin-top: 18px;
}

.stat-card {
  margin-bottom: 16px;
  min-height: 118px;
  transition:
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(43, 39, 36, 0.07);
  }

  :deep(.el-card__body) {
    display: flex;
    align-items: center;
    min-height: 116px;
    padding: 20px 22px;
  }

  // 三块实心饱和橙是首页最刺眼的部分。改成品牌浅底 + 品牌深色图标：
  // 同样能认出品牌，但橙色面积和亮度都降下来了。
  .stat-icon {
    width: 54px;
    height: 54px;
    border-radius: 15px;
    border: 1px solid var(--brand-100);
    background: var(--brand-50);
    color: var(--brand-600);
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--app-ink);
    letter-spacing: -0.03em;
  }

  .stat-label {
    font-size: 13px;
    color: var(--app-text);
    margin-top: 4px;
  }
}

.trend-card {
  margin-top: 2px;
}

.trend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.trend-list {
  display: grid;
  gap: 8px;
}

.trend-row {
  display: grid;
  grid-template-columns: 120px minmax(120px, 1fr) 64px;
  align-items: center;
  gap: 14px;
  min-height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  background: var(--app-surface-muted);
}

.trend-date {
  color: var(--app-text);
  font-size: 13px;
}

.trend-track {
  height: 8px;
  border-radius: 999px;
  background: #ebe8e4;
  overflow: hidden;
}

.trend-bar {
  height: 100%;
  border-radius: 999px;
  background: var(--brand-500);
}

.trend-count {
  color: var(--app-ink);
  font-weight: 600;
  text-align: right;
}

@media (max-width: 768px) {
  .trend-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .trend-row {
    grid-template-columns: 86px minmax(80px, 1fr) 46px;
    gap: 8px;
  }
}
</style>
