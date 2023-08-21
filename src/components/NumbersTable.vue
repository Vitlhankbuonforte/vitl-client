<template>
    <div v-if="loading" class="flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
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
            <Column headerStyle="text-wrap:wrap;" headerClass="text-dark bg-light font-medium" body-class="p-0"
                v-for="col of columns" :key="col.field" :field="col.field" :header="col.title"
                :pt="{ headerCell: { class: 'round' } }">
                <template #body="slotProps">
                    <div class="py-3 px-2 h-full field-content" :data-index="slotProps.index" :data-field="col.field">{{
                        slotProps.data[col.field] || 0 }}</div>
                </template>
            </Column>
            <ColumnGroup v-if="total" type="footer">
                <Row>
                    <Column footerClass="text-dark bg-light font-medium" :frozen="true" footer="Total" :colspan="2"
                        footerStyle="text-align:center" />
                    <Column footerClass="text-dark bg-light font-medium" v-for="col of columns" :footer="total[col.field]">
                    </Column>
                </Row>
            </ColumnGroup>
        </DataTable>
        <!-- <OverlayPanel ref="tooltip" append-to="body">
            <TooltipContent :columns="columns" :block="lastBlock" :value="tValue" viewOption="Numbers" />
        </OverlayPanel> -->
    </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";
import { computed } from "vue";
// import { useTooltip } from '../composables/useTooltip'

const store = useMainStore();
const cols = store.numberColumns;
const { data, loading, lastBlock, total } = storeToRefs(store);

const emit = defineEmits(['rowSelect']);
const onRowSelect = (event: any) => {
    emit('rowSelect', event);
};

const columns = computed(() =>
    lastBlock.value === 'Rep' ?
        cols.filter(col => !['PERSONAL_SALES', 'PERSONAL_INSTALLS'].includes(col.field)) :
        cols
)

// const { tooltip, tValue } = useTooltip({ columns: columns.value });

</script>

<style scoped>
:deep(.p-datatable-wrapper) {
    padding-bottom: 8px;
}

.field-content {
    border: 1px solid transparent;

    &:hover {
        border: 1px solid #ececec;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
}
</style>
