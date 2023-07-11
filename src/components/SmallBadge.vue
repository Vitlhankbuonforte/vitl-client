<template>
    <div class="flex align-items-center">
        <div class="mr-2 border-circle w-2rem h-2rem leader-badge" :style="`background-image: url(https://vitlgroupb1dd.blob.core.windows.net/vitl-photos/${id}.jpg), url(https://vitlgroupb1dd.blob.core.windows.net/vitl-photos/${id}.svg);`"></div>
        <span>{{ text }}</span>    
    </div>
</template>
<script lang="ts" setup>
defineProps({
    text: String,
    id: String
})
</script>