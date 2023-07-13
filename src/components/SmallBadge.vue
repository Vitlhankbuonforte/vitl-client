<template>
    <div class="flex align-items-center">
        <div class="mr-2 border-circle w-2rem h-2rem leader-badge"
            :style="`background-image: url(https://vitlgroupb1dd.blob.core.windows.net/vitl-images-new/${category}/${id}.png), url(https://vitlgroupb1dd.blob.core.windows.net/vitl-images-new/${category}/${id}.jpg)`">
        </div>
        <span>{{ text }}</span>
    </div>
</template>
<script lang="ts" setup>

defineProps({
    text: String,
    id: String,
    category: String
})
</script>