<template>
    <NumbersTable class="p-2 lg:m-3" v-if="store.viewOption == 'Numbers'">
        <Column bodyClass="text-left" headerClass="text-left text-dark bg-light font-medium" :frozen="true"
            :field="'REP_NAME'" :header="'Rep'">
            <template #body="slotProps">
                <SmallBadge :id="slotProps.data['REP_ID']" :text="slotProps.data['REP_NAME']"
                    v-tooltip="slotProps.data['REP_NAME']" class="short-text" category="rep"
                    :alt="slotProps.data['REP_NAME']?.split(' ').pop().substring(0, 2) || ''" />
            </template>
        </Column>
    </NumbersTable>
    <PercentagesTable class="p-2 lg:m-3" v-else>
        <template v-slot:header>
            <Column headerClass="text-left text-dark bg-light font-medium" :frozen="true" :header="'Rep'" :rowspan="5">
            </Column>
        </template>
        <template v-slot:body>
            <Column bodyClass="text-left" :frozen="true" :field="'REP_NAME'">
                <template #body="slotProps">
                    <SmallBadge :id="slotProps.data['REP_ID']" :text="slotProps.data['REP_NAME']"
                        v-tooltip="slotProps.data['REP_NAME']" category="rep" class="short-text"
                        :alt="slotProps.data['REP_NAME'].split(' ').pop().substring(0, 2)" />
                </template>
            </Column>
        </template>
    </PercentagesTable>
</template>
<script lang="ts" setup>
import { useMainStore } from "../store/mainStore";
const store = useMainStore();
store.loadData("Rep");
</script>