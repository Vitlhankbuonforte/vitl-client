import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import RegionsView from "../views/RegionsView.vue";
import DistrictsView from "../views/DistrictsView.vue";
import RepsView from "../views/RepsView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "main",
    redirect: "regions",
  },
  {
    path: "/regions",
    name: "regions",
    component: RegionsView,
  },
  {
    path: "/districts",
    name: "districts",
    component: DistrictsView,
  },
  {
    path: "/reps",
    name: "reps",
    component: RepsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
