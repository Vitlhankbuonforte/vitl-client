<template>
    <div v-if="loading" class="flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
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
                    <Column headerClass="text-dark bg-light font-medium" header="80%" />
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
                    <Column v-for="(col, index) of  columns " :key="col.field"
                        :header-class="'text-dark bg-light font-medium ' + col.class || ''" :header="col.title"
                        :header-style="{ 'border-top-right-radius': index === columns.length - 1 ? '6px' : 0, 'text-wrap': 'wrap' }">
                    </Column>
                </Row>
                <Row v-if="total">
                    <Column header-class="text-dark bg-light font-medium" :frozen="true" header="Total" :colspan="2"
                        header-style="text-align:center;" />
                    <Column header-class="text-dark bg-light font-medium" v-for="( col, index ) of  columns "
                        :header="total[col.field] + (index > 0 ? '%' : '')">
                    </Column>
                </Row>
            </ColumnGroup>

            <Column headerClass="text-dark bg-light font-medium" :frozen="true">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <slot name="body"></slot>
            <Column v-for="( col, index ) of  columns " :key="col.field" :field="col.field" body-class="p-0">
                <template #body="slotProps">
                    <div :class="`py-3 px-2 h-full field-content ${highlight && index > 0 ? highlighted(col.field, slotProps.data) : ''}`"
                        :data-index="slotProps.index" :data-field="col.field">
                        {{ slotProps.data[col.field] }}{{ index > 0 ? '%' : '' }}
                    </div>
                </template>
            </Column>
        </DataTable>
        <OverlayPanel ref="tooltip" append-to="body">
            <TooltipContent :columns="columns.slice(1)" :block="lastBlock" :value="tValue" viewOption="Percentages" />
        </OverlayPanel>
    </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useMainStore } from "../store/mainStore";
import { useTooltip } from '../composables/useTooltip'

const store = useMainStore();
const cols = store.percentageColumns;
const { data, loading, highlight, lastBlock, total } = storeToRefs(store);

const emit = defineEmits(['rowSelect']);
const onRowSelect = (event: any) => {
    emit('rowSelect', event);
};

const highlighted = (field: any, row: any) => {
    return row[field.replace(/\_P$/, lastBlock.value === 'Rep' ? '_HIGHLIGHT_REP' : '_HIGHLIGHT')] ? 'bg-primary' : '';
}

const columns = computed(() =>
    lastBlock.value === 'Rep' ?
        cols.filter(col => !['PERSONAL_PRODUCTION_P', 'PERSONAL_INSTALLS_P'].includes(col.field)) :
        cols
)

const { tooltip, tValue } = useTooltip({ columns: columns.value });

</script>

<style scoped lang="scss">
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