<template>
    <div v-if="loading" class="flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else-if="pulseView">
        <GridTable :columns="columns" />
    </div>
    <div v-else class="relative">
        <DataTable stripedRows :resizable-columns="true" columnResizeMode="expand"
            class="w-full p-datatable-sm border-round" :scrollable="true" selectionMode="single" @rowSelect="onRowSelect"
            :value="data">
            <ColumnGroup type="header">
                <Row>
                    <Column headerStyle="width:3rem;border:0;background:black!important;" header="" :rowspan="4"
                        :pt="{ headerCell: { class: 'round' } }" />
                    <Column headerStyle="margin-left:-2px;border:0;background:black!important;" header="" :rowspan="4"
                        :pt="{ headerCell: { class: 'round' } }" />
                </Row>
                <Row>
                    <Column headerClass="text-dark bg-primary font-bold " header="Sales Execution"
                        :colspan="lastBlock !== 'Rep' ? 4 : 3" headerStyle="text-align:center;border-top-left-radius:6px" />
                    <Column headerClass="text-dark bg-primary font-bold" header="Install Quality"
                        :colspan="lastBlock !== 'Rep' ? 4 : 3" />
                    <Column headerClass="text-dark bg-primary font-bold" header="Team Development" :colspan="2"
                        :pt="{ headerCell: { class: 'round' } }"
                        headerStyle="text-align:center;border-top-right-radius:6px" />
                </Row>
                <Row>
                    <Column headerStyle="text-wrap:wrap;" headerClass="text-dark bg-light font-medium"
                        header="Monthly Goal" />
                    <Column headerClass="text-dark bg-light font-medium" header="3/rep" />
                    <Column v-if="lastBlock !== 'Rep'" headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="border-right-1 text-dark bg-light font-medium" header="30%" />
                    <Column headerClass="text-dark bg-light font-medium" header="60%" />
                    <Column headerClass="text-dark bg-light font-medium" header="25%" />
                    <Column v-if="lastBlock !== 'Rep'" headerClass="text-dark bg-light font-medium" header="6" />
                    <Column headerClass="border-right-1 text-dark bg-light font-medium" header="100%" />
                    <Column headerClass="text-dark bg-light font-medium" header="100%" />
                    <Column headerClass="text-dark bg-light font-medium" header="100%" />
                </Row>
                <Row>
                    <Column headerClass="text-dark bg-light font-medium" header="Weight"
                        headerStyle="border-bottom-left-radius: 6px" />
                    <Column headerClass="text-dark bg-light font-medium" header="35" />
                    <Column v-if="lastBlock !== 'Rep'" headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="border-right-1 text-dark bg-light font-medium" header="5" />
                    <Column headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="text-dark bg-light font-medium" header="5" />
                    <Column v-if="lastBlock !== 'Rep'" headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="border-right-1 text-dark bg-light font-medium" header="10" />
                    <Column headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="text-dark bg-light font-medium" header="5"
                        headerStyle="border-bottom-right-radius: 6px" />
                </Row>
                <Row>
                    <Column headerClass="border-0 p-1" headerStyle="height:0.5rem;background:black!important;"
                        :frozen="true" header="" :colspan="12" />
                </Row>
                <Row>
                    <Column headerClass="text-dark bg-light font-medium" :frozen="true" header="#"
                        :pt="{ headerCell: { class: 'round' } }" headerStyle="border-top-left-radius: 6px" />
                    <slot name="header"></slot>
                    <Column headerStyle="text-wrap:wrap;" v-for="col of columns" :key="col.field"
                        :header-class="'text-dark bg-light font-medium ' + col.class || ''" :header="col.title">
                    </Column>
                </Row>
            </ColumnGroup>

            <Column headerClass="text-dark bg-light font-medium" :frozen="true">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <slot name="body"></slot>
            <Column v-for="col of columns" :key="col.field" :field="col.field" body-class="p-0">
                <template #body="slotProps">
                    <div :class="`py-3 px-2 h-full ${highlight ? highlighted(col.field, slotProps.data[col.field]) : ''}`">
                        {{
                            col.field != 'POINTS' ?
                            (slotProps.data[col.field] ?
                                Math.round(slotProps.data[col.field] * 100) + '%' : '0') : slotProps.data[col.field] }}</div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";
import { computed } from "vue";

const store = useMainStore();
const cols = store.percentageColumns;
const { data, loading, highlight, pulseView, lastBlock } = storeToRefs(store);

const emit = defineEmits(['rowSelect']);
const onRowSelect = (event: any) => {
    console.log(event);
    emit('rowSelect', event);
};

const highlighted = (field: any, item: any) => {
    const rules: any = {
        SALES_GOAL: 1,
        DM_PERSONAL: 1,
        SG_P: 0.3,
        PRR_P: 0.75,
        VAR: 0.25,
        DM_PERSONAL_INSTALLS: 1,
        CLEAN_P: 1,
        RWS_P: 1,
        NET_PPW_P: 1,
    }
    return rules[field] <= item ? 'bg-primary' : '';
}

const columns = computed(() =>
    lastBlock.value === 'Rep' ?
        cols.filter(col => !['DM_PERSONAL', 'DM_PERSONAL_INSTALLS'].includes(col.field)) :
        cols
)
</script>

<style scoped>
:deep(.p-datatable-wrapper) {
    padding-bottom: 8px;
}
</style>