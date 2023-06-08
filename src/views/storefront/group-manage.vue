<template>
  <div class="room-manage">
    <div class="room-manage-top">
      <div class="room-manage-top-lft">
        <div class="room-manage-top-item">
          <span style="flex-shrink: 0; margin-right: 10px">房台名称</span>
          <el-input
            v-model="search.name"
            placeholder="请输入房台名称"
            style="width: 200px"
            @keyup.enter.native="onSearch"
          ></el-input>
        </div>
        <div class="room-manage-top-item">
          <span style="flex-shrink: 0; margin-right: 10px">状态</span>
          <el-select
            v-model="search.status"
            placeholder="请选择状态"
            style="width: 130px"
            @change="onSearch"
          >
            <el-option
              v-for="(item, index) in statusList1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="onSearch" icon="el-icon-search"
          >查询</el-button
        >
        <el-button type="primary" @click="onSearchZero" icon="el-icon-refresh"
          >重置</el-button
        >
      </div>

      <el-button type="primary" icon="el-icon-plus" @click="onAdd"
        >绑定单机</el-button
      >
    </div>
    <div
      style="
        background-color: #fff;
        padding: 20px 10px;
        box-sizing: border-box;
        border-radius: 10px;
      "
    >
      <div class="room-manage-menu">
        <div class="room-manage-menu-item">区域</div>
        <div
          class="room-manage-menu-item"
          :class="isTopActive == -1 ? 'room-manage-menu-item-active' : ''"
          @click="ontoptAc(-1)"
        >
          全部
        </div>
        <div
          class="room-manage-menu-item"
          v-for="(item, index) in regionList"
          :key="index"
          :class="isTopActive == index ? 'room-manage-menu-item-active' : ''"
          @click="ontoptAc(index)"
        >
          <span>{{ item.name }}</span>
        </div>
        <router-link
          to="./region-manage"
          class="room-manage-menu-item"
          style="text-decoration: underline"
        >
          <i class="el-icon-edit-outline"></i>
          编辑
        </router-link>
      </div>
      <div class="room-manage-content" style="display: flex">
        <div class="room-manage-menurgt">
          <div class="room-manage-menurgt-item">房台类型</div>
          <div
            class="room-manage-menurgt-item"
            :class="isLftActive == -1 ? 'room-manage-menurgt-item-active' : ''"
            @click="onlfttAc(-1)"
          >
            全部
          </div>
          <div
            class="room-manage-menurgt-item"
            :title="item.name"
            v-for="(item, idx) in typeList"
            :key="idx"
            :class="isLftActive == idx ? 'room-manage-menurgt-item-active' : ''"
            @click="onlfttAc(idx)"
          >
            <span
              style="
                display: inline-block;
                width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              "
              >{{ item.name }}</span
            >
          </div>
          <router-link
            to="./room-type"
            class="room-manage-menurgt-item"
            style="text-decoration: underline"
          >
            <i class="el-icon-edit-outline"></i>
            编辑
          </router-link>
        </div>
        <div style="width: calc(100% - 120px)">
          <el-table
            class="table-fixed"
            ref="table"
            :data="list"
            fit
            border
            highlight-current-row
            @row-dblclick="onEdit"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            v-loading="loading"
          >
            <el-table-column align="center" label="房台代码" width="150" >
              <template slot-scope="{ row }">
                {{ row.id }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="房型"
              style="min-width: 80px"
            >
              <template slot-scope="{ row }">
                {{ row.room_type }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="房台名称" width="100">
              <template slot-scope="{ row }">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="房间IP" width="150">
              <template slot-scope="{ row }">
                {{ row.ip }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="MAC" width="200">
              <template slot-scope="{ row }">
                {{ row.mac }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="型号" width="300">
              <template slot-scope="{ row }">
                {{ row.product_category }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="软件版本"
              style="min-width: 150px"
            >
              <template slot-scope="{ row }">
                {{ row.app_version }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="{ row }">
                {{ row.status == 1 ? "上架" : "下架" }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="240"
             
            >
              <template slot-scope="{ row }">
                <el-popconfirm
                  :confirm-button-text="row.status == 1 ? '下架' : '上架'"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  :icon-color="row.status == 1 ? 'red' : 'green'"
                  :title="row.status == 1 ? '确定下架吗' : '确定上架吗'"
                  @onConfirm="onStatus(row)"
                >
                  <el-button
                    slot="reference"
                    :type="row.status == 1 ? 'info' : 'success'"
                    size="mini"
                    >{{ row.status == 1 ? "下架" : "上架" }}</el-button
                  >
                </el-popconfirm>
                <el-button
                  type="primary"
                  size="mini"
                  @click="onEdit(row)"
                  style="margin-left: 10px"
                  >修改</el-button
                >
                <el-button type="danger" size="mini" @click="onDel(row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <Costompagination
            :page="pages.page"
            :pageSize="pages.pageSize"
            :pageSizes="pages.pageSizes"
            :total="pages.total"
            @onSizeChange="onSizeChange"
            @onCurrentChange="onCurrentChange"
          ></Costompagination>
          <!-- <div class="room-manage-page">
      			<el-pagination background @size-change="handleSizeChange" :current-page="page" @current-change="handleCurrentChange"
      				:page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total,sizes,prev,pager,next,jumper" :total="400">
      			</el-pagination>
      			<el-button type="primary" size="mini" style="margin-left: 10px;">确定</el-button>
      		</div> -->
        </div>
      </div>
    </div>
    <!--  :title="dialogText" -->
    <el-dialog
      :title="dialogText"
      :visible.sync="dialogVal"
      :close-on-click-modal="false"
      width="700px"
    >
      <el-form
        ref="dataForm"
        :inline="true"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        @keyup.enter.native="isSave ? '' : onConfirm()"
      >
        <div class="room-manage-item">
          <el-form-item label="房台名称" prop="name"
            ><el-input ref="diainput1" v-model="temp.name"
          /></el-form-item>
          <el-form-item label="房型" prop="type">
            <el-select
              v-model="temp.type"
              placeholder="请选择房型"
              style="width: 85%"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="room-manage-item">
          <el-form-item label="MAC" prop="mac"
            ><el-input v-model.trim="temp.mac" :disabled="choseId > 0"
          /></el-form-item>

          <el-form-item label="区域" prop="region">
            <el-select
              v-model="temp.region"
              placeholder="请选择区域"
              style="width: 85%"
            >
              <el-option
                v-for="(item, index) in regionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="room-manage-item">
          <el-form-item label="CPU"
            ><el-input v-model.trim="temp.cpu"
          /></el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="temp.status"
              placeholder="请选择状态"
              style="width: 85%"
            >
              <el-option
                v-for="(item, index) in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="房台IP">
          <el-form-item>
            <el-input
              class="room-manage-ip"
              type="number"
              maxlength="3"
              oninput="value=value.replace(/[^\d.]/g,'')"
              v-model="temp.num1"
              @keyup.native.190="onInput(0)"
            />
            <sub
              style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
              >·</sub
            >
          </el-form-item>
          <el-form-item>
            <el-input
              class="room-manage-ip"
              type="number"
              maxlength="3"
              v-model="temp.num2"
              oninput="value=value.replace(/[^\d.]/g,'')"
              ref="num2"
              @keyup.native.190="onInput(1)"
            />
            <sub
              style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
              >·</sub
            >
          </el-form-item>
          <el-form-item>
            <el-input
              class="room-manage-ip"
              type="number"
              maxlength="3"
              v-model="temp.num3"
              oninput="value=value.replace(/[^\d.]/g,'')"
              ref="num3"
              @keyup.native.190="onInput(2)"
            />
            <sub
              style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
              >·</sub
            >
          </el-form-item>
          <el-form-item>
            <el-input
              class="room-manage-ip"
              type="number"
              maxlength="3"
              v-model="temp.num4"
              ref="num4"
            />
          </el-form-item>
        </el-form-item>
        <p style="color: rgb(245, 108, 108); margin-left: 10px">
          注：绑定后，单机的经营者会更改成“组经营者”
        </p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVal = false"
          >取消<span style="font-size: 12px">(Esc)</span></el-button
        >
        <el-button
          type="success"
          @click="isSave ? '' : onConfirm()"
          v-no-more-click
          >保存<span style="font-size: 12px">(Enter)</span></el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from "../../utils/debounce.js";
import { getToken } from "../../utils/auth.js";
import {
  roomlist,
  roomadd,
  roominfo,
  roomupdate,
  roomdelete,
  roomstatus,
  areaselect,
  roomtypeselect,
  grouproomlist,
  grouproomupdate,
  grouproomadd,
  grouproominfo,
  grouproomdelete
} from "../../api/api.js";
export default {
  name:'GroupManage',
  data() {
    return {
      id: 0,
      loading: false,
      search: { name: "", status: "" },

      rules: {
        name: [
          { required: true, message: "房台名称不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "房型不能为空", trigger: "change" }],
        region: [
          { required: true, message: "区域不能为空", trigger: "change" },
        ],
        mac: [{ required: true, message: "MAC不能为空", trigger: "blur" }],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],

        cpu: [{ required: true, message: "CPU不能为空", trigger: "blur" }],
        num1: [
          { required: true, message: "IP的第一位不能为空", trigger: "blur" },
        ],
        num2: [
          { required: true, message: "IP的第二位不能为空", trigger: "blur" },
        ],
        num3: [
          { required: true, message: "IP的第三位不能为空", trigger: "blur" },
        ],
        num4: [
          { required: true, message: "IP的第四位不能为空", trigger: "blur" },
        ],
      },
      pages: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100],
        total: 0,
      },

      temp: {
        name: "",
        num1: "",
        num2: "",
        num3: "",
        num4: "",
        mac: "",
        cpu: "",
        region: "",
        type: "",
        status: 0,
      },

      isTopActive: -1,
      isLftActive: -1,

      statusList: [
        { id: 1, name: "上架" },
        { id: 2, name: "下架" },
      ],
      statusList1: [
        { id: 0, name: "全部" },
        { id: 1, name: "上架" },
        { id: 2, name: "下架" },
      ],
      dialogVal: false,
      dialogText: "新增房台",
      list: [],

      regionList: [],
      typeList: [],
      choseId: 0,

      isSave: false,
    };
  },
  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.init();
  },
  watch: {
    list(val) {
      this.doLayout();
    },
  },
  methods: {
    doLayout(e) {
      let that = this;
      this.$nextTick(() => {
        that.$refs.table.doLayout();
      });
    },
    getRoom() {
      roomtypeselect(this.id).then((res) => {
        this.typeList = res.result;
      });
    },
    getType() {
      areaselect(this.id).then((res) => {
        this.regionList = res.result;
      });
    },
    async init() {
      await this.getRoom();
      await this.getType();
      this.initList();
    },
    initList() {
      this.loading = true;
      let regionId = 0;
      let roomId = 0;
      if (this.isTopActive >= 0) {
        regionId = this.regionList[this.isTopActive].id;
      }
      if (this.isLftActive >= 0) {
        roomId = this.typeList[this.isLftActive].id;
      }
      let params = {
        store_id:this.id,
        room_area_id:regionId,
        room_type_id:roomId,
        name:this.search.name,
        status:this.search.status,
        page: this.pages.page,
        limit:this.pages.pageSize
      }
      grouproomlist(
        params
      ).then((res) => {
        this.pages.total = res.result.total;
        this.list = res.result.data;
        this.loading = false;
      });
      
    },
    onInput(e) {
      if (e == 0) {
        this.$refs.num2.focus();
      } else if (e == 1) {
        this.$refs.num3.focus();
      } else if (e == 2) {
        this.$refs.num4.focus();
      }
      // window.addEventListener('keydown',e=>{
      //   console.log(e.keyCode,'code')
      //   if(e.keyCode == 190) {
      //     this.$refs.num2.focus()

      //   }
      //   this.temp.num2 = ''
      // })
      // if(ind == 0) {
      //   let index = this.temp.num1.indexOf('.')
      //   console.log(index,'iundex')
      //   if(index >= 0) {
      //     this.temp.num1 = this.temp.num1.replace('.','')
      //     this.$refs.num2.focus()
      //   }
      // }
    },
    ontoptAc(e) {
      this.isTopActive = e;
      this.initList();
    },
    onlfttAc(e) {
      this.isLftActive = e;
      this.initList();
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },

    onSearch() {
      this.pages.page = 1;
      this.initList();
    },
    onSearchZero() {
      this.pages.page = 1;
      this.pages.pageSize = 10;
      this.search.name = "";
      this.search.status = "";
      this.isTopActive = -1;
      this.isLftActive = -1;
      this.initList();
    },
    onAdd() {
      Object.keys(this.temp).forEach((key) => {
        this.temp[key] = "";
      });
      this.choseId = 0;
      this.temp.status = 1;
      this.dialogVal = true;
      this.dialogText = "新增房台";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.diainput1.focus();
      });
    },
    onEdit(obj) {
      this.choseId = obj.id;
      grouproominfo(obj.id).then((res) => {
        let reda = res.result.data;
        this.temp.name = reda.name;
        this.temp.mac = reda.mac;
        this.temp.cpu = reda.cpu;
        if (reda.room_type_id > 0) {
          let isType = this.typeList.some(
            (item) => item.id == reda.room_type_id
          );
          this.temp.type = isType ? reda.room_type_id : "";
        } else {
          this.temp.type = "";
        }
        if (reda.room_area_id > 0) {
          let isRegion = this.regionList.some(
            (item) => item.id == reda.room_area_id
          );
          this.temp.region = isRegion ? reda.room_area_id : "";
        } else {
          this.temp.region = "";
        }

        // this.temp.region = reda.room_area_id
        this.temp.status = reda.status;
        this.temp.num1 = reda.ip.split(".")[0];
        this.temp.num2 = reda.ip.split(".")[1];
        this.temp.num3 = reda.ip.split(".")[2];
        this.temp.num4 = reda.ip.split(".")[3];
        this.dialogText = "修改房台";
        this.dialogVal = true;

        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
          this.$refs.diainput1.focus();
        });
      });
    },
    onDel(id) {
      this.$confirm("是否确认删除此房台吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        grouproomdelete({ id }).then((res) => {
          if (res.code == 0) {
            // this.$message.success("删除成功");
            this.$message({
              showClose: true,
              type: 'success',
          message: '删除成功,请重启机器'
        });
            this.initList();
          }
        });
      });
    },
    onConfirm() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.isSave = true;
          let ip = "";
          if (
            this.temp.num1 &&
            this.temp.num2 &&
            this.temp.num3 &&
            this.temp.num4
          ) {
            ip =
              this.temp.num1 +
              "." +
              this.temp.num2 +
              "." +
              this.temp.num3 +
              "." +
              this.temp.num4;
          }
          if (this.choseId > 0) {
            grouproomupdate({
              id: this.choseId,
              name: this.temp.name,
              room_type_id: this.temp.type,
              ip: ip,
              room_area_id: this.temp.region,
              mac: this.temp.mac,
              cpu: this.temp.cpu,
              status: this.temp.status,
            })
              .then((res) => {
                this.$message.success("编辑成功");
                this.dialogVal = false;

                this.initList();
                this.$nextTick(() => {
                  this.$refs["dataForm"].clearValidate();
                });
                this.isSave = false;
                this.choseId = 0;
              })
              .catch((err) => {
                this.isSave = false;
              });
          } else {
            grouproomadd({
              store_id: this.id,
              name: this.temp.name,
              room_type_id: this.temp.type,
              ip: ip,
              room_area_id: this.temp.region,
              mac: this.temp.mac,
              cpu: this.temp.cpu,
              status: this.temp.status,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("新增成功");
                  this.dialogVal = false;
                  this.initList();
                  this.$nextTick(() => {
                    this.$refs["dataForm"].clearValidate();
                  });
                  this.isSave = false;
                }
              })
              .catch((err) => {
                this.isSave = false;
              });
          }
        }
      });
    },
    onStatus(obj) {
      let status = 0;
      obj.status == 1 ? (status = 2) : (status = 1);
      roomstatus({
        id: obj.id,
        status: status,
      }).then((res) => {
        if (obj.status == 1) {
          this.$message.success("下架成功");
          this.initList();
        } else {
          this.$message.success("上架成功");
          this.initList();
        }
      });
    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.initList();
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.initList();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type="number"] {
  line-height: 1;
  -moz-appearance: textfield !important;
}
::v-deep {
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
}
.room-manage {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .table-fixed {
    ::v-deep .el-table__fixed-right {
      height: 100% !important;
    }
    ::v-deep .el-table__fixed {
      height: 100% !important;
    }
  }
  ::v-deep {
    // table .has-gutter tr th {
    // 	background-color: #ccc !important;
    // }
    table {
      width: 100% !important;
    }
    .el-menu--horizontal {
      border-bottom: none;
      .el-menu-item {
        border: none !important;
      }
      .el-menu-item.is-active {
        border-bottom: none;
      }
    }
    .el-menu-item {
      text-align: center;
    }
    .el-menu-item.is-disabled {
      // opacity: 1;
      // color: #777eb4 !important;
      cursor: default;
      // background-color: #545c64 !important;
    }
  }
  .room-manage-top {
    width: 100%;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .room-manage-top-lft {
      display: flex;
      align-items: center;
      .room-manage-top-item {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-right: 20px;
      }
      .room-manage-top-item:first-child {
        margin-right: 30px;
      }
      .room-manage-top-item:last-child {
        width: 200px;
      }
    }
  }
  .room-manage-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .room-manage-menu {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    .room-manage-menu-item {
      background-color: #ddd;
      // padding: 0 20px;
      width: 90px;
      height: 50px;
      font-size: 16px;
      line-height: 50px;
      text-align: center;
      color: #303133;
      cursor: pointer;
      border-right: 2px solid #fff;
    }
    .room-manage-menu-item-active {
      color: #fff;
      background-color: #409eff;
    }
    .room-manage-menu-item:first-child {
      cursor: default;
    }
  }
  .room-manage-menurgt {
    max-height: calc(100vh - 290px);
    overflow: scroll;
    width: 120px;
    // background-color: #f2f2f2;
    margin-right: 10px;
    .room-manage-menurgt-item {
      display: inline-block;
      // height: 50px;
      width: 100%;
      font-size: 14px;
      color: #303133;
      line-height: 30px;
      padding: 10px;
      box-sizing: border-box;
      cursor: pointer;
      border-bottom: 2px solid #fff;
      background-color: #ddd;
      // border-radius: 5px;
    }
    .room-manage-menurgt-item-active {
      color: #fff;
      background-color: #409eff;
    }
  }
  .room-manage-menurgt .room-manage-menurgt-item:first-child {
    position: sticky;
    top: 0;
    // background-color:rgb(84,92,100) !important;
    z-index: 1000;
    cursor: default;
  }
  .room-manage-menurgt::-webkit-scrollbar {
    height: 0px;
    width: 2px;
    // background: #f2f5fa;
  }
  .room-manage-menurgt::-webkit-scrollbar-thumb {
    // background-color: rgba(0, 0, 0, 0.3);
    background-color: #ccc;
    height: 5px;
    border-radius: 5px;
  }
  .room-manage-ip {
    width: 70px;
    display: inline-block;
    ::v-deep {
      .el-input__inner {
        height: 30px !important;
        line-height: 30px;
        padding: 0 5px;
      }
    }
  }
}
</style>
