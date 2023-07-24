<template>
    <div v-if="loading" class="flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else class="card p-3 xl:p-5">
        <h2 class="m-0 mb-2 xl:mb-3">Top 5 Performers</h2>
        <div class="grid lg:pb-2 flex-row xl:flex-column overflow-x-auto xl:overflow-x-hidden flex-nowrap xl:flex-wrap">
            <div v-for="lead, index of topPerformers"
                class="col xl:col-12 flex flex-column flex-auto xl:flex-row m-3 my-2 align-items-center z-0">
                <div class="relative w-6rem h-6rem lg:w-7rem lg:h-7rem leader-badge border-circle flex align-items-center justify-content-center"
                    :class="borders[index]" :style="`background-image: ${lead.image}`">
                    <Avatar :label="lead.label.split(' ').pop().substring(0, 2)" class="w-full h-full text-2xl"
                        style="background-color:#9c27b0; color: #ffffff; z-index: -1; position: relative;" shape="circle" />
                    <span class="absolute bottom-0 py-1 px-2 text-sm border-circle" :class="backgrounds[index]"
                        style="margin-bottom: -0.75rem;"> {{ index + 1 }}</span>
                </div>
                <div class="mt-3 xl:mt-0 xl:ml-2 xl:align-items-start flex flex-column align-items-center">
                    <div class="text-white text-sm lg:text-xl short-text">{{ lead.label }}</div>
                    <div class="text-primary font-bold text-2xl lg:text-4xl">{{ renderScore(lead) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";
import { computed } from "vue";

const borders = ['border-gold border-solid', 'border-silver border-solid', 'border-bronze border-solid', '', ''];
const backgrounds = ['bg-gold', 'bg-silver', 'bg-bronze', 'bg-gray-600', 'bg-gray-600'];

const store = useMainStore();
const { data, pulseData, loading, sortBy, viewOption, pulseView, lastBlock } = storeToRefs(store);
const renderScore = (lead: any) => {
    if (viewOption.value == 'Numbers' || sortBy.value == "POINTS") {
        return Math.round(lead[sortBy.value] || 0).toString();
    } else {
        return Math.round((lead[sortBy.value] || 0) * 100) + '%';
    }
}
const topPerformers = computed(() => {
    let topPs: any[] = [];
    if (pulseView.value) {
        for (let i = 0; i < 15; i += 3) {
            if (pulseData.value[i]) { topPs.push(pulseData.value[i]); }
        }
    } else {
        topPs = data.value.slice(0, 5)
    }
    return topPs.map(lead => {
        const image = `https://vitlgroupb1dd.blob.core.windows.net/vitl-images-new/${lastBlock.value === 'District' ? 'team' : 'rep'}/${lastBlock.value === 'District' ? lead.DM_REP_ID : lead.REP_ID}`;
        return {
            ...lead,
            image: `url(${image}.png), url(${image}.jpg)`,
            label: lead[lastBlock.value === 'District' ? 'DISTRICT' : 'REP_NAME'],
        }
    })
})
</script>