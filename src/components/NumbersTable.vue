<template>
    <div v-if="loading" class="p-4 flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else class="p-0">
        <DataTable stripedRows class="w-full p-datatable-sm" :scrollable="true" selectionMode="single" @rowSelect="onRowSelect" :value="data">
            <Column headerClass="w-3rem text-dark bg-light font-medium" :frozen="true" header="#" :pt="{ headerCell: { class: 'round' }}">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <slot></slot>
            <Column headerStyle="text-wrap:wrap;" headerClass="text-dark bg-light font-medium" v-for="col of columns" :key="col.field" :field="col.field" :header="col.title" :pt="{ headerCell: { class: 'round' }}">
                <template #body="slotProps">{{ Math.round(slotProps.data[col.field] || 0) }}</template>
            </Column>
            <ColumnGroup type="footer">
                <Row>
                    <Column footerClass="text-dark bg-light font-medium" :frozen="true" footer="Total" :colspan="2" footerStyle="text-align:center"/>
                    <Column footerClass="text-dark bg-light font-medium" v-for="col of columns" :footer="totalCalc(data, col.field)?.toString()"></Column>
                </Row>
            </ColumnGroup>
        </DataTable>
    </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";

const totalCalc = (data: any[], field: string) => {
    return Math.round(data.reduce((p: number, x: any) => p + x[field], 0));
}
const store = useMainStore();
const columns = store.numberColumns;
const { data, loading } = storeToRefs(store);

const emit = defineEmits(['rowSelect']);
const onRowSelect = (event: any) => {
    console.log(event);
    emit('rowSelect', event);
};
</script>