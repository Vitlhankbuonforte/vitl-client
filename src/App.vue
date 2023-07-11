<template>
  <div class="bg-surface p-4 flex justify-content-between z-5 relative">
    <img src="./assets/Logo.png" alt="" id="logo_image" />
    <div class="hidden md:flex grow align-items-center">
      <Breadcrumb :model="blockLevels" :exact="true" />
      <SelectButton class="mx-6" v-model="viewOption" :options="viewOptions" aria-labelledby="basic" />
      <Button outlined icon="pi pi-sliders-h" @click="store.toggleFilter()"></Button>
    </div>
    <div class="flex md:hidden grow align-items-center">
      <Button outlined icon="pi pi-bars" @click="sidebarOpen=!sidebarOpen"></Button>
    </div>
  </div>
  <transition enter-active-class="transition-duration-300 transition-ease-out"
    enter-from-class="transition-transform -translate-y-100 opacity-0" enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-duration-200 transition-ease-in" leave-from-class="translate-y-0 opacity-100"
    leave-to-class="transition-transform -translate-y-100 opacity-0">
    <div class="hidden md:flex p-5 mb-0 bg-surface border-top-1 border-gray-100" v-if="store.filterActive">
      <div class="flex gap-2 justify-content-left w-full">
        <div class="w-2 p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Month</label>
          <Calendar v-model="month" selectionMode="single" view="month" dateFormat="mm/yy" :manualInput="false">
          </Calendar>
        </div>
        <div class="w-2 p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Regions</label>
          <MultiSelect v-model="selectedRegions" :options="allRegions" placeholder="(All)" />
        </div>
        <div class="w-2 p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Channels</label>
          <MultiSelect v-model="selectedChannels" :options="allChannels" placeholder="(All)" />
        </div>
        <div class="w-2 p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Districts</label>
          <MultiSelect v-model="selectedDistricts" :options="allDistricts" placeholder="(All)" />
        </div>
        <div class="w-2 p-2 bg-gray-100 border-round flex flex-column">
          <label class="text-gray-900 mb-1">DMs</label>
          <MultiSelect v-model="selectedDMs" :options="allDMs" placeholder="(All)" />
        </div>
        <div class="w-2 p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Sort</label>
          <Dropdown v-model="sortBy" :option-label="'title'" :option-value="'field'" :options="sortItems"
            placeholder="Sort By" />
        </div>
        <div class="w-2 p-2 bg-gray-100 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Production</label>         
          <Dropdown v-model="selectedProduction" :options="['All Production','Grind Production']" placeholder="" />
        </div>      
        <!-- <div class="w-2 p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Production</label>
          <Dropdown v-model="selectedProduction" :option-label="'title'" :option-value="'field'" :options="allProductions"
            placeholder="(ALL)" />
        </div> -->
      </div>
    </div>
  </transition>
  <Sidebar v-model:visible="sidebarOpen">
    <template #header>
            <div class="flex">
              <img src="./assets/Logo.svg" alt="" class="mr-8" />
            </div>
    </template>
    <div class="flex flex-column grow align-items-center gap-2">
      <Breadcrumb :model="blockLevels" :exact="true" />
      <SelectButton class="w-full flex" :pt="{ button: { class: 'flex-grow-1'}}" v-model="viewOption" :options="viewOptions" aria-labelledby="basic" />
      <div class="w-full flex flex-column gap-2">
        <div class="w-full p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Month</label>
          <Calendar v-model="month" selectionMode="single" view="month" dateFormat="mm/yy" :manualInput="false">
          </Calendar>
        </div>
        <div class="p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Regions</label>
          <MultiSelect v-model="selectedRegions" :options="allRegions" placeholder="(All)" />
        </div>
        <div class="p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Channels</label>
          <MultiSelect v-model="selectedChannels" :options="allChannels" placeholder="(All)" />
        </div>
        <div class="p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Districts</label>
          <MultiSelect v-model="selectedDistricts" :options="allDistricts" placeholder="(All)" />
        </div>
        <div class="p-2 bg-gray-100 border-round flex flex-column">
            <label class="text-gray-900 mb-1">DMs</label>         
            <MultiSelect v-model="selectedDMs" :options="allDMs" placeholder="(All)" />
          </div>      
        <div class="p-2 bg-gray-50 border-round flex flex-column">
          <label class="text-gray-900 mb-1">Sort</label>
          <Dropdown v-model="sortBy" :option-label="'title'" :option-value="'field'" :options="sortItems"
            placeholder="Sort By" />
        </div>
      </div>
    </div>
  </Sidebar>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useMainStore } from "./store/mainStore";
import { storeToRefs } from "pinia";

const store = useMainStore();

const sidebarOpen = ref(false);

const {
  month,
  allRegions,
  selectedRegions,
  allChannels,
  selectedChannels,
  allDistricts,
  selectedDistricts,
  allDMs, 
  selectedDMs,
  selectedProduction,
  sortBy,
  sortItems,
  viewOption,
  viewOptions
} = storeToRefs(store);

watch(viewOption, () => {
  store.resetSortBy();
});

watch(month, () => {
  store.loadData();
})

const blockLevels = [{
  label: 'Regions',
  to: '/regions',
},
{
  label: 'Districts',
  to: '/districts',
},
{
  label: 'Reps',
  to: '/reps',
}];

</script>

<style scoped></style>
