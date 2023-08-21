<template>
    <div v-if="loading" class="flex h-30rem w-full">
        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
    </div>
    <div v-else style="width: 100%; overflow-x: auto;" class="pb-2">
        <table style="width: 100%;" class="pulse-grid">
            <thead>
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
                    <th class="text-dark bg-light font-medium border-bottom-1">80%</th>
                    <th class="text-dark bg-light font-medium border-bottom-1">0</th>
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
                    <th class="text-dark bg-light font-medium">10</th>
                    <th class="text-dark bg-light font-medium">0</th>
                    <th class="border-right-1 text-dark bg-light font-medium">10</th>
                    <th class="text-dark bg-light font-medium">15</th>
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
                        Points
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
                    :data-index="index" data-field="PULSE_POINTS">
                    {{ Math.round(row.PULSE_POINTS) }}</td>

                <td :style="cellStyle(false, index)" class="field-content" :data-index="index" data-field="MONTH">
                    {{ row.MONTH }}</td>

                <td v-for="col in agColumns" :key="col.field" :style="cellStyle(false, index, row, col)"
                    class="field-content" :data-index="index" :data-field="col.field">
                    <div class="text-center">
                        {{ row[col.field] || 0 }}%
                    </div>
                </td>
            </tr>
            <thead v-if="total" type="footer">
                <tr>
                    <th class="text-dark bg-light font-medium text-center" :frozen="true" colspan="2">Total</th>
                    <th footerClass="text-dark bg-light font-medium" v-for="(col, index) of agColumns">
                        {{ total[col.field] }}{{ index > 0 ? '%' : '' }}
                    </th>
                </tr>
            </thead>
        </table>
        <OverlayPanel ref="tooltip" append-to="body">
            <TooltipContent :columns="agColumns" :block="lastBlock" :value="tValue" :viewOption="viewOption"
                :pulse="true" />
        </OverlayPanel>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useMainStore } from "../store/mainStore";
import { useTooltip } from '../composables/useTooltip'

const store = useMainStore();
const { pulseData: rows, loading, lastBlock, viewOption, highlight, percentageColumns, total } = storeToRefs(store);

const agColumns = computed(() => percentageColumns.value.filter(c => c.field !== 'DM_RM_POINTS').map(c => ({
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

    if (highlight.value && row && col && highlighted(col.field, row[col.field])) {
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


const highlighted = (field: any, item: any) => {
    const rules: any = {
        SALES_GOAL_P: 1,
        PERSONAL_PRODUCTION_P: 1,
        SG_SALES_P: 0.3,
        PRR_P: 0.6,
        VAR: 0.25,
        PERSONAL_INSTALLS_P: 1,
        CLEAN_SALES_P: 1,
        RWS_P: 1,
        NET_PPW_TO_TARGET_P: 1,
    }
    return rules[field] <= item ? 'bg-primary' : '';
}

const { tooltip, tValue } = useTooltip({ columns: percentageColumns.value, pulse: true });
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
