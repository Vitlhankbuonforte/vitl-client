import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Leaderboard from './components/Leaderboard.vue';
import NumbersTable from './components/NumbersTable.vue';
import PercentagesTable from './components/PercentagesTable.vue';
import SmallBadge from './components/SmallBadge.vue';
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import router from './router';
import Breadcrumb from 'primevue/breadcrumb';
import SelectButton from 'primevue/selectbutton';
import Card from 'primevue/card';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Skeleton from 'primevue/skeleton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import ColumnGroup from 'primevue/columngroup';
import Avatar from 'primevue/avatar';
import Tooltip from 'primevue/tooltip';
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

const app = createApp(App);

app.use(PrimeVue);
app.directive('tooltip', Tooltip);
app.component('Breadcrumb', Breadcrumb);
app.component('Menu', Menu);
app.component('SelectButton', SelectButton);
app.component('Button', Button);
app.component('Sidebar', Sidebar);
app.component('Card', Card);
app.component('MultiSelect', MultiSelect);
app.component('Calendar', Calendar);
app.component('Dropdown', Dropdown);
app.component('Skeleton', Skeleton);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Avatar', Avatar);
app.component('SmallBadge', SmallBadge);

app.component('Leaderboard', Leaderboard);
app.component('NumbersTable', NumbersTable);
app.component('PercentagesTable', PercentagesTable);

app.use(createPinia());
app.use(router);
app.mount('#app');
