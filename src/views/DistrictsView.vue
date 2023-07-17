<template>
    <div class="w-full flex flex-column xl:flex-row align-items-stretch">
        <Leaderboard class="m-2 lg:m-4 mb-0" />
        <NumbersTable @rowSelect="onRowSelect"
            class="p-2 lg:m-3 flex-grow-1 white-space-nowrap overflow-hidden text-overflow-ellipsis"
            v-if="store.viewOption == 'Numbers'">
            <Column bodyClass="text-left" headerClass="text-left text-dark bg-light font-medium" :frozen="true"
                :field="'DISTRICT'" :header="'District'">
                <template #body="slotProps">
                    <SmallBadge :id="slotProps.data['DM_REP_ID']" :text="slotProps.data['DISTRICT']" category="team"
                        v-tooltip="slotProps.data['DISTRICT']" class="short-text"
                        :alt="slotProps.data['DISTRICT'].split(' ').pop().substring(0, 2)" />
                </template>
            </Column>
        </NumbersTable>
        <PercentagesTable @rowSelect="onRowSelect"
            class="p-2 lg:m-3 flex-grow-1 white-space-nowrap overflow-hidden text-overflow-ellipsis" v-else>
            <template v-slot:header>
                <Column headerClass="text-left text-dark bg-light font-medium" :headerStyle="'width:8%'" :frozen="true"
                    :header="'District'" :rowspan="5"></Column>
            </template>
            <template v-slot:body>
                <Column bodyClass="text-left" :headerStyle="'width:8%'" :frozen="true" :field="'DISTRICT'">
                    <template #body="slotProps">
                        <SmallBadge :id="slotProps.data['DM_REP_ID']" :text="slotProps.data['DISTRICT']"
                            v-tooltip="slotProps.data['DISTRICT']" class="short-text" category="team"
                            :alt="slotProps.data['DISTRICT'].split(' ').pop().substring(0, 2)" />
                    </template>
                </Column>
            </template>
        </PercentagesTable>

    </div>
</template>

<script lang="ts" setup>
import SmallBadge from "../components/SmallBadge.vue";
import router from "../router";
import { useMainStore } from "../store/mainStore";
const store = useMainStore();

store.resetFilter('District')
store.loadData("District");

const onRowSelect = (event: any) => {
    store.selectedDistricts = [event.data['DISTRICT']];
    router.push('/reps');
}
</script>