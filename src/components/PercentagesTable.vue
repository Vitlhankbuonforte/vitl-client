<template>
    <div v-if="loading" class="p-4 flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else class="p-0">
        <DataTable stripedRows :resizable-columns="true" columnResizeMode="expand" class="w-full p-datatable-sm border-round" :scrollable="true"  selectionMode="single" @rowSelect="onRowSelect" :value="data">
            <ColumnGroup type="header">
                <Row>
                    <Column headerStyle="width:3rem;border:0;background:black!important;" :frozen="true" header="" :rowspan="4" :pt="{ headerCell: { class: 'round' }}"/>
                    <Column headerStyle="margin-left:-2px;border:0;background:black!important;" :frozen="true" header="" :rowspan="4" :pt="{ headerCell: { class: 'round' }}"/>
                </Row>
                <Row>
                    <Column headerClass="text-dark bg-primary font-bold " header="Sales Execution" :colspan="4" headerStyle="text-align:center;border-top-left-radius:6px"/>
                    <Column headerClass="text-dark bg-primary font-bold" header="Install Quality" :colspan="4" />
                    <Column headerClass="text-dark bg-primary font-bold" header="Team Development" :colspan="2" :pt="{ headerCell: { class: 'round' }}" headerStyle="text-align:center;border-top-right-radius:6px"/>
                </Row>
                <Row>
                    <Column  headerStyle="text-wrap:wrap;" headerClass="text-dark bg-light font-medium" header="Monthly Goal" />
                    <Column headerClass="text-dark bg-light font-medium" header="3/rep" />
                    <Column headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="border-right-1 text-dark bg-light font-medium" header="30%" />
                    <Column headerClass="text-dark bg-light font-medium" header="75%" />
                    <Column headerClass="text-dark bg-light font-medium" header="25%" />
                    <Column headerClass="text-dark bg-light font-medium" header="6" />
                    <Column headerClass="border-right-1 text-dark bg-light font-medium" header="100%" />
                    <Column headerClass="text-dark bg-light font-medium" header="100%" />
                    <Column headerClass="text-dark bg-light font-medium" header="100%" />
                </Row>
                <Row>
                    <Column headerClass="text-dark bg-light font-medium" header="Weight" headerStyle="border-bottom-left-radius: 6px"/>
                    <Column headerClass="text-dark bg-light font-medium" header="30" />
                    <Column headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="border-right-1 text-dark bg-light font-medium" header="5" />
                    <Column headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="text-dark bg-light font-medium" header="5" />
                    <Column headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="border-right-1 text-dark bg-light font-medium" header="10" />
                    <Column headerClass="text-dark bg-light font-medium" header="10" />
                    <Column headerClass="text-dark bg-light font-medium" header="10" headerStyle="border-bottom-right-radius: 6px" />
                </Row>
                <Row>
                    <Column headerClass="border-0 p-1" headerStyle="height:0.5rem;background:black!important;" :frozen="true" header="" :colspan="12"/>
                </Row>
                <Row>
                    <Column headerClass="text-dark bg-light font-medium" :frozen="true" header="#" :pt="{ headerCell: { class: 'round' }}" headerStyle="border-top-left-radius: 6px"/>
                    <slot name="header"></slot>
                    <Column  headerStyle="text-wrap:wrap;" v-for="col of columns" :key="col.field" :header-class="'text-dark bg-light font-medium ' + col.class || ''" :header="col.title">
                    </Column>
                </Row>
            </ColumnGroup>
            
            <Column headerClass="text-dark bg-light font-medium" :frozen="true" >
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <slot name="body"></slot>
            <Column v-for="col of columns" :key="col.field" :field="col.field">
                <template #body="slotProps">{{ col.field != 'POINTS' ? (slotProps.data[col.field] ? Math.round(slotProps.data[col.field] * 100)+'%':'N/A') : slotProps.data[col.field] }}</template>
            </Column>
            <ColumnGroup type="footer">
                <Row>
                    <Column footerClass="text-dark bg-light font-medium" :frozen="true" footer="Total" :colspan="2" footerStyle="text-align:center;border-bottom-left-radius: 6px" />
                    <Column footerClass="text-dark bg-light font-medium" v-for="col of columns" :footer="totalCalc(data, col.field)">
                    </Column>
                </Row>
            </ColumnGroup>
        </DataTable>
    </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";


const totalCalc = (data: any[], field: string) => {
    if(field == 'POINTS') {
        return Math.round(data.reduce((p: number, x: any) => p + x[field], 0)/data.length).toString();

    } else {
        return Math.round(data.reduce((p: number, x: any) => p + x[field], 0)/data.length * 100) + '%';
    }
}
const store = useMainStore();
const columns = store.percentageColumns;
const { data, loading } = storeToRefs(store);

const emit = defineEmits(['rowSelect']);
const onRowSelect = (event: any) => {
    console.log(event);
    emit('rowSelect', event);
};
</script>