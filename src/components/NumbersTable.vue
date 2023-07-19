<template>
    <div v-if="loading" class="flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else-if="pulseView">
        <GridTable :columns="columns" />
    </div>
    <div v-else>
        <DataTable stripedRows class="w-full p-datatable-sm" :scrollable="true" selectionMode="single"
            @rowSelect="onRowSelect" :value="data">
            <Column headerClass="w-3rem text-dark bg-light font-medium" :frozen="true" header="#"
                :pt="{ headerCell: { class: 'round' } }">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <slot></slot>
            <Column headerStyle="text-wrap:wrap;" headerClass="text-dark bg-light font-medium" v-for="col of columns"
                :key="col.field" :field="col.field" :header="col.title" :pt="{ headerCell: { class: 'round' } }">
                <template #body="slotProps">{{ Math.round(slotProps.data[col.field] || 0) }}</template>
            </Column>
        </DataTable>
    </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";
import { computed } from "vue";

const store = useMainStore();
const cols = store.numberColumns;
const { data, loading, pulseView, lastBlock } = storeToRefs(store);

const emit = defineEmits(['rowSelect']);
const onRowSelect = (event: any) => {
    console.log(event);
    emit('rowSelect', event);
};

const columns = computed(() =>
    lastBlock.value === 'Rep' ?
        cols.filter(col => !['PERSONAL_SALES', 'PERSONAL_INSTALLS'].includes(col.field)) :
        cols
)
</script>

<style scoped>
:deep(.p-datatable-wrapper) {
    padding-bottom: 8px;
}
</style>
