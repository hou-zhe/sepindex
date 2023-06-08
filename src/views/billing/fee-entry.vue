<template>
  <div class="fee-entry">
    <el-tabs
      v-model="jishibao"
      @tab-click="handleJishi"
      v-if="
        periodList.length > 1 && roomList.length > 0 && scheduleList.length > 0
      "
    >
      <el-tab-pane
        :label="label.label"
        :name="label.name"
        v-for="(label, ji) in labelList"
        :key="ji"
      >
        <p class="fee-tips">
          {{
            jishibao == "jishi"
              ? "注：此处设置的价格为每场次一小时的价格"
              : "注：此处设置的价格为每场次整个时段总价"
          }}
        </p>
        <div
          class="fee-entry-btn"
          v-if="
            (periodList.length > 1 && roomList.length > 0) ||
            scheduleList.length == 0
          "
        >
          <el-button type="info" v-if="isEdit" @click="onFail">取消</el-button>
          <el-button v-if="isEdit" type="success" @click="onConfirm()"
            >保存</el-button
          >
          <el-button
            v-if="!isEdit"
            type="primary"
            @click="onEdit()"
            :loading="isSave"
            icon="el-icon-edit"
            >修改</el-button
          >
        </div>

        <el-tabs
          type="border-card"
          v-model="activeName"
          @tab-click="handleClick"
          v-if="periodList.length > 1 && roomList.length > 0"
          style="border-radius: 10px"
        >
          <el-tab-pane
            :label="item.name"
            :name="item.id.toString()"
            v-for="(item, index) in scheduleList"
            :key="item.id"
          >
            <table>
              <tr>
                <th v-for="(item, index) in periodList" :key="index">
                  {{ item.name }}
                  <div v-if="index > 0">
                    {{ item.start_time }} - {{ item.end_time }}
                  </div>
                </th>
              </tr>
              <tr
                v-for="(item, index) in roomList"
                :key="index"
                @dblclick="onEdit()"
              >
                <td>{{ item.name }}</td>
                <td v-for="(temp, idx) in templist[index]" :key="idx">
                  <el-input
                    type="number"
                    :disabled="!isEdit"
                    v-model.trim="temp.price"
                    @change="onBlurMount(idx, index)"
                  ></el-input>
                </td>
              </tr>
            </table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <!-- <el-tab-pane label="包场" name="baochang"  v-if="periodList.length > 1 && roomList.length > 0 && scheduleList.length > 0">
        <div class="fee-entry-btn" v-if="periodList.length > 1 && roomList.length > 0 || scheduleList.length == 0">
          <el-button type="info" v-if="isEdit" @click="onFail">取消</el-button>
          <el-button v-if="isEdit" type="success" @click="onConfirm()" >保存</el-button>
          <el-button v-if="!isEdit" type="primary" @click="onEdit()" :loading="isSave" icon="el-icon-edit">修改</el-button>
        </div>
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" v-if="periodList.length > 1 && roomList.length > 0" style="border-radius: 10px;">
          <el-tab-pane :label="item.name" :name="item.id.toString()" v-for="(item,index) in scheduleList" :key="item.id">
            <table >
              <tr>
                <th v-for="(item,index) in periodList" :key="index">
                  {{item.name}}
                  <div v-if="index > 0">{{item.start_time}} - {{item.end_time}}</div>
                </th>
              </tr>
              <tr v-for="(item,index) in roomList" :key="index" @dblclick="onEdit()">
                <td>{{item.name}}</td>
                <td v-for="(temp,idx) in templist[index]" :key="idx">
                  <el-input type="number" :disabled="!isEdit" v-model.trim="temp.price"></el-input>
                </td>
              </tr>
            </table>
          </el-tab-pane>

        </el-tabs>
      </el-tab-pane> -->
    </el-tabs>

    <!-- <el-button  style="margin-right: 20px;" @click="onTab(1)">计时</el-button>
      <el-button :type="tabVal == 2?'primary':'info'" @click="onTab(2)">包场</el-button> -->
    <!-- <div class="fee-entry-btn" :class="tabVal == 1?'':'fee-entry-btn-active'" style="margin-right: 20px;" @click="onTab(1)">计时</div>
      <div class="fee-entry-btn" :class="tabVal == 2?'':'fee-entry-btn-active'" @click="onTab(2)">包场</div>
      <div class="fee-entry-arrow" :style="tabVal == 2?'left: 145px':''"><i class="el-icon-bottom"></i></div> -->

    <!-- <div class="fee-enter-ctr">
      <span v-if="periodList.length == 1">钟费录入至少上架一个场次</span>
      <span v-if="roomList.length == 0">钟费录入至少上架一个房型</span>
      <span v-if="scheduleList.length == 0">钟费录入至少上架一个档期</span>
    </div> -->
  </div>
</template>

<script>
import { getToken } from "../../utils/auth.js";
import {
  scheduleselect,
  periodselect,
  roomtypeselect,
  timelist,
  timeadd,
} from "../../api/api.js";
import { set } from "nprogress";
export default {
  name:'FeeEntry',
  data() {
   
    return {
      id: 0,
      loading: false,

      tabVal: 1,
      activeName: "",
      chosePrice: [],

      list: [],
      scheduleList: [], //档期列表
      periodList: [], //场次列表
      roomList: [], //房型列表

      templist: [],

      isEdit: false,
      isSave: false,

      jishibao: "jishi",

      labelList: [
        { label: "计时", name: "jishi" },
        { label: "包场", name: "baochang" },
      ],
    };
  },
  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.initSchedule();
  },
  methods: {
    onBlurMount(idx, index) {
      console.log("idx,index", idx, index);
      console.log(
        " this.templist[index][idx]",
        this.templist[index][idx].price
      );
      if (Number(this.templist[index][idx].price) <= 0) {
        this.$message.warning("价格必须大于0");
        this.templist[index][idx].price = 1;
      }
    },
    handleJishi() {
      if (this.jishibao == "jishi") {
        this.isEdit = false;
        this.tabVal = 1;
        this.activeName = this.scheduleList[0].id.toString();
        this.getList();
      } else {
        this.isEdit = false;
        this.tabVal = 2;
        this.activeName = this.scheduleList[0].id.toString();
        this.getList();
      }

      // this.jishibao =
    },
    onTab(e) {
      this.isEdit = false;
      this.tabVal = e;
      this.activeName = this.scheduleList[0].id.toString();
      this.getList();
    },
    handleClick() {
      this.isEdit = false;
      this.getList();
    },

    async initSchedule() {
      // 获取档期
      await scheduleselect(this.id).then((res) => {
        this.scheduleList = res.result;

        if (res.result.length > 0) {
          this.activeName = this.scheduleList[0].id.toString();
        } else {
          this.activeName = "";
        }
        console.log(this.activeName);
        if (this.scheduleList.length == 0) {
          this.$message({
            showClose: true,
            message: "钟费录入至少上架一个档期",
            type: "error",
          });
        }
      });
      // 获取场次
      await periodselect(this.id).then((res) => {
        this.periodList = [{ id: -1, name: "房型/场次" }, ...res.result];
        if (this.periodList.length == 1) {
          setTimeout(() => {
            this.$message({
              showClose: true,
              message: "钟费录入至少上架一个场次",
              type: "error",
            });
          }, 500);
        }
      });
      // 获取房型
      roomtypeselect(this.id).then((res) => {
        this.roomList = res.result;
        if (this.roomList.length == 0) {
          setTimeout(() => {
            this.$message({
              showClose: true,
              message: "钟费录入至少上架一个房型",
              type: "error",
            });
          }, 1000);
        }
        this.getList();
      });
    },
    getList() {
      // 获取价格
      this.templist = [];
      this.loading = true;
      timelist(this.id, this.tabVal, this.activeName).then((res) => {
        //res.result.data是返回的有价格的数据
        let perlist = this.periodList.slice(1); //场次替换，我在上面给场次追加了一个id
        for (let j = 0; j < this.roomList.length; j++) {
          //先循环房型，在临时数组中追加2个大类数组
          this.templist.push([]); // 追加成了 templist= [[],[]]
          for (let i = 0; i < perlist.length; i++) {
            // 再循环场次
            this.templist[j].push({
              room_type_id: this.roomList[j].id,
              period_id: perlist[i].id,
              price: "0.00",
            }); //追加对象，成了templist=[[{},{},{}],[{},{},{}]]
            for (let k = 0; k < res.result.data.length; k++) {
              //循环返回的有数据的，替换templist中有数值的价格
              if (
                this.roomList[j].id == res.result.data[k].room_type_id &&
                perlist[i].id == res.result.data[k].period_id
              ) {
                //判断条件
                this.templist[j][i].price = res.result.data[k].price.toFixed(2); //替换价格
              }
            }
          }
        }
        // console.log(this.templist,'templist')
        this.list = res.result.data;
      });
    },
    onEdit() {
      this.isEdit = true;
    },

    onConfirm() {
      let arr = [];
      for (let j = 0; j < this.roomList.length; j++) {
        for (let i = 0; i < this.templist[j].length; i++) {
          arr.push(this.templist[j][i]);
        }
      }
      this.isSave = true;
      timeadd({
        store_id: this.id,
        type: this.tabVal,
        schedule_id: this.activeName,
        charge_price: arr,
      })
        .then((res) => {
          this.$message.success("修改成功");
          // this.chosePrice = []
          this.list = [];
          this.isEdit = false;
          this.$forceUpdate();
          this.getList();
          this.isSave = false;
          // this.onFail()
        })
        .catch((err) => {
          this.isSave = false;
        });
    },
    onFail() {
      this.isEdit = false;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.fee-tips {
  position: absolute;
  top: 15px;
  left: 12px;
  color: rgb(245, 108, 108);
  font-size: 14px;
}
.fee-entry {
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
  .fee-entry-btn {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
  .fee-entry-top {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    position: relative;
    // .fee-entry-btn {
    //   background-color: #ddd;
    //   width: 90px;
    //   height: 50px;
    //   font-size: 16px;
    //   line-height: 50px;
    //   text-align: center;
    //   color: #303133;
    //   cursor: pointer;
    //   border-radius: 5px;
    // }
    // .fee-entry-btn-active {
    //   background-color: #409eff;
    //   color: #fff;
    // }
    .fee-entry-arrow {
      position: absolute;
      left: 35px;
      bottom: -30px;
      font-size: 20px;
      color: #aaa;
    }
  }

  .fee-entry-btm {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    tr {
      width: 100%;
    }

    tr:first-child {
    }

    tr th {
      border: 1px solid #ebeef5;
      background-color: #f5f7fa;
      color: #606266;
      width: 150px;
      height: 40px;
      text-align: center;
      font-size: 14px;
    }

    tr th:first-child {
      width: 100px;
      text-align: left;
      padding-left: 10px;
      box-sizing: border-box;
    }

    tr td {
      border: 1px solid #ebeef5;
      height: 40px;
      text-align: center;
    }

    tr td:first-child {
      width: 100px;
      text-align: left;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
