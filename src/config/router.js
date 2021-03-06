import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/components/pages/Home";
import Contract from "@/components/pages/Contract";
import Admin from "@/components/pages/Admin";
import Rents from "@/components/pages/Rents";
import RentByDay from "@/components/pages/RentByDay";
import RentByWeek from "@/components/pages/RentByWeek";

import TenantAdmin from "@/components/admin/TenantAdmin";
import UserAdmin from "@/components/admin/UserAdmin";
import RoomAdmin from "@/components/admin/RoomAdmin";
import BalanceAdmin from "@/components/admin/BalanceAdmin";


import Auth from "@/components/auth/Auth";
import Profile from "@/components/admin/Profile";

Vue.use(VueRouter);

const routes = [
  {
    name: "home",
    path: "/",
    component: Home
  },
  {
    name: "contract",
    path: "/contract",
    component: Contract
  },
  {
    name: "admin",
    path: "/admin",
    component: Admin
  },
  {
    name: "rents",
    path: "/rents",
    component: Rents
  },
  {
    name: "rentbyday",
    path: "/rentbyday",
    component: RentByDay
  },
  {
    name: "rentbyweek",
    path: "/rentbyweek",
    component: RentByWeek
    },
  { name: "auth", path: "/auth/:email?", component: Auth },
  { name: "profile", path: "/admin/users/profile", component: Profile },
  {
    name: "tenantAdmin",
    path: "/admin/tenants",
    component: TenantAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "userAdmin",
    path: "/admin/users",
    component: UserAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "RoomAdmin",
    path: "/admin/rooms",
    component: RoomAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "BalanceAdmin",
    path: "/admin/balances",
    component: BalanceAdmin,
    meta: { requiresAdmin: true }
  },
 
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
