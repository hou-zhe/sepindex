<template>
  <div class="billing-package">
    <div class="billing-package-top">
      <div class="billing-package-top-lft">
        <div class="billing-package-top-item">
          <span style="margin-right: 10px">套餐名称</span>
          <el-input
            v-model="search.name"
            style="width: 200px"
            placeholder="请输入节日名称"
            @keyup.enter.native="onSearch"
          ></el-input>
        </div>
        <div class="billing-package-top-item">
          <span style="margin-right: 10px">状态</span>
          <el-select
            v-model="search.status"
            style="width: 130px"
            placeholder="请选择状态"
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
      class="table-fixed"
      :data="list"
      ref="table"
      fit
      border
      highlight-current-row
      @row-dblclick="onEdit"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      v-loading="loading"
    >
      <el-table-column
        align="center"
        prop="date"
        label="套餐编号"
        width="80"
        
      >
        <template slot-scope="{ row }">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="套餐名称"  width="150">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="套餐类型" width="150">
        <template slot-scope="{ row }">
          {{
            row.package_type == 1
              ? "房时套餐"
              : row.package_type == 2
              ? "房时+商品套餐"
              : "包场+商品套餐"
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="房型" width="150">
        <template slot-scope="{ row }">
          {{ row.room_type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="档期" width="150">
        <template slot-scope="{ row }">
          {{ row.schedules }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="场次" width="150">
        <template slot-scope="{ row }">
          {{ row.periods }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="跨场" width="80">
        <template slot-scope="{ row }">
          {{ row.transfield == 1 ? "未开启" : "开启" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时长(小时)" width="100">
        <template slot-scope="{ row }">
          {{ row.duration }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格(元)" width="80">
        <template slot-scope="{ row }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品" width="200">
        <template slot-scope="{ row }">
          <span>{{ row.goods_text }}</span>
          <!-- <span v-for="(item,index) in row.goods" :key="index">{{item.name}}*{{item.num}}<span style="margin: 0 5px;" v-if="row.goods.length - 1 > index">/</span> </span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="{ row }">
          {{ row.status == 1 ? "上架" : "下架" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280" >
        <template slot-scope="{ row }">
          <el-button
            :type="row.package_type == 1 ? 'info' : 'primary'"
            :disabled="row.package_type == 1"
            size="mini"
            @click="onScan(row)"
            style="margin-right: 10px"
            >商品</el-button
          >
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
      width="53%"
    >
      <!-- 步骤条信息 -->
      <el-steps
        :active="activeStep"
        finish-status="process"
        process-status="finish"
        width="50%"
        simple
        style="margin-top: -20px"
      >
        <el-step title="基本信息" icon="el-icon-info"></el-step>
        <el-step
          title="关联商品"
          v-if="temp.type != 1"
          icon="el-icon-s-goods"
        ></el-step>
      </el-steps>
      <div v-if="activeStep == 0" style="margin-top: 20px">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          @keyup.enter.native="
            temp.type == 1 ? (isSave ? '' : onConfirm()) : onStep(1)
          "
        >
          <el-form-item label="套餐名称" prop="name"
            ><el-input
              ref="diainput"
              v-model="temp.name"
              placeholder="请输入名称"
              style="width: 300px"
          /></el-form-item>
          <el-form-item label="套餐类型" prop="type">
            <el-select
              v-model="temp.type"
              placeholder="请选择状态"
              style="width: 300px"
              @change="onpackageType"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房型" prop="room_type">
            <!-- <el-checkbox-group v-model="temp.room_type">
        			<el-checkbox :label="item.id.toString()" v-for="(item,index) in roomList" :key="index">{{item.name}}</el-checkbox>
        		</el-checkbox-group> -->
            <el-radio-group v-model="temp.room_type" @change="onChoseRoom">
              <el-radio
                :label="item.id.toString()"
                v-for="(item, index) in roomList"
                :key="index"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="档期" prop="schedule">
            <el-checkbox-group v-model="temp.schedule">
              <el-checkbox
                :label="item.id"
                v-for="(item, index) in scheList"
                :key="index"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="场次" prop="sessions">
            <el-radio-group v-model="temp.sessions" @change="onChangePer">
              <el-radio
                :label="item.id.toString()"
                v-for="(item, index) in perList"
                :key="index"
                >{{ item.name }} {{ item.start_time }} -
                {{ item.end_time }}</el-radio
              >
            </el-radio-group>

            <!-- <el-checkbox-group v-model="temp.sessions">
        			<el-checkbox :label="item.id" v-for="(item,index) in perList" :key="index">{{item.name}} {{item.start_time}} - {{item.end_time}}</el-checkbox>
        		</el-checkbox-group> -->
          </el-form-item>
          <el-form-item label="时长" prop="time"
            ><el-input
              type="number"
              :disabled="temp.type == 3"
              v-model.trim="temp.time"
              @keyup.native="temp.time = oninputTime(temp.time)"
              placeholder="请输入时长"
              style="width: 300px"
            /><span style="margin-left: 5px">小时</span></el-form-item
          >
          <el-form-item label="价格" prop="price">
            <!-- <el-input  type="number"  v-model.trim="temp.price" placeholder="请输入价格,2位小数" style="width:300px;"/> -->
            <el-input
              type="number"
              v-model.trim="temp.price"
              @keyup.native="temp.price = oninputPrice(temp.price)"
              placeholder="请输入价格,2位小数"
              style="width: 300px"
            />
            <span style="margin-left: 5px">元</span>
          </el-form-item>
          <el-form-item label="是否跨场" prop="iskua">
            <el-switch
              :disabled="!temp.iskua && temp.type == 3"
              v-model="temp.iskua"
              active-color="#13ce66"
            ></el-switch>
            <div style="color: #f56c6c; font-size: 14px; line-height: 24px">
              注：跨场，套餐结束时间超过场次结束时间，末场不可跨越。包场套餐不可跨场
            </div>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="temp.status"
              placeholder="请选择状态"
              style="width: 300px"
            >
              <el-option
                v-for="(item, index) in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 20px" v-if="activeStep == 1">
        <div
          style="
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin: 10px 0 20px;
          "
          v-if="!isScan"
        >
          <el-button
            :type="temp.type == 1 || !temp.type ? 'info' : 'primary'"
            size="mini"
            @click="onChoseGoods"
            >选择商品</el-button
          >
          <el-button
            :type="temp.type == 1 || !temp.type ? 'info' : 'danger'"
            size="mini"
            @click="onChoseDelAll(0)"
            >全部删除</el-button
          >
        </div>
        <el-table
          :data="goodsList"
          fit
          border
          highlight-current-row
          @row-dblclick="onEditGoods"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          row-key="id"
          height="400"
        >
          <el-table-column align="center" prop="date" label="物品名称">
            <template slot-scope="{ row }">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="计量单位">
            <template slot-scope="{ row }">
              {{ row.unit }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量">
            <template slot-scope="{ row, $index }">
              <el-input
                :disabled="isScan"
                type="number"
                v-model="row.num"
                oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                @keyup.enter.native="isSave ? '' : onConfirm()"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="价格">
            <template slot-scope="{ row }">
              {{ row.price }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="{ row }">
              <el-button
                :type="isScan ? 'info' : 'danger'"
                size="mini"
                @click="isScan ? '' : onChoseDel(row, 0)"
                >移除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div
          style="color: #f56c6c; font-size: 14px; margin-top: 20px"
          v-if="!isScan"
        >
          注：这里不能选择物品套餐。仅选择单个物品。
        </div>
      </div>

      <div slot="footer" class="dialog-footer" v-if="!isScan">
        <el-button v-if="activeStep == 0" @click="dialogVal = false"
          >取消<span style="font-size: 12px">(Esc)</span></el-button
        >
        <el-button type="primary" @click="onStep(0)" v-if="activeStep == 1"
          >上一步</el-button
        >
        <el-button
          type="primary"
          @click="onStep(1)"
          v-if="activeStep == 0 && temp.type != 1"
          >下一步<span style="font-size: 12px">(Enter)</span></el-button
        >
        <el-button
          type="success"
          v-if="activeStep == 1 || temp.type == 1"
          @click="isSave ? '' : onConfirm()"
          v-no-more-click
          >保存<span style="font-size: 12px" v-if="temp.type == 1"
            >(Enter)</span
          ></el-button
        >
      </div>
    </el-dialog>
    <!-- 选择商品弹窗 -->
    <el-dialog
      title="选择商品"
      :visible.sync="dialogGoods"
      :close-on-click-modal="false"
      width="55%"
    >
      <div style="display: flex; margin: -20px 0 30px">
        <el-input
          v-model="goods.name"
          placeholder="搜索物品名称"
          style="width: 30%; margin-right: 20px"
          @keyup.enter.native="onSearchGoods"
        ></el-input>
        <el-select
          v-model="goods.type"
          placeholder="请选择物品种类"
          style="width: 30%"
          @change="onSearchGoods"
        >
          <el-option
            v-for="(item, index) in goodsTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div style="display: flex; justify-content: space-between">
        <fieldset
          style="
            width: 45%;
            border-radius: 10px;
            padding: 20px 10px 10px 10px;
            position: relative;
            border: 1px solid #dcdfe6;
          "
        >
          <legend>未选择</legend>
          <el-button
            size="mini"
            plain
            type="success"
            style="margin-bottom: 20px"
            @click="onChoseNotAll"
            >全选</el-button
          >
          <el-table
            :data="notChoseGoodsList"
            stripe
            border
            fit
            highlight-current-row
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            row-key="id"
            height="400"
          >
            <el-table-column align="center" label="物品名称">
              <template slot-scope="{ row }">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="计量单位">
              <template slot-scope="{ row }">
                {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="价格">
              <template slot-scope="{ row }">
                {{ row.price }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <el-button type="primary" size="mini" @click="onChoseNot(row)"
                  >选择</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
        <fieldset
          style="
            width: 45%;
            position: relative;
            border-radius: 10px;
            padding: 20px 10px 10px 10px;
            border: 1px solid #dcdfe6;
          "
        >
          <legend>已选择</legend>
          <el-button
            size="mini"
            plain
            type="danger"
            style="margin-bottom: 20px"
            @click="onChoseDelAll(1)"
            >全部删除</el-button
          >
          <el-table
            :data="ChoseGoodsList"
            stripe
            border
            fit
            highlight-current-row
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            row-key="id"
            height="400"
          >
            <el-table-column align="center" label="物品名称">
              <template slot-scope="{ row }">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="计量单位">
              <template slot-scope="{ row }">
                {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="价格">
              <template slot-scope="{ row }">
                {{ row.price }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <el-button type="danger" size="mini" @click="onChoseDel(row, 1)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </div>

      <span slot="footer" sstyle="margin: 0 auto;">
        <el-button @click="dialogGoods = false">取消</el-button>
        <el-button type="primary" @click="onGoodsConfirm">完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "../../utils/auth.js";
import {
  packagelist,
  packageadd,
  packageinfo,
  packageupdate,
  packagedelete,
  packagestatus,
  packageunselectedgoods,
  periodselect,
  scheduleselect,
  roomtypeselect,
  goodscategoryselect,
} from "../../api/api.js";
export default {
  name:'BillingPackage',
  data() {
    var checkNum = (rule, value, callback) => {
      if (value <= 0) {
        return callback(new Error("必须大于0"));
      } else {
        callback();
      }
    };
    return {
      id: 0,
      loading: false,
      choseId: 0,

      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        type: [
          { required: true, message: "套餐类型不能为空", trigger: "change" },
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],
        room_type: [
          { required: true, message: "请至少选择一个房型", trigger: "change" },
        ],
        sessions: [
          { required: true, message: "请至少选择一个场次", trigger: "change" },
        ],
        schedule: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个档期",
            trigger: "change",
          },
        ],
        time: [{ required: true, message: "时长不能为空", trigger: "blur" }],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" },
          { validator: checkNum, trigger: "blur" },
        ],
        iskua: [{ required: true }],
      },
      pages: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100],
        total: 400,
      },
      search: {
        name: "",
        status: "",
      },
      temp: {
        name: "",
        type: "",
        price: "",
        time: "",
        status: 1,
        room_type: [],
        schedule: [],
        sessions: [],
        iskua: true,
      },

      statusList1: [
        { id: 0, name: "全部" },
        { id: 1, name: "上架" },
        { id: 2, name: "下架" },
      ],
      statusList: [
        { id: 1, name: "上架" },
        { id: 2, name: "下架" },
      ],

      dialogVal: false,
      dialogText: "新增计费套餐",
      typeList: [
        { name: "房时套餐", id: 1 },
        { name: "房时+商品套餐", id: 2 },
        { name: "包场+商品套餐", id: 3 },
      ],

      list: [],

      // 选择商品弹窗
      dialogGoods: false,
      goods: {
        name: "",
        type: "",
      },
      goodsTypeList: [],
      goodsList: [],
      notChoseGoodsList: [],
      ChoseGoodsList: [],

      perList: [], //场次数据
      scheList: [], //档期数据
      roomList: [], //房型数据

      isSave: false,

      activeStep: 0,
      isScan: false,
    };
  },
  watch: {
    dialogVal(newVal) {
      if (!newVal) {
        this.isScan = false;
      }
    },
    list() {
      this.doLayout();
    },
  },
  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.getInit();
    this.init();
  },
  methods: {
    oninputTime(num) {
      let str = num
      str= str.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
      str =str.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
      str =str.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
      str =str.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3');//只能输入两个小数  
      return str

     },
    getInit() {
      periodselect(this.id).then((res) => {
        this.perList = res.result;
      });
      scheduleselect(this.id).then((res) => {
        this.scheList = res.result;
      });
      roomtypeselect(this.id).then((res) => {
        this.roomList = res.result;
      });
    },
    init() {
      this.loading = true;
      packagelist(
        this.id,
        this.search.name,
        this.search.status,
        this.pages.page,
        this.pages.pageSize
      ).then((res) => {
        this.pages.total = res.result.total;
        this.list = res.result.data;
        this.loading = false;
      });
    },
    doLayout(e) {
      let that = this;
      this.$nextTick(() => {
        that.$refs.table.doLayout();
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
      this.search.status = "";
      this.init();
    },
    onChangePer() {
      if (this.temp.type == 3) {
        this.perList.forEach((item) => {
          if (this.temp.sessions == item.id) {
            let time = this.getHour(
              item.start_time + ":00",
              item.end_time + ":00"
            );
            this.temp.time = time;
          }
        });
      }
    },
    getHour(s1, s2) {
      let year = "2018-1-1";
      let year1 = "2018-1-1";

      if (Number(s2.split(":")[0]) <= Number(s1.split(":")[0])) {
        year1 = "2018-1-2";
      }
      var reDate = /\d{4}-\d{1,2}-\d{1,2} /;

      s1 = new Date(
        (reDate.test(s1) ? year + " " + s1 : year + " " + s1).replace(/-/g, "/")
      );
      s2 = new Date(
        (reDate.test(s2) ? year1 + " " + s2 : year1 + " " + s2).replace(
          /-/g,
          "/"
        )
      );
      var ms = s2.getTime() - s1.getTime();
      console.log(s1);
      if (ms < 0) return 0;
      return Math.floor(ms / 1000 / 60 / 60);
    },
    onChoseRoom() {
      console.log(this.temp.room_type);
    },
    onAdd() {
      this.activeStep = 0;
      Object.keys(this.temp).forEach((key) => {
        this.temp[key] = "";
      });
      this.temp.room_type = [];
      this.temp.sessions = [];
      this.temp.schedule = [];
      this.temp.status = 1;
      this.goodsList = [];
      this.ChoseGoodsList = [];
      this.temp.iskua = true;
      this.choseId = 0;
      this.dialogText = "新增计费套餐";
      this.dialogVal = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.diainput.focus();
      });
    },
    onEdit(obj) {
      if (!this.isScan) {
        this.activeStep = 0;
      }

      this.choseId = obj.id;
      packageinfo(obj.id).then((res) => {
        let reda = res.result.data;
        this.temp.name = reda.name;
        this.temp.type = reda.package_type;
        this.$nextTick(() => {
          let roomlist = [];
          this.roomList.forEach((item) => {
            roomlist.push(item.id);
          });
          if (roomlist.indexOf(Number(reda.room_type_ids)) > -1) {
            this.temp.room_type = reda.room_type_ids.toString();
          } else {
            this.temp.room_type = "";
          }
          let schelist = [];
          this.scheList.forEach((item1) => {
            schelist.push(item1.id);
          });
          let tempsche = [];
          tempsche = schelist.filter((v) => {
            return reda.schedule_ids.indexOf(v) > -1;
          });
          this.temp.schedule = tempsche;

          let perlist = [];
          this.perList.forEach((item) => {
            perlist.push(item.id);
          });
          if (perlist.indexOf(Number(reda.period_ids)) > -1) {
            this.temp.sessions = reda.period_ids.toString();
          } else {
            this.temp.sessions = "";
          }
        });
        this.temp.time = reda.duration;
        this.temp.price = reda.price;
        reda.transfield == 1
          ? (this.temp.iskua = false)
          : (this.temp.iskua = true);
        this.temp.status = reda.status;
        reda.goods.forEach((item) => {
          item.id = item.good_id;
        });
        this.goodsList = JSON.parse(JSON.stringify(reda.goods));
        this.ChoseGoodsList = JSON.parse(JSON.stringify(reda.goods));
        this.$forceUpdate();
        this.dialogText = "编辑计费套餐";
        this.dialogVal = true;

        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
          this.$refs.diainput.focus();
        });
      });
    },
    onStep(e) {
      if (e == 1) {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            this.activeStep = e;
          }
        });
      } else {
        this.activeStep = e;
      }
    },
    onConfirm() {
      if (this.temp.type == 1) {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            this.onConfirmSub();
          }
        });
      } else {
        this.onConfirmSub();
      }
    },
    onConfirmSub() {
      this.isSave = true;
      let goods = [];
      this.goodsList.forEach((item) => {
        goods.push({ good_id: item.id, num: Number(item.num) });
      });
      if (this.temp.type == 2 || this.temp.type == 3) {
        if (goods.length == 0) {
          this.isSave = false;
          this.$message.warning("选择至少一件物品");
          return false;
        }
      }
      if (this.choseId == 0) {
        packageadd({
          store_id: this.id,
          name: this.temp.name,
          package_type: this.temp.type,
          room_type_ids: [this.temp.room_type],
          schedule_ids: this.temp.schedule,
          period_ids: [this.temp.sessions],
          duration: this.temp.time,
          price: this.temp.price,
          transfield: this.temp.iskua ? "2" : "1",
          status: this.temp.status,
          goods: goods,
        })
          .then((res) => {
            this.$message.success("新增套餐成功");
            this.dialogVal = false;
            this.choseId = 0;
            this.activeStep = 0;
            this.init();
            Object.keys(this.temp).forEach((key) => {
              this.temp[key] = "";
            });
            this.isSave = false;
          })
          .catch((err) => {
            this.isSave = false;
          });
      } else {
        packageupdate({
          id: this.choseId,
          name: this.temp.name,
          package_type: this.temp.type,
          room_type_ids: [this.temp.room_type],
          schedule_ids: this.temp.schedule,
          period_ids: [this.temp.sessions],
          duration: this.temp.time,
          price: this.temp.price,
          transfield: this.temp.iskua ? "2" : "1",
          status: this.temp.status,
          goods: goods,
        })
          .then((res) => {
            this.$message.success("修改套餐成功");
            this.dialogVal = false;
            this.choseId = 0;
            this.activeStep = 0;
            this.init();
            Object.keys(this.temp).forEach((key) => {
              this.temp[key] = "";
            });

            this.isSave = false;
          })
          .catch((err) => {
            this.isSave = false;
          });
      }
    },
    onpackageType() {
      if (this.temp.type == 1) {
        this.goodsList = [];
        this.ChoseGoodsList = [];
      }
      if (this.temp.type == 3) {
        this.temp.iskua = false;
      }
      this.onChangePer();
    },
    // 弹窗商品
    onEditGoods() {},
    async onChoseGoods() {
      if (!this.temp.type) {
        this.$message.warning("请先选择套餐类型");
        return false;
      }
      if (this.temp.type == 1) {
        this.$message.warning("房时套餐不能添加商品");
        return false;
      }
      this.goods.type = "";
      this.goods.name = "";
      let newList = [];
      await goodscategoryselect(this.id).then((res) => {
        this.goodsTypeList = res.result;
      });
      await packageunselectedgoods(
        this.id,
        [],
        this.goods.type,
        this.goods.name
      ).then((res) => {
        newList = res.result.data;
      });
      // newlist - choselist = notchoselist
      if (this.ChoseGoodsList.length > 0) {
        this.notChoseGoodsList = newList.filter((v) => {
          return this.ChoseGoodsList.every((e) => e.id != v.id);
        });
      } else {
        this.notChoseGoodsList = newList;
      }
      this.dialogGoods = true;
    },
    async onSearchGoods() {
      let newList = [];
      await packageunselectedgoods(
        this.id,
        [],
        this.goods.type,
        this.goods.name
      ).then((res) => {
        newList = res.result.data;
      });
      if (this.ChoseGoodsList.length > 0) {
        this.notChoseGoodsList = newList.filter((v) => {
          return this.ChoseGoodsList.every((e) => e.id != v.id);
        });
      } else {
        this.notChoseGoodsList = newList;
      }
    },
    onChoseNot(row) {
      let index = this.notChoseGoodsList.indexOf(row);
      this.notChoseGoodsList.splice(index, 1);
      this.ChoseGoodsList.push(row);
    },
    onChoseDel(row, e) {
      if (e == 0) {
        this.ChoseGoodsList = this.ChoseGoodsList.filter((item) => {
          return item.id != row.id;
        });
        this.goodsList = this.goodsList.filter((item) => {
          return item.id != row.id;
        });
      } else {
        // 第二个弹窗的删除商品
        this.ChoseGoodsList = this.ChoseGoodsList.filter((item) => {
          return item.id != row.id;
        });

        this.notChoseGoodsList.push(row);
      }
    },
    onChoseNotAll() {
      this.notChoseGoodsList.forEach((item) => {
        this.ChoseGoodsList.push(item);
      });
      this.notChoseGoodsList = [];
    },
    onChoseDelAll(e) {
      if (e == 0) {
        this.goodsList = [];
        this.ChoseGoodsList = [];
      } else {
        this.ChoseGoodsList.forEach((item) => {
          this.notChoseGoodsList.push(item);
        });
        this.ChoseGoodsList = [];
      }
    },

    onGoodsConfirm() {
      // console.log(this.goodsList,'goodlist')
      this.goodsList = JSON.parse(JSON.stringify(this.ChoseGoodsList));
      // console.log(this.goodsList,'----------')
      this.goodsList.forEach((item) => {
        // console.log(item.num,'num')
        if (!item.num) {
          // console.log(item.num,'---------')
          this.$set(item, "num", 1);
        } else {
          console.log(item.num, "+++++++");
        }
      });
      this.dialogGoods = false;
    },

    onStatus(obj) {
      let status = 0;
      if (obj.status == 1) {
        status = 2;
      } else {
        status = 1;
      }
      packagestatus({
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
    onScan(obj) {
      this.dialogVal = true;
      this.activeStep = 1;
      this.isScan = true;
      this.onEdit(obj);
    },
    onDel(id) {
      this.$confirm("是否确认删除此套餐？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        packagedelete({ id }).then((res) => {
          if (res.code == 0) {
            this.$message.success("删除成功");
            this.init();
          }
        });
      });
    },

    oninputPrice(num) {
      let str = num;
      // let len1 = str.substr(0, 1)
      // let len2 = str.substr(1, 1)
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      // if (str.length > 1 && len1 == 0 && len2 != ".") {
      //     str = str.substr(1, 1)
      // }
      // //第一位不能是.
      // if (len1 == ".") {
      //     str = ""
      // }
      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        let str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/\.\d\d\d$/, ".00"); // 小数点后只能输两位
      return str;
    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.init();
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.billing-package {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  ::v-deep {
    table {
      width: 100% !important;
    }
  }
  .table-fixed {
    ::v-deep .el-table__fixed-right {
      height: 100% !important;
    }
    ::v-deep .el-table__fixed {
      height: 100% !important;
    }
  }
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  ::v-deep input[type="number"] {
    line-height: 1;
    -moz-appearance: textfield !important;
  }

  .fieldset-style {
    border-radius: 10px;
    border: 1px solid #dcdfe6;
    width: 90%;
  }
  .table-style {
    max-height: 280px;
    overflow-y: scroll;
  }
  .table-style::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .billing-package-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    .billing-package-top-lft {
      display: flex;
      align-items: center;
      .billing-package-top-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        span {
          flex-shrink: 0;
          font-size: 14px;
          margin-right: 10px;
        }
      }
      .billing-package-top-item:not(:first-child) {
        width: 200px;
      }
    }
  }
  .session-hour-min {
    font-size: 14px;
    margin: 0 15px 0 5px;
  }
}
</style>
