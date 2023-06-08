<template>
  <div class="commoduty-manage">
    <div class="commoduty-manage-top">
      <div class="commoduty-manage-top-lft">
        <div class="commoduty-manage-top-item">
          <span style="margin-right: 10px">物品名称</span>
          <el-input
            v-model.trim="search.name"
            placeholder="请输入物品名称"
            style="width: 200px"
            @keyup.enter.native="onSearch"
          ></el-input>
        </div>
        <div class="commoduty-manage-top-item">
          <span style="margin-right: 10px">物品种类</span>
          <el-select
            v-model="search.type"
            placeholder="请选择种类"
            style="width: 130px"
            @change="onSearch"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="commoduty-manage-top-item">
          <span style="margin-right: 10px">状态</span>
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
      <el-button type="primary" @click="onAdd" icon="el-icon-plus"
        >新增</el-button
      >
    </div>
    <el-table
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      @row-dblclick="onEdit"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
    >
      <el-table-column align="center" label="物品代码" width="80" >
        <template slot-scope="{ row }">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物品种类" width="150" >
        <template slot-scope="{ row }">
          {{ row.goods_type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物品条码" width="150">
        <template slot-scope="{ row }">
          {{ row.barcodes }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物品名称">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="计量单位" width="80">
        <template slot-scope="{ row }">
          {{ row.unit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="150">
        <template slot-scope="{ row }">
          <el-popover placement="top-start" width="200px" trigger="hover">
            <el-image
              :src="
                row.picture_url
                  ? row.picture_url
                  : 'https://html-res-sstar.oss-cn-beijing.aliyuncs.com/shouyin/%E9%BB%98%E8%AE%A4%E4%BA%A7%E5%93%81%E5%9B%BE%402x.png'
              "
              fit="cover"
              style="width: 150px; height: 150px"
            ></el-image>
            <el-image
              :src="
                row.picture_url
                  ? row.picture_url
                  : 'https://html-res-sstar.oss-cn-beijing.aliyuncs.com/shouyin/%E9%BB%98%E8%AE%A4%E4%BA%A7%E5%93%81%E5%9B%BE%402x.png'
              "
              fit="cover"
              style="width: 50px; height: 50px"
              slot="reference"
            >
            </el-image>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格" width="80">
        <template slot-scope="{ row }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="展示位置" width="100">
        <template slot-scope="{ row }">
          {{ row.show_case_text }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出品" width="80">
        <template slot-scope="{ row }">
          <template v-if="row.property_arr">
            {{ row.property_arr.indexOf(1)>= 0?'是':'否' }}
          </template>
          
        </template>
      </el-table-column>
      <el-table-column align="center" label="出库" width="80">
        <template slot-scope="{ row }">
          <template v-if="row.property_arr">
            {{ row.property_arr.indexOf(2)>= 0?'是':'否' }}
          </template>
          
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="{ row }">
          {{ row.status == 1 ? "上架" : "下架" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  width="240">
        <template slot-scope="{ row }">
          <el-popconfirm
            :confirm-button-text="row.status == 1 ? '下架' : '上架'"
            cancel-button-text="取消"
            icon="el-icon-info"
            :icon-color="row.status == 1 ? 'red' : 'green'"
            :title="
              row.status == 1
                ? '下架此物品会影响物品套餐、计费套餐关联数据'
                : '确定上架吗'
            "
            @onConfirm="onStatus(row)"
          >
            <el-button
              slot="reference"
              :type="row.status == 1 ? 'info' : 'success'"
              size="mini"
              >{{ row.status == 1 ? "下架" : "上架" }}</el-button
            >
          </el-popconfirm>
          <!-- <el-button :type="row.status==1?'info':'success'" size="mini" @click="onStatus(row)">{{row.status==1?'下架':'上架'}}</el-button> -->
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

    <el-dialog
      :title="dialogText"
      :visible.sync="dialogVal"
      :close-on-click-modal="false"
      width="750px"
      class="commoduty-manage-dialog"
    >
      <el-form
        ref="dataForm"
        :inline="true"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        class="commoduty-manage-dialog-form"
        @keyup.enter.native="isSave ? '' : onConfirm()"
      >
        <fieldset style="border-radius: 10px; padding: 10px">
          <legend>必填信息</legend>
          <div class="commoduty-manage-item">
            <el-form-item label="物品代码" prop="code"
              ><el-input
                ref="diainput"
                maxlength="6"
                oninput="if(value.length > 6) value=value.slice(0, 6)"
                type="number"
                v-model.trim="temp.code"
            /></el-form-item>
            <el-form-item label="物品名称" prop="name"
              ><el-input
                style="margin-right: 15px; width: 100%"
                v-model.trim="temp.name"
            /></el-form-item>
          </div>
          <div class="commoduty-manage-item">
            <el-form-item label="物品价格" prop="money"
              ><el-input v-model.trim="temp.money" type="number"
            /></el-form-item>
            <el-form-item label="物品类型" prop="stdmode">
              <el-select
                v-model="temp.stdmode"
                placeholder="请选择类型"
                style="width: 100%"
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
          <div class="commoduty-manage-item">
            <div style="display: flex">
              <el-form-item label="计量单位" prop="unitVal">
                <el-select
                  v-model="temp.unitVal"
                  placeholder="请选择单位"
                  style="width: 93%"
                >
                  <el-option
                    v-for="(item, index) in unitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div style="display: inline" class="commoduty-manage-pop">
                <el-popover placement="right" trigger="click" @show="onPopover">
                  <el-button
                    type="primary"
                    size="mini"
                    style="margin-bottom: 10px"
                    @click="onAddUnit"
                    >新增</el-button
                  >
                  <el-table border :data="unitList" max-height="400">
                    <el-table-column width="150" label="计量单位">
                      <template slot-scope="{ row }">
                        {{ row.name }}
                      </template>
                    </el-table-column>
                    <el-table-column width="100" label="操作">
                      <template slot-scope="{ row }">
                        <el-button
                          type="danger"
                          size="mini"
                          @click="onDelUnit(row.id)"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="commoduty-manage-table-add" v-if="isAddUnit">
                    <el-input
                      v-model.trim="unitNew"
                      placeholder="请输入计量单位,回车键完成"
                      @keyup.enter.native="isEnter ? '' : addUnitConfirm()"
                      style="margin-bottom: 5px"
                    ></el-input>
                    <span style="color: #f56c6c; font-size: 14px"
                      >注：回车键完成</span
                    >
                  </div>
                  <el-button
                    style="
                      display: inline;
                      margin: 5px 0 0 -20px;
                      padding: 0 10px;
                      height: 30px;
                    "
                    size="mini"
                    slot="reference"
                    ><i class="el-icon-more"></i
                  ></el-button>
                </el-popover>
              </div>
            </div>

            <el-form-item label="状态" prop="status">
              <el-select v-model="temp.status" placeholder="请选择状态">
                <el-option
                  v-for="(item, index) in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </fieldset>

        <fieldset
          style="
            border: 1px solid #dcdfe6;
            margin-top: 20px;
            border-radius: 10px;
          "
        >
          <legend>非必填信息</legend>
          <div style="display: flex">
            <el-form-item label="物品条码"
              ><el-input type="number" v-model.trim="barcode"
            /></el-form-item>

            <div style="display: flex; margin-top: 5px">
              <el-button
                style="display: inline; padding: 0 10px; height: 30px"
                size="mini"
                @click="onAddBar"
                >添加</el-button
              >
              <div
                style="
                  display: inline-block;
                  margin-top: 3px;
                  color: #fff;
                  padding-left: 3px;
                "
              >
                <span
                  class="barcode-item"
                  v-for="(item, index) in barcodeList"
                  :key="index"
                >
                  {{ item }}
                  <i class="el-icon-close" @click="onDelBar(index)"></i>
                </span>
              </div>
            </div>
          </div>
          <div style="display: flex">
            <div class="commoduty-manage-item-lft">
              <el-form-item label="拼音码" style="width: 100%"
                ><el-input v-model.trim="temp.pym"
              /></el-form-item>
              <el-form-item label="展示位置" style="width: 100%">
                <el-checkbox
                  v-model="temp.pos"
                  label="小程序"
                  @change="onCheckout(0)"
                ></el-checkbox>
                <el-checkbox
                  v-model="temp.pos1"
                  label="咨客"
                  @change="onCheckout(1)"
                ></el-checkbox>
                <el-checkbox
                  v-model="temp.pos2"
                  label="VOD"
                  @change="onCheckout(2)"
                ></el-checkbox>
              </el-form-item>

              <!-- 出品出库 -->
              <el-form-item label="属性" style="width: 100%">
                <el-checkbox
                  v-model="temp.property1"
                  label="出品"
                  @change="onCheckoutProper(0)"
                ></el-checkbox>
                <el-checkbox
                  v-model="temp.property2"
                  label="出库"
                  @change="onCheckoutProper(1)"
                ></el-checkbox>
              </el-form-item>

              <el-form-item label="标签">
                <el-checkbox
                  v-model="temp.tag"
                  :disabled="temp.tag1"
                  checked
                  label="允许定义成套餐"
                ></el-checkbox>
                <el-checkbox
                  v-model="temp.tag1"
                  @change="onCheckTao"
                  checked
                  label="同步下架套餐"
                ></el-checkbox>
              </el-form-item>
            </div>
            <div>
              <div class="input-wrapper">
                <i v-if="!temp.pic" class="el-icon-plus"></i>
                <span
                  v-if="temp.pic"
                  class="el-icon-close img-close"
                  @click="onCloseImg"
                ></span>
                <input
                  type="file"
                  id="file0"
                  name="file"
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                  style="font-size: 0; cursor: pointer"
                  @change="onImgUpload(0)"
                />
                <img v-if="temp.pic" :src="temp.pic" alt="" class="input-img" />
              </div>
              <div
                style="
                  display: flex;
                  justify-content: space-around;
                  width: 130px;
                  margin-top: 10px;
                  position: relative;
                "
              >
                <el-button type="primary" size="mini" style="cursor: pointer"
                  >上传</el-button
                >
                <input
                  type="file"
                  id="file1"
                  name="file"
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                  @change="onImgUpload(1)"
                  class="commodity-upload-input"
                />
                <el-button type="primary" size="mini" @click="onSystem()"
                  >系统图</el-button
                >
              </div>
            </div>
          </div>
        </fieldset>
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
    <el-dialog
      title="系统图"
      :visible.sync="systemDialog"
      :close-on-click-modal="false"
      width="45%"
    >
      <div class="system-dialog">
        <div class="system-lft">
          <div class="system-lft-title">图片类型</div>
          <div
            class="system-lft-item"
            v-for="(item, index) in systemList"
            :key="index"
            :class="isSystem == index ? 'system-lft-item-active' : ''"
            @click="onChoseSysLft(index)"
          >
            {{ item.type_name }}
            <i class="el-icon-arrow-right" style="margin-left: 10px"></i>
          </div>
        </div>
        <div class="system-rgt">
          <div
            class="system-rgt-item"
            v-for="(item, index) in systemListRgt"
            :key="index"
          >
            <!-- <el-radio v-model="item.checkout" class="system-checkout">备选项</el-radio> -->
            <el-checkbox
              v-model="item.checkout"
              class="system-checkout"
              @change="onSystemCheckout(item)"
            ></el-checkbox>
            <el-image
              class="system-rgt-item-img"
              :src="item.picture_url"
            ></el-image>
            <span class="system-rgt-item-text">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="systemDialog = false">取消</el-button>
        <el-button type="primary" @click="onSystemConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from "jquery";
import store from "@/store";
import Sortable from "sortablejs";
import { getToken } from "../../utils/auth.js";
import { addAll } from "../../utils/index.js";
import {
  goodsunitlist,
  goodsunitadd,
  goodsunitdelete,
  goodslist1,
  goodsadd1,
  goodsinfo1,
  goodsupdate1,
  goodsdelete1,
  goodsstatus1,
  goodscategoryselect,
  ossgetpolicytoken,
  goodspicturelist,
  goodspicturetypes,
} from "../../api/api.js";
export default {
  name:'CommodityManage',
  data() {
    var checkNum = (rule, value, callback) => {
      if (value <= 0) {
        return callback(new Error("必须大于0"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      id: 0,

      headers: {
        type: 13,
      },
      search: {
        name: "",
        type: "",
        status: "",
      },
      typeList: [],
      statusList1: [
        { id: 0, name: "全部" },
        { id: 1, name: "上架" },
        { id: 2, name: "下架" },
      ],
      statusList: [
        { id: 1, name: "上架" },
        { id: 2, name: "下架" },
      ],

      pages: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100],
        total: 400,
      },
      dialogText: "新增",
      dialogVal: false,

      list: [],

      rules: {
        name: [
          { required: true, message: "物品名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "物品代码不能为空", trigger: "blur" },
        ],
        money: [
          { required: true, message: "物品价格不能为空", trigger: "blur" },
          { validator: checkNum, trigger: "blur" },
        ],
        stdmode: [
          { required: true, message: "物品类型不能为空", trigger: "change" },
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],
        unitVal: [
          { required: true, message: "单位不能为空", trigger: "change" },
        ],
      },
      temp: {
        name: "",
        code: "",
        money: "",
        stdmode: "",
        unitVal: "",
        status: 1,
        pos: true,
        pos1: true,
        pos2: true,
        tag: true,
        tag1: true,
        pic: "",

        property1: true,
        property2: true
      },
      barcode: "",
      barcodeList: [],

      unitList: [],

      isAddUnit: false,
      unitNew: "", //新增单位名称
      choseId: 0,

      aliyunOssToken: {},

      systemDialog: false,
      systemList: [],
      systemListRgt: [],
      isSystem: 0,

      isSave: false,
      isEnter: false,
    };
  },

  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.init();
    this.getCategory();
  },
  mounted() {
    this.getOssToken();
  },
  methods: {
    init() {
      this.loading = true;
      goodslist1(
        this.id,
        this.search.name,
        this.search.type,
        this.search.status,
        this.pages.page,
        this.pages.pageSize
      ).then((res) => {
        this.pages.total = res.result.total;
        this.list = res.result.data;
        this.loading = false;
      });
    },
    getCategory() {
      goodscategoryselect(this.id).then((res) => {
        this.typeList = addAll(res.result);
      });
    },
    onSearch() {
      this.pages.page = 1;
      this.init();
    },
    onSearchZero() {
      this.pages.page = 1;
      this.pages.pageSize = 10;
      this.search.name = "";
      this.search.type = "";
      this.search.status = "";
      this.init();
    },
    onAdd() {
      Object.keys(this.temp).forEach((key) => {
        this.temp[key] = "";
      });
      this.temp.pos = true;
      this.temp.pos1 = true;
      this.temp.pos2 = true;
      this.temp.tag = true;
      this.temp.tag1 = true;

      this.temp.status = 1;
      this.barcodeList = [];
      // 新加出品出库
      this.temp.property1 = true;
      this.temp.property2 = true;
      this.getUnit();
      this.choseId = 0;
      this.dialogText = "新增物品";
      this.dialogVal = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.diainput.focus();
      });
    },

    async onEdit(obj) {
      this.choseId = obj.id;
      await this.getUnit();
      goodsinfo1(obj.id).then((res) => {
        let reda = res.result.data;
        this.temp.code = reda.code;
        this.temp.name = reda.name;
        this.temp.money = reda.price;
        this.temp.stdmode = reda.good_type_id;
        this.temp.unitVal = reda.unit;
        this.temp.status = reda.status;
        if (reda.barcodes.length > 0) {
          this.barcodeList = reda.barcodes.split(",");
        }
        this.temp.pym = reda.jianpin;
        this.temp.pic = reda.picture_url;
        this.$nextTick(() => {
          reda.show_case_arr.indexOf(1) >= 0
            ? (this.temp.pos1 = true)
            : (this.temp.pos1 = false);
          reda.show_case_arr.indexOf(2) >= 0
            ? (this.temp.pos2 = true)
            : (this.temp.pos2 = false);
          reda.show_case_arr.indexOf(4) >= 0
            ? (this.temp.pos = true)
            : (this.temp.pos = false);
          reda.tag_arr.indexOf(1) >= 0
            ? (this.temp.tag = true)
            : (this.temp.tag = false);
          reda.tag_arr.indexOf(2) >= 0
            ? (this.temp.tag1 = true)
            : (this.temp.tag1 = false);
            reda.property_arr.indexOf(1) >= 0 ? this.temp.property1 = true : this.temp.property1 = false
            reda.property_arr.indexOf(2) >= 0 ? this.temp.property2 = true : this.temp.property2 = false
        });


        this.$forceUpdate();
        this.dialogText = "修改物品";
        this.dialogVal = true;

        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
          this.$refs.diainput.focus();
        });
      });
    },

    onStatus(obj) {
      let status = 0;
      if (obj.status == 1) {
        status = 2;
      } else {
        status = 1;
      }
      goodsstatus1({
        id: obj.id,
        status: status,
      }).then((res) => {
        if (obj.status == 1) {
          this.$message.success("下架成功");
          this.init();
        } else {
          this.$message.success("上架成功");
          this.init();
        }
      });
    },
    onDel(id) {
      this.$confirm("删除此物品会影响物品套餐、计费套餐关联数据！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        goodsdelete1({ id }).then((res) => {
          if (res.code == 0) {
            this.$message.success("删除成功");
            this.init();
          }
        });
      });
    },
    onCheckout(e) {
      console.log(this.temp.pos);
      console.log(this.temp.pos1);
      console.log(this.temp.pos2);
    },
    onCheckoutProper(e){
      console.log(this.temp.property1,'11')
      console.log(this.temp.property2,'222')
    },
    onCheckTao() {
      if (this.temp.tag1) {
        this.temp.tag = true;
      }
    },
    getOssToken() {
      ossgetpolicytoken(13).then((res) => {
        if (res.code == 0) {
          this.aliyunOssToken = res.result;
        }
      });
    },
    onImgUpload(e) {
      let filed = $("#file" + e).val();

      if (filed.length > 0) {
        let size = $("#file" + e)[0].files[0].size;

        let sizeM = (size / (1024 * 1024)).toFixed(2);
        console.log(sizeM, "size");
        if (sizeM <= 2) {
          this.imgUpload(e);
        } else {
          this.$message.warning("图片大小不能超过2M");
        }
      }
    },
    imgUpload(e) {
      var getSuffix = function (fileName) {
        var pos = fileName.lastIndexOf(".");
        var suffix = "";
        if (pos != -1) {
          suffix = fileName.substring(pos);
        }
        return suffix;
      };
      var file = $("#file" + e).val();
      if (file.length == 0) {
        alert("请选择文件");
      }
      var filename = new Date().getTime() + getSuffix(file);
      var formData = new FormData();
      //注意formData里append添加的键的大小写
      formData.append("key", this.aliyunOssToken.dir + filename); //存储在oss的文件路径
      formData.append("OSSAccessKeyId", this.aliyunOssToken.accessid); //accessKeyId
      formData.append("policy", this.aliyunOssToken.policy); //policy
      formData.append("Signature", this.aliyunOssToken.signature); //签名
      //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了

      formData.append("file", $("#file" + e)[0].files[0]);
      formData.append("success_action_status", 200); //成功后返回的操作码

      var url = this.aliyunOssToken.host;
      var fileUrl =
        this.aliyunOssToken.host + "/" + this.aliyunOssToken.dir + filename;
      var that = this;
      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
          console.log(fileUrl, "++++++++++++++");
          that.$nextTick(() => {
            that.temp.pic = fileUrl;
          });
          that.$forceUpdate();
        },
        error: function (data) {
          console.log(data);
        },
      });
    },
    onCloseImg() {
      this.temp.pic = "";
    },

    // 单位
    getUnit() {
      goodsunitlist(this.id).then((res) => {
        this.unitList = res.result.data;
      });
    },
    onAddUnit() {
      this.isAddUnit = true;
      this.unitNew = "";
    },
    addUnitConfirm() {
      if (this.unitNew.length > 0) {
        this.isEnter = true;
        goodsunitadd({
          store_id: this.id,
          name: this.unitNew,
        }).then((res) => {
          this.isAddUnit = false;
          this.unitNew = "";
          this.$message.success("新增成功");
          this.getUnit();
          this.isEnter = false;
        });
      } else {
        this.$message.warning("输入内容不能为空");
      }
    },
    onDelUnit(id) {
      this.$confirm("是否确认删除此单位？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        goodsunitdelete({ id }).then((res) => {
          if (res.code == 0) {
            this.$message.success("删除成功");
            this.getUnit();
          }
        });
      });
    },
    onAddBar() {
      if (this.barcode.length > 0) {
        let index = this.barcodeList.indexOf(this.barcode);
        if (index < 0) {
          this.barcodeList.push(this.barcode);
          this.barcode = "";
        }
      }
    },
    onDelBar(e) {
      this.barcodeList.splice(e, 1);
    },

    onConfirm() {
      this.$refs["dataForm"].validate((valid) => {
        let barcodes = this.barcodeList.toString();
        let show_case = [];
        let tag = [];
        let property_arr = []

        if (this.temp.pos) {
          show_case.push(4);
        }
        if (this.temp.pos1) {
          show_case.push(1);
        }
        if (this.temp.pos2) {
          show_case.push(2);
        }
        if (this.temp.tag) {
          tag.push(1);
        }
        if (this.temp.tag1) {
          tag.push(2);
        }
        if(this.temp.property1) {
          property_arr.push(1)
        }
        if(this.temp.property2) {
          property_arr.push(2)
        }
        console.log(property_arr)
        if (valid) {
          this.isSave = true;
          if (this.choseId > 0) {
            goodsupdate1({
              id: this.choseId,
              code: this.temp.code,
              name: this.temp.name,
              status: this.temp.status,
              price: this.temp.money,
              good_type_id: this.temp.stdmode,
              unit: this.temp.unitVal,
              barcodes: barcodes,
              jianpin: this.temp.pym,
              show_case_arr: show_case,
              tag_arr: tag,
              picture_url: this.temp.pic,
              // 新加出品出库
              property_arr
            })
              .then((res) => {
                this.$message.success("编辑物品种类成功");
                this.dialogVal = false;
                for (let i in this.temp) {
                  this.temp[i] = "";
                }
                this.init();
                this.choseId = 0;
                this.$nextTick(() => {
                  this.$refs["dataForm"].clearValidate();
                });
                this.isSave = false;
              })
              .catch((err) => {
                this.isSave = false;
              });
          } else {
            goodsadd1({
              store_id: this.id,
              code: this.temp.code,
              name: this.temp.name,
              status: this.temp.status,
              price: this.temp.money,
              good_type_id: this.temp.stdmode,
              unit: this.temp.unitVal,
              barcodes: barcodes,
              jianpin: this.temp.pym,
              show_case_arr: show_case,
              tag_arr: tag,
              picture_url: this.temp.pic,
              // 新加出品出库
              property_arr
            })
              .then((res) => {
                this.$message.success("新增物品成功");
                this.dialogVal = false;
                for (let i in this.temp) {
                  this.temp[i] = "";
                }
                this.init();
                this.$nextTick(() => {
                  this.$refs["dataForm"].clearValidate();
                });
                this.isSave = false;
              })
              .catch((err) => {
                this.isSave = false;
              });
          }
        }
      });
    },
    onChoseSysLft(e) {
      this.isSystem = e;
      goodspicturelist(this.systemList[e].type_id).then((res) => {
        res.result.data.forEach((item) => {
          item.checkout = false;
        });
        this.systemListRgt = res.result.data;
      });
    },
    onSystemCheckout(obj) {
      this.systemListRgt.forEach((item) => {
        item.checkout = false;
      });
      obj.checkout = true;
    },
    onSystemConfirm() {
      let pic = "";
      this.systemListRgt.forEach((item) => {
        if (item.checkout) {
          pic = item.picture_url;
        }
      });
      console.log(pic, "pic");
      this.$nextTick(() => {
        this.temp.pic = pic;
      });
      this.$forceUpdate();
      this.systemDialog = false;
    },
    async onSystem() {
      await goodspicturelist(0).then((res) => {
        res.result.data.forEach((item) => {
          item.checkout = false;
        });
        this.systemListRgt = res.result.data;
      });
      goodspicturetypes(0).then((res) => {
        this.systemDialog = true;
        this.systemList = [{ type_id: 0, type_name: "全部" }, ...res.result];
      });
    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.init();
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.init();
    },
    onPopover() {
      this.unitNew = "";
      this.isAddUnit = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.commoduty-manage {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  ::v-deep input[type="number"] {
    line-height: 1;
    -moz-appearance: textfield !important;
  }
  ::v-deep {
    table {
      width: 100% !important;
    }
  }
  .commodity-upload-input {
    position: absolute;
    left: 0;
    top: 3px;
    width: 55px;
    height: 25px;
    opacity: 0;
    font-size: 0;
    cursor: pointer;
  }
  .input-wrapper {
    width: 130px;
    height: 130px;
    border-radius: 10px;
    border: 1px dotted #ccc;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .img-close {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 16px;
      z-index: 10;
    }
    input {
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    i {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 30px;
      text-align: center;
    }
    .input-img {
      width: 130px;
      height: 130px;
      border-radius: 10px;
      object-fit: cover;
      position: absolute;
      left: -1px;
      top: -1px;
      z-index: 1;
    }
  }
  .commoduty-manage-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    .commoduty-manage-top-lft {
      display: flex;
      align-items: center;
      .commoduty-manage-top-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        span {
          flex-shrink: 0;
          font-size: 14px;
          margin-right: 10px;
        }
      }
      .commoduty-manage-top-item:not(:first-child) {
        width: 200px;
      }
    }
  }
  .commoduty-manage-dialog {
    .commoduty-manage-dialog-form {
      max-height: 500px;
      overflow-y: scroll;
    }
    .commoduty-manage-dialog-form::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .commoduty-manage-dialog-form {
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      overflow-x: hidden;
      overflow-y: auto;
    }
    .commoduty-manage-item {
      display: flex;
      justify-content: space-between;
    }
    .commoduty-manage-upload {
      width: 130px;
      height: 130px;
      ::v-deep {
        .el-upload--picture-card {
          width: 130px;
          height: 130px;
        }
      }
    }
    .barcode-item {
      display: inline-block;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      overflow: hidden;
      margin: 0 5px;
      padding: 2px;
      color: #606266;
    }
  }
  .system-dialog {
    display: flex;
    .system-lft {
      width: 80px;
      min-height: 400px;
      margin-right: 40px;
      background-color: #f2f2f2;
      padding: 20px 0px;
      box-sizing: border-box;
      border-radius: 8px;
      .system-lft-title {
        margin-bottom: 50px;
        padding-left: 10px;
        box-sizing: border-box;
      }
      .system-lft-item {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding-left: 10px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .system-lft-item-active {
        color: #409eff;
        background-color: #fff;
      }
    }
    .system-rgt {
      width: calc(100% - 120px);
      display: flex;
      flex-wrap: wrap;
      .system-rgt-item {
        width: 100px;
        // height: 100px;
        display: flex;
        flex-direction: column;
        margin-right: 10px;
        position: relative;
        .system-checkout {
          position: absolute;
          right: 5px;
          top: 5px;
        }
        .system-rgt-item-img {
          width: 100px;
          height: 100px;
          margin-bottom: 10px;
        }
        .system-rgt-item-text {
          text-align: center;
        }
      }
    }
  }
}
.commoduty-manage-table-add {
  width: 100%;
  height: 53px;
  border: 1px solid EBEEF5;
  margin-top: 10px;
  ::v-deep .el-input__inner{
		border: 1px solid #7B7D84;
	}
}
</style>
