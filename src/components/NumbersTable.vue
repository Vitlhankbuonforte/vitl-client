<template>
    <div v-if="loading" class="flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else>
        <DataTable stripedRows class="w-full p-datatable-sm" :scrollable="true" selectionMode="single"
            @rowSelect="onRowSelect" :value="data">
            <ColumnGroup type="header">
                <Row>
                    <Column headerClass="w-3rem text-dark bg-light font-medium" :frozen="true" header="#"
                        :pt="{ headerCell: { class: 'round' } }" />
                    <slot></slot>
                    <Column headerStyle="text-wrap:wrap;" headerClass="text-dark bg-light font-medium"
                        v-for="col of columns" :key="col.field" :field="col.field" :header="col.title"
                        :pt="{ headerCell: { class: 'round' } }" />
                </Row>
                <Row v-if="total">
                    <Column header-class="text-dark bg-light font-medium" :frozen="true" header="Total" :colspan="2"
                        header-style="text-align:center" />
                    <Column header-class="text-dark bg-light font-medium" v-for="col of columns" :header="total[col.field]">
                    </Column>
                </Row>
            </ColumnGroup>

            <Column :frozen="true" :pt="{ headerCell: { class: 'round' } }">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <slot></slot>
            <Column body-class="p-0" v-for="col of columns" :key="col.field" :field="col.field" :header="col.title"
                :pt="{ headerCell: { class: 'round' } }">
                <template #body="slotProps">
                    <div class="py-3 px-2 h-full field-content" :data-index="slotProps.index" :data-field="col.field">{{
                        slotProps.data[col.field] || 0 }}</div>
                </template>
            </Column>
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

:deep(.p-datatable-thead tr:last-child th:last-child) {
    border-top-right-radius: 0;
}

:deep(.p-datatable-thead tr:first-child th:last-child) {
    border-top-right-radius: 6px;
    overflow: hidden;
}
</style>
