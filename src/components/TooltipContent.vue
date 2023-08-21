<template>
    <div v-if="value">
        <div class="flex gap-3">
            <div>
                <div v-for="f of (FIELDS[block] as any)" class="mb-2">
                    {{ f.title }}:
                </div>
                <div v-if="pulse">{{ viewOption === 'Numbers' ? 'Sales' : 'Points' }}:</div>
                <div v-if="!pulse || (value.currentField.field !== 'SALES' && value.currentField.field !== 'PULSE_POINTS')"
                    class="mt-2">
                    <div class="py-2 mb-2 font-semibold">{{ value.currentField.title }}:</div>
                    <div v-if="pulse && value.currentField.field !== 'MONTH'" class="mb-2">Month:</div>
                    <template v-for="col of columns" :key="col.field">
                        <div class="mb-2">
                            {{ col.title }}:
                        </div>
                    </template>
                </div>
            </div>
            <div>
                <div v-for="f of (FIELDS[block] as any)" class="mb-2">
                    {{ value[f.field] || '*' }}
                </div>
                <div v-if="pulse">{{ viewOption === 'Numbers' ? value['SALES'] :
                    Math.round(value['PULSE_POINTS'] || 0) }}</div>
                <div v-if="!pulse || (value.currentField.field !== 'SALES' && value.currentField.field !== 'PULSE_POINTS')"
                    class="mt-2">
                    <div class="py-2  mb-2 font-semibold">{{ viewOption === 'Percentages' &&
                        value.currentField.title !==
                        'Points' && value.currentField.field !== 'MONTH' ?
                        (value[value.currentField.field] || 0) + '%' : (value[value.currentField.field] || '0') }}</div>
                    <div v-if="pulse && value.currentField.field !== 'MONTH'" class="mb-2">{{ value.MONTH }}</div>
                    <template v-for="col of columns" :key="col.field">
                        <div class="mb-2">
                            {{ parseFloat((value[col.field + 'OINTS'] || 0).toFixed(2)) }}
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

const FIELDS: any = {
    Region: [{
        field: 'rank',
        title: 'Rank'
    }, {
        field: 'REGION',
        title: 'Region'
    }, {
        field: 'RM_NAME',
        title: 'RM Name'
    }, {
        field: 'CHANNEL',
        title: 'Channel'
    }],
    District: [{
        field: 'rank',
        title: 'Rank'
    }, {
        field: 'DISTRICT',
        title: 'District'
    }, {
        field: 'DM_NAME',
        title: 'DM Name'
    }, {
        field: 'CHANNEL',
        title: 'Channel'
    }],
    Rep: [{
        field: 'rank',
        title: 'Rank'
    }, {
        fieid: 'REP_NAME',
        title: 'Rep'
    }, {
        field: 'DISTRICT',
        title: 'District'
    }, {
        field: 'DM_NAME',
        title: 'DM Name'
    }, {
        field: 'CHANNEL',
        title: 'Channel'
    }]
}

interface Props {
    value: null | any;
    columns: any[];
    block: 'Region' | 'District' | 'Rep',
    viewOption: 'Percentages' | 'Numbers',
    pulse?: boolean
}

defineProps<Props>()
</script>