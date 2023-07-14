<template>
    <NumbersTable class="m-3" @rowSelect="onRowSelect" v-if="store.viewOption == 'Numbers'">
        <Column bodyClass="text-left" headerClass="text-left text-dark bg-light font-medium" :frozen="true"
            :field="'REGION'" :header="'Region'">
            <template #body="slotProps">
                <div class="flex flex-nowrap">
                    <Avatar :label="slotProps.data['REGION'].substr(2, 2)" class="mr-2"
                        style="background-color:#9c27b0; color: #ffffff" shape="circle" />
                    <span class="short-text">{{ slotProps.data['REGION'] }}</span>
                </div>
            </template>
        </Column>
    </NumbersTable>
    <PercentagesTable class="m-3" @rowSelect="onRowSelect" v-else>
        <template v-slot:header>
            <Column headerClass="text-left text-dark bg-light font-medium" :frozen="true" :header="'Region'" :rowspan="5">
            </Column>
        </template>
        <template v-slot:body>
            <Column bodyClass="text-left" :frozen="true" :field="'REGION'">
                <template #body="slotProps">
                    <Avatar :label="slotProps.data['REGION'].substr(2, 2)" class="mr-2"
                        style="background-color:#9c27b0; color: #ffffff" shape="circle" />
                    <span class="short-text">{{ slotProps.data['REGION'] }}</span>
                </template>
            </Column>
        </template>
    </PercentagesTable>
</template>

<script lang="ts" setup>
import router from "../router";
import { useMainStore } from "../store/mainStore";
const store = useMainStore();
store.loadData("Region");

const onRowSelect = (event: any) => {
    store.selectedRegions = [event.data['REGION']];
    router.push('/districts');
}
</script>