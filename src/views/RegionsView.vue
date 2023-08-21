<template>
    <NumbersTable class="p-2 lg:m-3" @rowSelect="onRowSelect" v-if="store.viewOption == 'Numbers'">
        <Column bodyClass="text-left" headerClass="text-left text-dark bg-light font-medium" :frozen="true"
            :field="'REGION'" :header="'Region'">
            <template #body="slotProps">
                <SmallBadge :id="slotProps.data['RM_REP_ID'] || ''" :text="slotProps.data['REGION']"
                    v-tooltip="slotProps.data['REGION']" category="region" class="short-text"
                    :alt="slotProps.data['REGION'].split(' ').pop().substring(0, 2)" />
            </template>
        </Column>
    </NumbersTable>
    <PercentagesTable class="p-2 lg:m-3" @rowSelect="onRowSelect" v-else>
        <template v-slot:header>
            <Column headerClass="text-left text-dark bg-light font-medium" :frozen="true" :header="'Region'" :rowspan="5">
            </Column>
        </template>
        <template v-slot:body>
            <Column bodyClass="text-left" :frozen="true" :field="'REGION'">
                <template #body="slotProps">
                    <SmallBadge :id="slotProps.data['RM_REP_ID'] || ''" :text="slotProps.data['REGION']"
                        v-tooltip="slotProps.data['REGION']" category="region" class="short-text"
                        :alt="slotProps.data['REGION']?.split(' ').pop().substring(0, 2) || ''" />
                </template>
            </Column>
        </template>
    </PercentagesTable>
</template>

<script lang="ts" setup>
import router from "../router";
import { useMainStore } from "../store/mainStore";
const store = useMainStore();

store.resetFilter('Region')
store.loadData("Region");

const onRowSelect = (event: any) => {
    store.selectedRegions = [event.data['REGION']];
    router.push('/districts');
}
</script>