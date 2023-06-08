import request from "@/utils/request";

export function ossgetpolicytoken(type) {
  return request({
    url: "/cashier/oss/getpolicytoken",
    method: "get",
    params: { type },
  });
}

export function storelist(store_id, lock_dog, page, limit) {
  return request({
    url: "/cashier/store/list",
    method: "get",
    params: {
      store_id,
      lock_dog,
      page,
      limit,
    },
  });
}
export function storeimport(data) {
  return request({
    url: "/cashier/store/import",
    method: "post",
    data,
  });
}

export function storeexport(store_id, type) {
  return request({
    url: "/cashier/store/export",
    method: "get",
    params: { store_id, type },
  });
}

export function storeselect(store_id) {
  return request({
    url: "/cashier/store/select",
    method: "get",
    params: { store_id },
  });
}
export function storeparam(store_id) {
  return request({
    url: "/cashier/store/param",
    method: "get",
    params: {
      store_id,
    },
  });
}
export function storeparamp(data) {
  return request({
    url: "/cashier/store/param",
    method: "post",
    data,
  });
}
export function storechargeconfig(store_id) {
  return request({
    url: "/cashier/store/charge-config",
    method: "get",
    params: {
      store_id,
    },
  });
}
export function storechargeconfigp(data) {
  return request({
    url: "/cashier/store/charge-config",
    method: "post",
    data,
  });
}
export function storeconfig(store_id) {
  return request({
    url: "/cashier/store/config",
    method: "get",
    params: {
      store_id,
    },
  });
}
// 区域
export function arealist(store_id, page, limit) {
  return request({
    url: "/cashier/area/list",
    method: "get",
    params: {
      store_id,
      page,
      limit,
    },
  });
}
export function areaadd(data) {
  return request({
    url: "/cashier/area/add",
    method: "post",
    data,
  });
}
export function areainfo(id) {
  return request({
    url: "/cashier/area/info",
    method: "get",
    params: { id },
  });
}
export function areaupdate(data) {
  return request({
    url: "/cashier/area/update",
    method: "post",
    data,
  });
}
export function areadelete(data) {
  return request({
    url: "/cashier/area/delete",
    method: "post",
    data,
  });
}
export function areastatus(data) {
  return request({
    url: "/cashier/area/status",
    method: "post",
    data,
  });
}
// 房台类型
export function roomtypelist(store_id, page, limit) {
  return request({
    url: "/cashier/room-type/list",
    method: "get",
    params: { store_id, page, limit },
  });
}
export function roomtypeadd(data) {
  return request({
    url: "/cashier/room-type/add",
    method: "post",
    data,
  });
}
export function roomtypeinfo(id) {
  return request({
    url: "/cashier/room-type/info",
    method: "get",
    params: { id },
  });
}
export function roomtypeupdate(data) {
  return request({
    url: "/cashier/room-type/update",
    method: "post",
    data,
  });
}
export function roomtypedelete(data) {
  return request({
    url: "/cashier/room-type/delete",
    method: "post",
    data,
  });
}
export function roomtypestatus(data) {
  return request({
    url: "/cashier/room-type/status",
    method: "post",
    data,
  });
}
// 房间管理
export function roomlist(
  store_id,
  room_area_id,
  room_type_id,
  name,
  status,
  page,
  limit
) {
  return request({
    url: "/cashier/room/list",
    method: "get",
    params: { store_id, room_area_id, room_type_id, name, status, page, limit },
  });
}
// 房间管理(单机)
export function grouproomlist(params) {
  return request({
    url: "/cashier/room/list/group",
    method: "get",
    params: { ...params },
  });
}
export function roomadd(data) {
  return request({
    url: "/cashier/room/add",
    method: "post",
    data,
  });
}
//新增单机组
export function grouproomadd(data) {
  return request({
    url: "/cashier/room/add/group",
    method: "post",
    data,
  });
}
export function roominfo(id) {
  return request({
    url: "/cashier/room/info",
    method: "get",
    params: { id },
  });
}

//单机详情
export function grouproominfo(id) {
  return request({
    url: "/cashier/room/info/group",
    method: "get",
    params: { id },
  });
}
export function roomupdate(data) {
  return request({
    url: "/cashier/room/update",
    method: "post",
    data,
  });
}
//修改单机
export function grouproomupdate(data) {
  return request({
    url: "/cashier/room/update/group",
    method: "post",
    data,
  });
}
export function roomdelete(data) {
  return request({
    url: "/cashier/room/delete",
    method: "post",
    data,
  });
}
//删除单机
export function grouproomdelete(data) {
  return request({
    url: "/cashier/room/delete/group",
    method: "post",
    data,
  });
}
export function roomstatus(data) {
  return request({
    url: "/cashier/room/status",
    method: "post",
    data,
  });
}
export function areaselect(store_id) {
  return request({
    url: "/cashier/area/select",
    method: "get",
    params: { store_id },
  });
}
export function roomtypeselect(store_id) {
  return request({
    url: "/cashier/room-type/select",
    method: "get",
    params: { store_id },
  });
}

// 物品
export function goodscategorylist(store_id, name, status) {
  return request({
    url: "/cashier/goods-category/list",
    method: "get",
    params: { store_id, name, status },
  });
}

export function goodscategoryadd(data) {
  return request({
    url: "/cashier/goods-category/add",
    method: "post",
    data,
  });
}
export function goodscategoryinfo(id) {
  return request({
    url: "/cashier/goods-category/info",
    method: "get",
    params: { id },
  });
}
export function goodscategoryupdate(data) {
  return request({
    url: "/cashier/goods-category/update",
    method: "post",
    data,
  });
}

export function goodscategorydelete(data) {
  return request({
    url: "/cashier/goods-category/delete",
    method: "post",
    data,
  });
}
export function goodscategorystatus(data) {
  return request({
    url: "/cashier/goods-category/status",
    method: "post",
    data,
  });
}

// 口味
export function requirementlist(store_id) {
  return request({
    url: "/cashier/goods/requirement/list",
    method: "get",
    params: { store_id },
  });
}
export function requirementadd(data) {
  return request({
    url: "/cashier/goods/requirement/add",
    method: "post",
    data,
  });
}
export function requirementdelete(data) {
  return request({
    url: "/cashier/goods/requirement/delete",
    method: "post",
    data,
  });
}

// 计量单位
export function goodsunitlist(store_id) {
  return request({
    url: "/cashier/goods/unit/list",
    method: "get",
    params: { store_id },
  });
}
export function goodsunitadd(data) {
  return request({
    url: "/cashier/goods/unit/add",
    method: "post",
    data,
  });
}
export function goodsunitdelete(data) {
  return request({
    url: "/cashier/goods/unit/delete",
    method: "post",
    data,
  });
}

// 物品管理
export function goodslist1(store_id, name, good_type_id, status, page, limit) {
  return request({
    url: "/cashier/goods/list/1",
    method: "get",
    params: { store_id, name, good_type_id, status, page, limit },
  });
}
export function goodsadd1(data) {
  return request({
    url: "/cashier/goods/add/1",
    method: "post",
    data,
  });
}
export function goodsinfo1(id) {
  return request({
    url: "/cashier/goods/info/1",
    method: "get",
    params: { id },
  });
}
export function goodsupdate1(data) {
  return request({
    url: "/cashier/goods/update/1",
    method: "post",
    data,
  });
}
export function goodsdelete1(data) {
  return request({
    url: "/cashier/goods/delete/1",
    method: "post",
    data,
  });
}
export function goodsstatus1(data) {
  return request({
    url: "/cashier/goods/status/1",
    method: "post",
    data,
  });
}
export function goodscategoryselect(store_id) {
  return request({
    url: "/cashier/goods-category/select",
    method: "get",
    params: { store_id },
  });
}
// 套餐管理
export function goodslist2(store_id, name, good_type_id, status, page, limit) {
  return request({
    url: "/cashier/goods/list/2",
    method: "get",
    params: { store_id, name, good_type_id, status, page, limit },
  });
}
export function goodsadd2(data) {
  return request({
    url: "/cashier/goods/add/2",
    method: "post",
    data,
  });
}
export function goodsinfo2(id) {
  return request({
    url: "/cashier/goods/info/2",
    method: "get",
    params: { id },
  });
}
export function goodsupdate2(data) {
  return request({
    url: "/cashier/goods/update/2",
    method: "post",
    data,
  });
}
export function goodsdelete2(data) {
  return request({
    url: "/cashier/goods/delete/2",
    method: "post",
    data,
  });
}
export function goodsstatus2(data) {
  return request({
    url: "/cashier/goods/status/2",
    method: "post",
    data,
  });
}
// 套餐分组
export function goodsgrouplist(good_id) {
  return request({
    url: "/cashier/goods/group/list",
    method: "get",
    params: { good_id },
  });
}
export function goodsgroupadd(data) {
  return request({
    url: "/cashier/goods/group/add",
    method: "post",
    data,
  });
}
export function goodsgroupinfo(id) {
  return request({
    url: "/cashier/goods/group/info",
    method: "get",
    params: { id },
  });
}
export function goodsgroupupdate(data) {
  return request({
    url: "/cashier/goods/group/update",
    method: "post",
    data,
  });
}

export function goodsgroupselectedgoods(good_id, id) {
  return request({
    url: "/cashier/goods/group/selected-goods",
    method: "get",
    params: { good_id, id },
  });
}
export function goodsgroupunselectedgoods(
  store_id,
  id,
  good_type_id,
  good_name
) {
  return request({
    url: "/cashier/goods/group/unselected-goods",
    method: "get",
    params: { store_id, id, good_type_id, good_name },
  });
}
export function goodsgroupaddgoods(data) {
  return request({
    url: "/cashier/goods/group/add-goods",
    method: "post",
    data,
  });
}
export function goodsgroupdeletegoods(data) {
  return request({
    url: "/cashier/goods/group/delete-goods",
    method: "post",
    data,
  });
}
export function goodsgroupupdategoodsnum(data) {
  return request({
    url: "/cashier/goods/group/update-goods-num",
    method: "post",
    data,
  });
}
export function goodsgroupupdategoodssort(data) {
  return request({
    url: "/cashier/goods/group/update-goods-sort",
    method: "post",
    data,
  });
}

// 系统图库
export function goodspicturelist(type_id) {
  return request({
    url: "/cashier/goods/picture/list",
    method: "get",
    params: { type_id },
  });
}
export function goodspicturetypes(type_id) {
  return request({
    url: "/cashier/goods/picture/types",
    method: "get",
    params: { type_id },
  });
}

// 档期管理
export function schedulelist(store_id, page, limit) {
  return request({
    url: "/cashier/charge/schedule/list",
    method: "get",
    params: { store_id, page, limit },
  });
}
export function scheduleadd(data) {
  return request({
    url: "/cashier/charge/schedule/add",
    method: "post",
    data,
  });
}
export function scheduleupdate(data) {
  return request({
    url: "/cashier/charge/schedule/update",
    method: "post",
    data,
  });
}
export function scheduledelete(data) {
  return request({
    url: "/cashier/charge/schedule/delete",
    method: "post",
    data,
  });
}
export function schedulestatus(data) {
  return request({
    url: "/cashier/charge/schedule/status",
    method: "post",
    data,
  });
}
export function scheduleselect(store_id) {
  return request({
    url: "/cashier/charge/schedule/select",
    method: "get",
    params: { store_id },
  });
}
// 节日列表
export function holidaylist(store_id, page, limit) {
  return request({
    url: "/cashier/charge/holiday/list",
    method: "get",
    params: { store_id, page, limit },
  });
}
export function holidayadd(data) {
  return request({
    url: "/cashier/charge/holiday/add",
    method: "post",
    data,
  });
}
export function holidayupdate(data) {
  return request({
    url: "/cashier/charge/holiday/update",
    method: "post",
    data,
  });
}
export function holidaydelete(data) {
  return request({
    url: "/cashier/charge/holiday/delete",
    method: "post",
    data,
  });
}
export function holidaystatus(data) {
  return request({
    url: "/cashier/charge/holiday/status",
    method: "post",
    data,
  });
}

// 场次管理
export function periodlist(store_id, name, status, page, limit) {
  return request({
    url: "/cashier/charge/period/list",
    method: "get",
    params: { store_id, name, status, page, limit },
  });
}
export function periodadd(data) {
  return request({
    url: "/cashier/charge/period/add",
    method: "post",
    data,
  });
}
export function periodinfo(id) {
  return request({
    url: "/cashier/charge/period/info",
    method: "get",
    params: { id },
  });
}
export function periodupdate(data) {
  return request({
    url: "/cashier/charge/period/update",
    method: "post",
    data,
  });
}
export function perioddelete(data) {
  return request({
    url: "/cashier/charge/period/delete",
    method: "post",
    data,
  });
}
export function periodstatus(data) {
  return request({
    url: "/cashier/charge/period/status",
    method: "post",
    data,
  });
}
export function periodselect(store_id) {
  return request({
    url: "/cashier/charge/period/select",
    method: "get",
    params: { store_id },
  });
}
// 房费录入

export function timelist(store_id, type, schedule_id) {
  return request({
    url: "/cashier/charge/time/list",
    method: "get",
    params: { store_id, type, schedule_id },
  });
}
export function timeadd(data) {
  return request({
    url: "/cashier/charge/time/add",
    method: "post",
    data,
  });
}

// 计费套餐
export function packagelist(store_id, name, status, page, limit) {
  return request({
    url: "/cashier/charge/package/list",
    method: "get",
    params: { store_id, name, status, page, limit },
  });
}
export function packageadd(data) {
  return request({
    url: "/cashier/charge/package/add",
    method: "post",
    data,
  });
}
export function packageinfo(id) {
  return request({
    url: "/cashier/charge/package/info",
    method: "get",
    params: { id },
  });
}
export function packageupdate(data) {
  return request({
    url: "/cashier/charge/package/update",
    method: "post",
    data,
  });
}
export function packagedelete(data) {
  return request({
    url: "/cashier/charge/package/delete",
    method: "post",
    data,
  });
}
export function packagestatus(data) {
  return request({
    url: "/cashier/charge/package/status",
    method: "post",
    data,
  });
}
export function packageunselectedgoods(
  store_id,
  good_ids,
  good_type_id,
  good_name
) {
  return request({
    url: "/cashier/charge/package/unselected-goods",
    method: "get",
    params: { store_id, good_ids, good_type_id, good_name },
  });
}

export function cashierreportorder(
  store_id,
  room_type_id,
  transaction_id,
  merchant_order_id,
  status,
  page,
  limit
) {
  return request({
    url: "/cashier/report/order",
    method: "get",
    params: {
      store_id,
      room_type_id,
      transaction_id,
      merchant_order_id,
      status,
      page,
      limit,
    },
  });
}

// 房费流水表
export function cashierreportpartyorder(
  store_id,
  room_type_id,
  room_id,
  status,
  start,
  end,
  page,
  limit
) {
  return request({
    url: "/cashier/report/party-order",
    method: "get",
    params: {
      store_id,
      room_type_id,
      room_id,
      status,
      start,
      end,
      page,
      limit,
    },
  });
}
// 商品流水表
export function cashierreportgoodsorder(
  store_id,
  room_type_id,
  room_id,
  status,
  start,
  end,
  page,
  limit
) {
  return request({
    url: "/cashier/report/goods-order",
    method: "get",
    params: {
      store_id,
      room_type_id,
      room_id,
      status,
      start,
      end,
      page,
      limit,
    },
  });
}
// 商品销售表
export function outboundgoods(
params
) {
  return request({
    url: "/cashier/report/sale-goods",
    method: "get",
    params: {
      ...params
    },
  });
}

// 房台数据下拉
export function cashierroomselect(store_id) {
  return request({
    url: "/cashier/room/select",
    method: "get",
    params: { store_id },
  });
}
// 报表流水导出
// 房费导出
export function cashierreportpartyorderexport(
  store_id,
  room_type_id,
  room_id,
  status,
  start,
  end,
  limit
) {
  return request({
    url: "/cashier/report/party-order/export",
    method: "get",
    params: { store_id, room_type_id, room_id, status, start, end, limit },
  });
}
// 商品导出
export function cashierreportgoodsorderexport(
  store_id,
  room_type_id,
  room_id,
  status,
  start,
  end,
  limit
) {
  return request({
    url: "/cashier/report/goods-order/export",
    method: "get",
    params: { store_id, room_type_id, room_id, status, start, end, limit },
  });
}
// 商品销售导出
export function salegoodsexport(
  store_id,
  room_type_id,
  room_id,
  status,
  start,
  end,
  limit
) {
  return request({
    url: "/cashier/report/sale-goods/export",
    method: "get",
    params: { store_id, room_type_id, room_id, status, start, end, limit },
  });
}


// 收银日报
export function cashierreportdaily(
  store_id,
  room_type_id,
  room_id,
  start,
  end,
  page,
  limit
) {
  return request({
    url: "/cashier/report/daily",
    method: "get",
    params: { store_id, room_type_id, room_id, start, end, page, limit },
  });
}
// 收银日报导出
export function cashierreportdailyexport(
  store_id,
  room_type_id,
  room_id,
  start,
  end,
  limit
) {
  return request({
    url: "/cashier/report/daily/export",
    method: "get",
    params: { store_id, room_type_id, room_id, start, end, limit },
  });
}
// 添加定时消息
export function timingmessage(params) {
  return request({
    url: "/cashier/timing-message/add",
    method: "post",
    params,
  });
}
// 修改定时消息
export function updatetimingmessage(params) {
  return request({
    url: "/cashier/timing-message/update",
    method: "post",
    params,
  });
}
// 定时消息列表
export function gettimingmessage(params) {
  return request({
    url: "/cashier/timing-message/list",
    method: "get",
    params: { ...params },
  });
}
// 定时消息房台列表
export function getroomselect(params) {
  return request({
    url: "/cashier/timing-message/room-select",
    method: "get",
    params: { ...params },
  });
}
// 删除定时消息
export function timingmessagedelete(params) {
  return request({
    url: "/cashier/timing-message/delete",
    method: "post",
    params,
  });
}
// 定时消息上下架
export function timingmessagestatus(params) {
  return request({
    url: "/cashier/timing-message/status",
    method: "post",
    params,
  });
}
//定时消息详情
export function timingmessageinfo(params) {
  return request({
    url: "/cashier/timing-message/info",
    method: "get",
    params: { ...params },
  });
}
//房费订单退款
export function partyrefund(params) {
  return request({
    url: "/cashier/report/party-order/refund",
    method: "post",
    params,
  });
}
//商品订单退款
export function goodsrefund(params) {
  return request({
    url: "/cashier/report/goods-order/refund",
    method: "post",
    params,
  });
}


// 入库列表
export function storagelist(store_id,good_type_id,goods_id,start,end,page,limit) {
  return request({
    url: "/cashier/storage/list",
    method: "get",
    params: {store_id,good_type_id,goods_id,start,end,page,limit}
  });
}
// 提交入库
export function storageadd(params) {
  return request({
    url: "/cashier/storage/add",
    method: "post",
    params
  });
}
// 导出入库
export function storageexport(params) {
  return request({
    url: "/cashier/storage/export",
    method: "post",
    params
  });
}
// 入库未选择
export function storageunselected(store_id,good_ids,good_type_id,good_name) {
  return request({
    url: "/cashier/storage/unselected-goods",
    method: "get",
    params: {store_id,good_ids,good_type_id,good_name}
  });
}


// 员工列表
export function employeelist(store_id) {
  return request({
    url: "/cashier/employee/list",
    method: "get",
    params: {store_id}
  });
}
export function employeesave(params) {
  return request({
    url: "/cashier/employee/save",
    method: "post",
    params
  });
}


// 首页数据
export function reportmaintoday(store_id) {
  return request({
    url: "/cashier/report/main/today",
    method: "get",
    params: {store_id}
  });
}
// 折线
export function reportmaindaily(store_id,start,end) {
  return request({
    url: "/cashier/report/main/daily",
    method: "get",
    params: {store_id,start,end}
  });
}
// 饼图
export function reportmainrepurchase(store_id,start,end) {
  return request({
    url: "/cashier/report/main/repurchase-rate",
    method: "get",
    params: {store_id,start,end}
  });
}
// 开台率
export function reportmainopenrate(store_id,start,end) {
  return request({
    url: "/cashier/report/main/open-rate",
    method: "get",
    params: {store_id,start,end}
  });
}
// 账单明细表
export function reportparty(store_id,room_type_id,room_id,status,start,end,page,limit) {
  return request({
    url: "/cashier/report/party",
    method: "get",
    params: {store_id,room_type_id,room_id,status,start,end,page,limit}
  });
}

export function reportpayorder(store_id,room_type_id,room_id,status,pay_desc,start,end,page,limit) {
  return request({
    url: "/cashier/report/pay-order",
    method: "get",
    params: {store_id,room_type_id,room_id,status,pay_desc,start,end,page,limit}
  });
}
// 退款
export function reportpayorderrefund(store_id,id) {
  return request({
    url: "/cashier/report/pay-order/refund",
    method: "get",
    params: {store_id,id}
  });
}
