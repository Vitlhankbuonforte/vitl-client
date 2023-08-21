<template>
    <div v-if="loading" class="flex h-30rem w-full">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else style="width: 100%; overflow-x: auto;" class="pb-2">
        <table style="width: 100%;" class="pulse-grid">
            <thead>
                <tr>
                    <th class="px-3 left-0 z-2">#</th>
                    <th class="text-left z-2" style="left: 40px">
                        {{ lastBlock }}
                    </th>
                    <th>
                        Sales
                    </th>
                    <th>Month</th>
                    <th v-for="col in agColumns" :key="col.field" :class="(col as any).class">{{ col.title }}</th>
                </tr>
                <tr></tr>
            </thead>
            <tr v-for="(row, index) in rows" @mouseenter="() => onMouseEnter(index)" @mouseleave="() => onMouseLeave()">
                <td v-if="index % 3 === 0" :rowspan="3" :style="cellStyle(true, index)" class="left-0 z-2">
                    {{ Math.floor(index / 3) + 1 }}
                </td>
                <td v-if="index % 3 === 0" :rowspan="3" :style="cellStyle(true, index)" class="z-2" style="left: 40px">
                    <SmallBadge :id="row['DM_REP_ID'] || ''" :text="row['DISTRICT']" category="team"
                        v-tooltip="row['DISTRICT']" class="short-text"
                        :alt="row['DISTRICT'].split(' ').pop().substring(0, 2)" />
                </td>

                <td v-if="index % 3 === 0" :rowspan="3" :style="cellStyle(true, index)" class="field-content"
                    :data-index="index" data-field="SALES">
                    {{ Math.round(row.SALES) }}</td>

                <td :style="cellStyle(false, index)" :data-index="index" data-field="MONTH" class="field-content">
                    {{ row.MONTH }}</td>

                <td v-for="col in agColumns" :key="col.field" :style="cellStyle(false, index)" class="field-content"
                    :data-index="index" :data-field="col.field">
                    <div class="text-center">
                        {{ row[col.field] || 0 }}
                    </div>
                </td>
            </tr>
        </table>
        <OverlayPanel ref="tooltip" append-to="body">
            <TooltipContent :columns="agColumns" :block="lastBlock" :value="tValue" viewOption="Numbers" pulse />
        </OverlayPanel>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useMainStore } from "../store/mainStore";
import { useTooltip } from '../composables/useTooltip'

const store = useMainStore();
const { pulseData: rows, loading, lastBlock, numberColumns } = storeToRefs(store);

const agColumns = computed(() => numberColumns.value.filter(c => c.field !== 'SALES').map(c => ({
    ...c,
})));

let hoverRow = ref<number>(-1);

const onMouseEnter = (rowIndex: number) => {
    hoverRow.value = rowIndex;
}

const onMouseLeave = () => {
    hoverRow.value = -1;
}

const cellStyle = (span: boolean, index: number) => {
    const hovered = onHover(span, index);

    if (span) {
        return { background: hovered ? 'black' : index % 2 === 0 ? '#444' : '#2f2f2f' };
    }
    return { background: hovered ? 'black' : Math.floor(index / 3) % 2 === 0 ? '#444' : '#2f2f2f' }
}

const onHover = (span: boolean, index: number) => {
    return span ? hoverRow.value >= index && hoverRow.value <= index + 2 : Math.floor(hoverRow.value / 3) === Math.floor(index / 3);
}

const { tooltip, tValue } = useTooltip({ columns: numberColumns.value, pulse: true });
</script>

<style lang="scss">
.pulse-grid {
    border-spacing: 0;
    border-collapse: separate;
    position: relative;
    overflow-x: auto;

    @media screen and (max-width: 960px) {

        th,
        td {
            font-size: 0.8rem;
        }
    }

    th,
    td {
        overflow: hidden;
        white-space: nowrap;
        padding: 0.5rem;
        text-align: center;
        border-color: #ccc;
        position: sticky;
        z-index: 1;
    }

    td {
        padding: 12px 0.5rem;
    }

    th {
        background: #eaeaea;
        color: #2f2f2f;
        font-weight: 500;
    }

    tr {
        &:nth-child(odd) {
            background-color: #2F2F2F;
        }

        &:nth-child(even) {
            background-color: #444;
        }

        cursor: pointer;
    }

    tr:first-child {
        th:first-child {
            border-top-left-radius: 8px;
        }

        th:last-child {
            border-top-right-radius: 8px;
        }
    }

    tr:last-child {
        th:first-child {
            border-bottom-left-radius: 8px;
        }

        th:last-child {
            border-bottom-right-radius: 8px;
        }
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
}
</style>