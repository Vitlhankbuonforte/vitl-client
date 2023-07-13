<template>
    <div v-if="loading" class="p-4 flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else class="card p-1 lg:p-5 max-w-full">
        <h2 class="m-0 lg:mb-3">Top 5 Performers</h2>
        <div class="flex lg:flex-column justify-content-start overflow-x-scroll lg:overflow-x-hidden overflow-y-hidden lg:pb-2">
            <div v-for="lead, index of data.slice(0, 5)" class="flex flex-column lg:flex-row m-3 my-2 align-items-center">
            <div class="relative w-6rem h-6rem lg:w-7rem lg:h-7rem leader-badge border-circle flex align-items-center justify-content-center" :class="borders[index]" :style="`background-image: url(https://vitlgroupb1dd.blob.core.windows.net/vitl-images-new/team/${lead.DM_REP_ID}.png);`">
                <span class="absolute bottom-0 py-1 px-2 text-sm border-circle" :class="backgrounds[index]" style="margin-bottom: -0.75rem;"> {{  index+1 }}</span>
            </div>
            <div class="mt-3 lg:mt-0 lg:ml-3">
                <div class="w-full text-white text-xl short-text">{{  lead['DISTRICT'] }}</div>
                <div class="w-full ml-2 text-primary font-bold text-2xl lg:text-4xl">{{  renderScore(lead) }}</div>
            </div>
        </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";

const borders = ['border-gold border-solid', 'border-silver border-solid', 'border-bronze border-solid', '', ''];
const backgrounds = ['bg-gold', 'bg-silver', 'bg-bronze', 'bg-gray-600', 'bg-gray-600'];
 
const store = useMainStore();
const { data, loading, sortBy, viewOption } = storeToRefs(store);
const renderScore = (lead:any) => {
    if(viewOption.value == 'Numbers' || sortBy.value == "POINTS") {
        return Math.round(lead[sortBy.value] || 0).toString();
    } else {
        return Math.round((lead[sortBy.value] || 0) * 100) + '%';
    }
}
</script>