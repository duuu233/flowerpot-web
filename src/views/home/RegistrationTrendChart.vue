<template>
  <div ref="chartRef" class="registration-trend-chart" />
</template>

<script setup name="RegistrationTrendChart">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 按需注册，避免把整个 echarts 打进包里
echarts.use([
  BarChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  CanvasRenderer
])

const props = defineProps({
  // getStatisticsUser 的 retData：[{ queryDate, userCount }]
  list: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
// 图表实例和观察器不需要响应式，放普通变量，避免 Proxy 包住 echarts 内部对象
let chart = null
let resizeObserver = null

// 主题色统一从 CSS 变量取，换配色时图表跟着走
function cssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
}

// queryDate 是「日期或周期」：按天返回 2026-09-09，按月返回 2026-09，也可能是后端自定义周期串
function formatAxisLabel(value) {
  const text = String(value ?? '')
  const day = text.match(/^\d{4}-(\d{2})-(\d{2})$/)
  if (day) return `${day[1]}-${day[2]}`
  const month = text.match(/^\d{4}-(\d{2})$/)
  if (month) return `${Number(month[1])}月`
  return text
}

function buildOption() {
  const ink = cssVar('--app-ink', '#1d1d1f')
  const secondary = cssVar('--app-text', '#86868b')
  const brand = cssVar('--brand-500', '#20656c')
  const brandLight = cssVar('--brand-400', '#5fa9a2')

  const dates = props.list.map(item => item.queryDate ?? '')
  const counts = props.list.map(item => Number(item.userCount) || 0)
  // 近一年这类长周期柱子会细到看不清，超过 40 根就给一个可拖动的窗口，默认停在最近一段
  const needZoom = dates.length > 40
  const zoomStart = needZoom ? Math.max(0, 100 - (40 / dates.length) * 100) : 0

  return {
    grid: {
      top: 24,
      right: 16,
      bottom: needZoom ? 48 : 8,
      left: 8,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: 'rgba(0, 0, 0, 0.06)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: ink, fontSize: 12 },
      extraCssText: 'box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border-radius: 8px;',
      formatter: params => {
        const item = params[0]
        if (!item) return ''
        return `${item.axisValue}<br/>注册 <b>${item.data}</b> 人`
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.08)' } },
      axisLabel: {
        color: secondary,
        fontSize: 11,
        hideOverlap: true,
        formatter: formatAxisLabel
      }
    },
    yAxis: {
      type: 'value',
      // 注册人数是整数，避免出现 0.5 这样的刻度
      minInterval: 1,
      axisLabel: { color: secondary, fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.05)', type: 'dashed' } }
    },
    dataZoom: needZoom
      ? [
          { type: 'inside', start: zoomStart, end: 100 },
          {
            type: 'slider',
            start: zoomStart,
            end: 100,
            height: 16,
            bottom: 10,
            borderColor: 'transparent',
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            fillerColor: 'rgba(32, 101, 108, 0.12)',
            handleStyle: { color: brand },
            moveHandleSize: 4,
            textStyle: { color: secondary, fontSize: 10 }
          }
        ]
      : [],
    series: [
      {
        name: '注册用户',
        type: 'bar',
        data: counts,
        barMaxWidth: 28,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: brandLight },
              { offset: 1, color: brand }
            ]
          }
        },
        emphasis: { itemStyle: { color: brand } }
      }
    ]
  }
}

function render() {
  if (!chart) return
  // 第二个参数为 true：切换查询周期后数据长度变化，整份替换而不是合并
  chart.setOption(buildOption(), true)
}

onMounted(() => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  render()
  // 侧栏折叠、窗口缩放都会改变容器宽度
  resizeObserver = new ResizeObserver(() => chart && chart.resize())
  resizeObserver.observe(chartRef.value)
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (chart) {
    chart.dispose()
    chart = null
  }
})

watch(() => props.list, render, { deep: true })
</script>

<style lang="scss" scoped>
.registration-trend-chart {
  width: 100%;
  height: 300px;
}

@media (max-width: 768px) {
  .registration-trend-chart {
    height: 240px;
  }
}
</style>
