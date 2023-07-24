<template>
    <div class="flex align-items-center flex-nowrap">
        <div class="mr-2 border-circle w-2rem h-2rem leader-badge"
            :style="`background-image: url(https://vitlgroupb1dd.blob.core.windows.net/vitl-images-new/${category}/${id}.png), url(https://vitlgroupb1dd.blob.core.windows.net/vitl-images-new/${category}/${id}.jpg)`">
            <Avatar v-if="alt" :label="alt" class="mr-2"
                style="background-color:#9c27b0; color: #ffffff; z-index: -1; position: relative;" shape="circle" />
        </div>
        <span>{{ text }}</span>
    </div>
</template>
<script lang="ts" setup>
defineProps<{
    text: string,
    id: number | string,
    category: string,
    alt: string,
}>()
</script>