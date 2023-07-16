<template>
    <div v-if="loading" class="p-4 flex h-30rem">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div style="width: 100%; overflow-x: auto;">

        <table style="width: 100%;" class="pulse-grid">
            <thead v-if="viewOption === 'Percentages'">
                <tr>
                    <th style="width:3rem;border:0;background:black!important;" header="" :rowspan="4" />
                    <th style="margin-left:-2px;border:0;background:black!important;" header="" :rowspan="4" />
                    <th style="margin-left:-2px;border:0;background:black!important;" header="" :rowspan="4" />
                </tr>
                <tr>
                    <th class="text-dark bg-primary font-bold " :colspan="4"
                        style="text-align:center;border-top-left-radius:6px">
                        Sales Execution
                    </th>

                    <th class="text-dark bg-primary font-bold" :colspan="4">Install Quality</th>
                    <th class="text-dark bg-primary font-bold" :colspan="2"
                        style="text-align:center;border-top-right-radius:6px">Team Development</th>
                </tr>
                <tr>
                    <th style="text-wrap:wrap;" class="text-dark bg-light font-medium border-bottom-1">Monthly Goal</th>
                    <th class="text-dark bg-light font-medium border-bottom-1">3/rep</th>
                    <th class="text-dark bg-light font-medium border-bottom-1">10</th>
                    <th class="border-right-1 text-dark bg-light font-medium border-bottom-1">30%</th>
                    <th class="text-dark bg-light font-medium border-bottom-1">60%</th>
                    <th class="text-dark bg-light font-medium border-bottom-1">25%</th>
                    <th class="text-dark bg-light font-medium border-bottom-1">6</th>
                    <th class="border-right-1 text-dark bg-light font-medium border-bottom-1">100%</th>
                    <th class="text-dark bg-light font-medium border-bottom-1">100%</th>
                    <th class="text-dark bg-light font-medium border-bottom-1">100%</th>
                </tr>
                <tr>
                    <th class="text-dark bg-light font-medium" style="border-bottom-left-radius: 6px">Weight</th>
                    <th class="text-dark bg-light font-medium">35</th>
                    <th class="text-dark bg-light font-medium">10</th>
                    <th class="border-right-1 text-dark bg-light font-medium">5</th>
                    <th class="text-dark bg-light font-medium">10</th>
                    <th class="text-dark bg-light font-medium">5</th>
                    <th class="text-dark bg-light font-medium">10</th>
                    <th class="border-right-1 text-dark bg-light font-medium">10</th>
                    <th class="text-dark bg-light font-medium">10</th>
                    <th class="text-dark bg-light font-medium" style="border-bottom-right-radius: 6px">5</th>
                </tr>
                <tr>
                    <th class="border-0 p-1" style="height:0.5rem;background:black!important;" :frozen="true" header=""
                        :colspan="12" />
                </tr>
            </thead>
            <thead>
                <tr>
                    <th class="px-3 left-0 z-2">#</th>
                    <th class="text-left z-2" style="left: 40px">
                        {{ lastBlock }}
                    </th>
                    <th>
                        {{ viewOption === 'Numbers' ? 'Sales' : 'Points' }}
                    </th>
                    <th>Month</th>
                    <th v-for="col in agColumns" :key="col.field" :class="col.class">{{ col.title }}</th>
                </tr>
                <tr></tr>
            </thead>
            <tr v-for="(row, index) in rows" @mouseenter="() => onMouseEnter(index)" @mouseleave="() => onMouseLeave()">
                <td v-if="index % 3 === 0" :rowspan="3" :style="cellStyle(true, index)" class="left-0 z-2">
                    {{ Math.floor(index / 3) + 1 }}
                </td>
                <td v-if="index % 3 === 0" :rowspan="3" :style="cellStyle(true, index)" class="z-2" style="left: 40px">
                    <!-- <SmallBadge v-if="lastBlock === 'Rep'" :id="row['REP_ID']" :text="row['REP_NAME']"
                        v-tooltip="row['REP_NAME']" class="short-text" category="rep"
                        :alt="row['REP_NAME'].split(' ').pop().substring(0, 2)" />
                    <div v-else-if="lastBlock === 'Region'" class="text-left font-medium">
                        <Avatar :label="row['REGION'].substr(2, 2)" class="mr-2"
                            style="background-color:#9c27b0; color: #ffffff" shape="circle" />
                        <span class="short-text">{{ row['REGION'] }}</span>
                    </div> -->
                    <SmallBadge :id="row['DM_REP_ID']" :text="row['DISTRICT']" category="team" v-tooltip="row['DISTRICT']"
                        class="short-text" :alt="row['DISTRICT'].split(' ').pop().substring(0, 2)" />
                </td>
                <td v-if="index % 3 === 0" :rowspan="3" :style="cellStyle(true, index)">
                    {{ row.POINTS || (row.SALES ?
                        Math.round(row.SALES * 100) + '%' : '0') }}</td>
                <td :style="cellStyle(false, index)">
                    {{ row.MONTH }}</td>
                <td v-for="col in agColumns" :key="col.field" :style="cellStyle(false, index, row, col)">
                    <div class="text-center">
                        {{ getValue(row, col) }}
                    </div>
                </td>
            </tr>
            <tr>
                <th class="text-dark font-medium left-0 z-2" :colspan="2" footerStyle="text-align:center">
                    Total
                </th>
                <th>{{ totalCalc(columns[0].field)?.toString() }}</th>
                <th></th>
                <th class="text-dark font-medium" v-for="col of columns.slice(1)">{{ totalCalc(col.field)?.toString()
                }}</th>
            </tr>
        </table>
        <!-- <AgGridVue class="ag-theme-alpine" style="width: 100%; height: 100%;" domLayout="autoHeight" :columnDefs="agColumns"
            :rowData="data"></AgGridVue> -->
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMainStore } from "../store/mainStore";
import { computed, ref } from "vue";


const store = useMainStore();
const { data: rows, loading, lastBlock, viewOption, highlight } = storeToRefs(store);

interface Props {
    columns: any[];
}

const props = defineProps<Props>();

const agColumns = computed(() => props.columns.filter(c => c.field !== 'SALES' && c.field !== 'POINTS').map(c => ({
    ...c,
})));

let hoverRow = ref<number>(-1);

const onMouseEnter = (rowIndex: number) => {
    hoverRow.value = rowIndex;
}

const onMouseLeave = () => {
    hoverRow.value = -1;
}

const cellStyle = (span: boolean, index: number, row?: any, col?: any) => {
    const hovered = onHover(span, index);

    if (viewOption.value === 'Percentages' && highlight.value && row && col && highlighted(col.field, row[col.field])) {
        return {
            background: hovered ? '#97ef1b33' : '#97ef1b',
            color: hovered ? 'white' : '#444'
        };
    }
    if (span) {
        return { background: hovered ? 'black' : index % 2 === 0 ? '#444' : '#2f2f2f' };
    }
    return { background: hovered ? 'black' : Math.floor(index / 3) % 2 === 0 ? '#444' : '#2f2f2f' }
}

const onHover = (span: boolean, index: number) => {
    return span ? hoverRow.value >= index && hoverRow.value <= index + 2 : Math.floor(hoverRow.value / 3) === Math.floor(index / 3);
}

const getValue = (row: any, col: any) => {
    return viewOption.value === 'Percentages' ? col.field != 'POINTS' ?
        (row[col.field] ?
            Math.round(row[col.field] * 100) + '%' : '0') : row[col.field] : Math.round(row[col.field] || 0)
}

const totalCalc = (field: string) => {
    if (viewOption.value === 'Numbers') {
        return Math.round(rows.value.reduce((p: number, x: any) => p + (x[field] || 0), 0));
    }
    if (field == 'POINTS') {
        return Math.round(rows.value.reduce((p: number, x: any) => p + (x[field] || 0), 0) / rows.value.length).toString();

    } else {
        return Math.round(rows.value.reduce((p: number, x: any) => p + (x[field] || 0), 0) / rows.value.length * 100) + '%';
    }
}

const highlighted = (field: any, item: any) => {
    const rules: any = {
        SALES_GOAL: 1,
        DM_PERSONAL: 1,
        SG_P: 0.3,
        PRR_P: 0.75,
        VAR: 0.25,
        DM_PERSONAL_INSTALLS: 1,
        CLEAN_P: 1,
        RWS_P: 1,
        NET_PPW_P: 1,
    }
    return rules[field] <= item ? 'bg-primary' : '';
}

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
}
</style>