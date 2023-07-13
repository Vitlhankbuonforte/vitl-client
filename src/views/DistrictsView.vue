<template>
    <div class="w-full flex flex-column lg:flex-row align-items-stretch">
        <Leaderboard class="my-2 lg:m-3 mr-0"></Leaderboard>
        <NumbersTable @rowSelect="onRowSelect"
            class="lg:m-3 flex-grow-1 white-space-nowrap overflow-hidden text-overflow-ellipsis"
            v-if="store.viewOption == 'Numbers'">
            <Column bodyClass="text-left" headerClass="text-left text-dark bg-light font-medium" :frozen="true"
                :field="'DISTRICT'" :header="'District'">
                <template #body="slotProps">
                    <SmallBadge :id="slotProps.data['DM_REP_ID']" :text="slotProps.data['DISTRICT']" category="team"
                        v-tooltip="slotProps.data['DISTRICT']" class="short-text" />
                </template>
            </Column>
        </NumbersTable>
        <PercentagesTable @rowSelect="onRowSelect"
            class="lg:m-3 flex-grow-1 white-space-nowrap overflow-hidden text-overflow-ellipsis" v-else>
            <template v-slot:header>
                <Column headerClass="text-left text-dark bg-light font-medium" :headerStyle="'width:8%'" :frozen="true"
                    :header="'District'" :rowspan="5"></Column>
            </template>
            <template v-slot:body>
                <Column bodyClass="text-left" :headerStyle="'width:8%'" :frozen="true" :field="'DISTRICT'">
                    <template #body="slotProps">
                        <SmallBadge :id="slotProps.data['DM_REP_ID']" :text="slotProps.data['DISTRICT']"
                            v-tooltip="slotProps.data['DISTRICT']" class="short-text" category="team" />
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
store.loadData("District");

const onRowSelect = (event: any) => {
    store.selectedDistricts = [event.data['DISTRICT']];
    router.push('/reps');
}
</script>