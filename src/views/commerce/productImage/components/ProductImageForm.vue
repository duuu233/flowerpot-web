<script setup name="ProductImageForm">
import PageHeader from '@/components/PageHeader/index.vue'
import MultiUpload from '@/components/Upload/multiUpload.vue'
import { getVerifyTagType } from '@/views/commerce/utils'
import { useProductImageForm } from '../useProductImageForm'

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
  productOptions,
  categoryOptions,
  loading,
  submitting,
  rules,
  isAdd,
  isReadOnly,
  pageTitle,
  submitForm,
  backToList
} = useProductImageForm(props.mode)

function productOptionLabel(item) {
  const size = item.width && item.height ? ` · ${item.width}×${item.height}` : ''
  return `${item.productName || `产品 ${item.productId}`}${size}`
}

function handleOriginalImageUpdate(files) {
  const imageFiles = Array.isArray(files) ? files : []
  const imageFile = imageFiles[0]
  formData.imageFiles = imageFiles
  formData.thumbnailFiles = imageFile?.urlThumb
    ? [{ name: `${imageFile.name || '图库图片'}（缩略图）`, url: imageFile.urlThumb }]
    : []
}
</script>

<template>
  <div class="app-container">
    <PageHeader :title="pageTitle" icon="Picture">
      <template v-if="!isAdd && formData.verify !== null" #extra>
        <el-tag :type="getVerifyTagType(formData.verify)" effect="light" round>
          {{ Number(formData.verify) === 1 ? '启用中' : '已禁用' }}
        </el-tag>
      </template>
    </PageHeader>

    <el-card v-loading="loading" class="image-form-card" shadow="never">
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
              <h2 class="section-title">图片素材</h2>
              <p class="section-description">
                上传公共图库原图时自动生成缩略图，也可以单独上传图片替换。
              </p>
            </div>
          </div>

          <div class="upload-grid">
            <el-form-item class="upload-field" label="图库原图" prop="imageFiles">
              <MultiUpload
                :model-value="formData.imageFiles"
                :max-count="1"
                :disabled="isReadOnly"
                generate-thumbnail
                @update:model-value="handleOriginalImageUpdate"
              />
              <p class="field-hint">支持常见图片格式，单张不超过 15 MB。</p>
            </el-form-item>

            <el-form-item class="upload-field" label="缩略图（可替换）">
              <MultiUpload
                v-model="formData.thumbnailFiles"
                :max-count="1"
                :disabled="isReadOnly"
              />
              <p class="field-hint">默认使用自动生成的缩略图，可上传同等比例图片替换。</p>
            </el-form-item>
          </div>
        </section>

        <section class="form-section">
          <div class="section-heading">
            <span class="section-index">02</span>
            <div>
              <h2 class="section-title">内容信息</h2>
              <p class="section-description">标题用于检索，说明用于描述图片内容。</p>
            </div>
          </div>

          <div class="form-grid">
            <el-form-item class="form-field" label="图片标题" prop="title">
              <el-input
                v-model="formData.title"
                :disabled="isReadOnly"
                maxlength="30"
                placeholder="请输入图片标题"
                show-word-limit
              />
            </el-form-item>

            <el-form-item
              class="form-field form-field--wide"
              label="图片说明"
              prop="content"
            >
              <el-input
                v-model="formData.content"
                :disabled="isReadOnly"
                type="textarea"
                :rows="5"
                maxlength="500"
                placeholder="请输入图片内容说明"
                resize="vertical"
                show-word-limit
              />
            </el-form-item>
          </div>
        </section>

        <section class="form-section">
          <div class="section-heading">
            <span class="section-index">03</span>
            <div>
              <h2 class="section-title">投放范围</h2>
              <p class="section-description">设置图片所属分类以及可使用该图片的产品。</p>
            </div>
          </div>

          <div class="form-grid">
            <el-form-item class="form-field" label="图库分类" prop="categoryIdList">
              <el-select
                v-model="formData.categoryIdList"
                class="field-control"
                :disabled="isReadOnly"
                multiple
                filterable
                collapse-tags
                :max-collapse-tags="3"
                placeholder="请选择图库分类"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.categoryId"
                  :label="item.categoryName"
                  :value="item.categoryId"
                />
              </el-select>
            </el-form-item>

            <el-form-item class="form-field" label="适用产品" prop="productIdList">
              <el-select
                v-model="formData.productIdList"
                class="field-control"
                :disabled="isReadOnly"
                multiple
                filterable
                collapse-tags
                :max-collapse-tags="3"
                placeholder="请选择适用产品"
              >
                <el-option
                  v-for="item in productOptions"
                  :key="item.productId"
                  :label="productOptionLabel(item)"
                  :value="item.productId"
                />
              </el-select>
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
            保存图片
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.image-form-card {
  margin-top: 12px;
  border-color: var(--app-border);
}

.form-section + .form-section {
  margin-top: 6px;
  padding-top: 28px;
  border-top: 1px solid var(--app-border);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;
}

.section-index {
  display: inline-flex;
  width: 34px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--brand-50);
  color: var(--brand-600);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.08em;
}

.section-title {
  margin: 0;
  color: var(--app-ink);
  font-size: 16px;
  font-weight: 700;
}

.section-description,
.field-hint {
  margin: 4px 0 0;
  color: var(--app-text);
  font-size: 12px;
  line-height: 1.6;
}

.upload-grid,
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 28px;
  max-width: 920px;
}

.upload-field {
  min-height: 154px;
}

.form-field--wide {
  grid-column: 1 / -1;
}

.field-control {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--app-border);
}

@media (max-width: 760px) {
  .upload-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-field--wide {
    grid-column: auto;
  }
}
</style>
