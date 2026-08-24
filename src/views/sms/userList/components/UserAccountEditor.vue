<script setup name="UserAccountEditor">
import { computed, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { getCookie } from '@/utils/support'
import { setUserAccount } from '@/api/userList'

const ACCOUNT_EDIT_PERMISSION = 'Post_User_SetUserAccount'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated'])
const userStore = useUserStore()
const editorVisible = shallowRef(false)
const draftBalance = shallowRef(0)
const submitting = shallowRef(false)

const canEdit = computed(() => {
  if (getCookie('isSysAdmin') === '1') return true
  return (userStore.permissions || []).includes(ACCOUNT_EDIT_PERMISSION)
})

const formattedBalance = computed(() => {
  const value = props.user.availableToken
  if (value === null || value === undefined || value === '') return '-'
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return value
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(numericValue)
})

function resetDraft() {
  const currentBalance = Number(props.user.availableToken)
  draftBalance.value = Number.isFinite(currentBalance) ? currentBalance : 0
}

async function submitAccount() {
  const availableToken = Number(draftBalance.value)
  if (!Number.isFinite(availableToken) || availableToken < 0) {
    ElMessage.warning('请输入不小于 0 的有效星币数量')
    return
  }

  const currentBalance = Number(props.user.availableToken)
  if (Number.isFinite(currentBalance) && currentBalance === availableToken) {
    ElMessage.info('可用星币没有变化')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认将可用星币从 ${formattedBalance.value} 调整为 ${availableToken} 吗？`,
      '账户变更确认',
      {
        confirmButtonText: '确认修改',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    return
  }

  submitting.value = true
  try {
    await setUserAccount({
      userId: props.user.userId,
      availableToken
    })
    emit('updated', availableToken)
    editorVisible.value = false
    ElMessage.success('可用星币修改成功')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="account-editor">
    <el-popover
      v-if="canEdit"
      v-model:visible="editorVisible"
      placement="left"
      :width="320"
      trigger="click"
      @show="resetDraft"
    >
      <template #reference>
        <button
          type="button"
          class="balance-trigger"
          :aria-label="`修改用户 ${user.userNo || user.userId} 的可用星币`"
        >
          <span>{{ formattedBalance }}</span>
          <el-icon><EditPen /></el-icon>
        </button>
      </template>

      <div class="editor-panel">
        <div class="editor-heading">
          <span class="editor-title">调整可用星币</span>
          <span class="editor-user">{{ user.nickName || user.userNo || `用户 ${user.userId}` }}</span>
        </div>
        <el-input-number
          v-model="draftBalance"
          class="balance-input"
          :min="0"
          :precision="2"
          :step="1"
          controls-position="right"
          aria-label="新的可用星币数量"
          @keyup.enter="submitAccount"
        />
        <p class="editor-note">保存后会写入账户操作日志。</p>
        <div class="editor-actions">
          <el-button size="small" @click="editorVisible = false">取消</el-button>
          <el-button size="small" type="primary" :loading="submitting" @click="submitAccount">
            保存
          </el-button>
        </div>
      </div>
    </el-popover>
    <span v-else class="balance-value">{{ formattedBalance }}</span>
  </div>
</template>

<style lang="scss" scoped>
.account-editor {
  display: inline-flex;
  justify-content: flex-end;
  min-width: 92px;
}

.balance-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  min-width: 72px;
  padding: 4px 7px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--brand-600);
  font: inherit;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background-color 0.18s ease;

  &:hover,
  &:focus-visible {
    outline: none;
    background: var(--brand-50);
  }
}

.balance-value {
  padding: 4px 7px;
  color: var(--app-ink);
  font-variant-numeric: tabular-nums;
}

.editor-panel {
  padding: 4px 2px 2px;
}

.editor-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.editor-title {
  color: var(--app-ink);
  font-weight: 650;
}

.editor-user {
  max-width: 150px;
  overflow: hidden;
  color: var(--app-text);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.balance-input {
  width: 100%;
}

.editor-note {
  margin: 9px 0 14px;
  color: var(--app-text);
  font-size: 12px;
  line-height: 1.5;
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
