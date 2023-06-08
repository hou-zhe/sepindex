import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
const GroupManage =  () => import("@/views/storefront/group-manage")//返修
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "阳光收银", icon: "el-icon-s-home", affix: true },
      },
    ],
  },

  {
    path: "/storefront",
    component: Layout,
    redirect: "/storefront/storefront-manage",
    // name: 'Storefront',
    meta: { title: "店面信息", icon: "el-icon-s-shop" },
    children: [
      {
        path: "storefront-manage",
        name: "StorefrontManage",
        component: () => import("@/views/storefront/storefront-manage"),
        meta: { title: "店面管理", icon: "el-icon-s-shop",isshow:true },
      },
      {
        path: "operate-parameter",
        name: "OperateParameter",
        component: () => import("@/views/storefront/operate-parameter"),
        meta: { title: "运营参数管理", icon: "el-icon-s-tools",isshow:true },
      },
      {
        path: "region-manage",
        name: "RegionManage",
        component: () => import("@/views/storefront/region-manage"),
        meta: { title: "区域管理", icon: "el-icon-location" ,isshow:true},
      },
      {
        path: "room-type",
        name: "RoomType",
        component: () => import("@/views/storefront/room-type"),
        meta: { title: "房台类型", icon: "el-icon-discount",isshow:true },
      },
      {
        path: "room-manage",
        name: "RoomManage",
        component: () => import("@/views/storefront/room-manage"),
        meta: { title: "房台管理", icon: "el-icon-house",isshow:false },
      },
      {

        path: "group-manage",
        name: "GroupManage",
        component: GroupManage,
        meta: { title: "房台管理(单机)", icon: "el-icon-house" ,isshow:false},
      },
      {
        path: 'time-message',
        name: 'TimeMessage',
        component: () => import('@/views/storefront/timed-message'),
        meta: { title: '定时消息', icon: 'el-icon-chat-line-round',isshow:false}
      }

    ],
  },

  {
    path: "/billing",
    component: Layout,
    redirect: "/billing/schedule-manage",
    // name: 'ScheduleManage',
    meta: { title: "计费信息", icon: "el-icon-s-order" },
    children: [
      {
        path: "schedule-manage",
        name: "ScheduleManage",
        component: () => import("@/views/billing/schedule-manage"),
        meta: { title: "档期管理", icon: "el-icon-date" },
      },
      {
        path: "sessions-manage",
        name: "SessionsManage",
        component: () => import("@/views/billing/sessions-manage"),
        meta: { title: "场次管理", icon: "el-icon-sunny" },
      },
      {
        path: "fee-entry",
        name: "FeeEntry",
        component: () => import("@/views/billing/fee-entry"),
        meta: { title: "钟费录入", icon: "el-icon-document" },
      },
      {
        path: "billing-package",
        name: "BillingPackage",
        component: () => import("@/views/billing/billing-package"),
        meta: { title: "计费套餐", icon: "el-icon-s-marketing" },
      },
    ],
  },
  {
    path: "/commodity",
    component: Layout,
    redirect: "/commodity/commodity-kind",
    // name: 'CommodityKind',
    meta: { title: "物品信息", icon: "el-icon-s-goods" },
    children: [
      {
        path: "commodity-kind",
        name: "CommodityKind",
        component: () => import("@/views/commodity/commodity-kind"),
        meta: { title: "物品种类", icon: "nested" },
      },
      {
        path: "commodity-manage",
        name: "CommodityManage",
        component: () => import("@/views/commodity/commodity-manage"),
        meta: { title: "物品管理", icon: "el-icon-dessert" },
      },
      {
        path: "set-meat",
        name: "SetMeat",
        component: () => import("@/views/commodity/set-meat"),
        meta: { title: "套餐管理", icon: "el-icon-s-tools" },
      },
    ],
  },
  {
    path: "/stock",
    component: Layout,
    redirect: "/stock/stock-inbound",
    // name: 'CommodityKind',
    meta: { title: "库存", icon: "el-icon-s-goods" },
    children: [
      {
        path: "stock-inbound",
        name: "StockInbound",
        component: () => import("@/views/stock/stock-inbound"),
        meta: { title: "入库管理", icon: "nested" },
      },
      {
        path: "stock-warehouse",
        name: "StockWarehouse",
        component: () => import("@/views/stock/stock-warehouse"),
        meta: { title: "仓库盘点", icon: "el-icon-dessert" },
      }
    ],
  },
  {
    path: "/staff",
    component: Layout,
    redirect: "/staff/staff-inbound",
    // name: 'CommodityKind',
    meta: { title: "员工管理", icon: "el-icon-s-goods" },
    children: [
      {
        path: "staff-index",
        name: "StaffIndex",
        component: () => import("@/views/staff/staff-index"),
        meta: { title: "员工管理", icon: "nested" },
      },
      {
        path: "staff-position",
        name: "StaffPosition",
        component: () => import("@/views/staff/staff-position"),
        meta: { title: "职位管理", icon: "el-icon-dessert" },
      }
    ],
  },
  {
    path: "/statistics",
    component: Layout,
    redirect: "/statistics/cashier-daily",
    // name: 'CashierDaily',
    meta: { title: "查询统计", icon: "el-icon-s-help" },
    children: [
      {
        path: "cashier-daily",
        name: "CashierDaily",
        component: () => import("@/views/statistics/cashier-daily"),
        meta: { title: "收银日报表", icon: "table" },
      },
      {
        path: "bill-detail",
        name: "BillDetail",
        component: () => import("@/views/statistics/bill-detail"),
        meta: { title: "账单明细表", icon: "el-icon-s-data" },
      },
      {
        path: "payment-detail",
        name: "PaymentDetail",
        component: () => import("@/views/statistics/payment-detail"),
        meta: { title: "付款明细表", icon: "el-icon-s-data" },
      },
      // {
      //   path: "cashier-flow",
      //   name: "CashierFlow",
      //   component: () => import("@/views/statistics/cashier-flow"),
      //   meta: { title: "房费流水表", icon: "el-icon-s-data" },
      // },
      // {
      //   path: "founding-analysis",
      //   name: "FoundingAnalysis",
      //   component: () => import("@/views/statistics/founding-analysis"),
      //   meta: { title: "超市流水表", icon: "el-icon-data-analysis" },
      // },
      {
        path: "product-sales",
        name: "ProductSales",
        component: () => import("@/views/statistics/product-sales"),
        meta: { title: "商品销售表", icon: "el-icon-sold-out" },
      },
    ],
  },


  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
