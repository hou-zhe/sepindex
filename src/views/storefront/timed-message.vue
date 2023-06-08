<template>
  <div class="timed-message">
    <div class="timed-message-top">
      <div></div>
      <el-button type="primary" @click="onAdd" icon="el-icon-plus"
        >新增</el-button
      >
    </div>
    <div
      style="
        position: absolute;
        top: 26px;
        color: #f56c6c;
        font-size: 14px;
        line-height: 24px;
      "
    >
      注：门店最多添加10条定时消息
    </div>
    <el-table
      :data="list"
      fit
      border
      highlight-current-row
      @row-dblclick="onEdit"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      row-key="id"
      v-loading="loading"
    >
      <el-table-column align="center" prop="date" label="消息名称" width="240">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="消息类型">
        <template slot-scope="{ row }">
          {{ row.datatype == 1 ? "文字" : row.datatype == 2 ? "图片" : "视频" }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="消息内容" width="240">
        <template slot-scope="{ row }">
          {{ row.data }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="开始时间" width="180">
        <template slot-scope="{ row }">
          {{ row.start }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="结束时间" width="180">
        <template slot-scope="{ row }">
          {{ row.end }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="轮询间隔(分)"
        width="150"
      >
        <template slot-scope="{ row }">
          {{ row.circulation }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="发送次数(次)"
        width="150"
      >
        <template slot-scope="{ row }">
          {{ row.count }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="状态" width="150">
        <template slot-scope="{ row }">
          {{ row.status == 1 ? "上架" : "下架" }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="操作"
        fixed="right"
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
            style="margin-left: 10px"
            type="primary"
            size="mini"
            @click="onEdit(row)"
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
      @close="dialogclose"
      width="600px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        @keyup.enter.native="isSave ? '' : onConfirm()"
      >
        <el-form-item label="消息名称" prop="name"
          ><el-input
            ref="diainput"
            v-model="temp.name"
            placeholder="请输入消息名称"
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item label="消息类型" prop="datatype">
          <el-select
            v-model="temp.datatype"
            placeholder="请选择消息类型"
            style="width: 400px"
            @change="onChangeType"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="文字颜色"
          prop="fontcolor"
          v-if="temp.datatype == 1"
        >
          <el-radio-group
            v-model="temp.fontcolor"
            :disabled="temp.datatype != 1"
          >
            <el-radio label="2">黄色</el-radio>
            <el-radio label="6">白色</el-radio>
            <el-radio label="1">红色</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="起止时间" prop="time">
          <el-date-picker
            v-model="temp.time"
            type="datetimerange"
            style="width: 400px"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="选择开始时间"
            end-placeholder="选择截止时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="轮询间隔(分)" prop="circulation">
          <el-input
            @input="temp.circulation = temp.circulation.replace(/[^0-9]/g, '')"
            v-model.trim="temp.circulation"
            type="number"
            placeholder="请输入轮询间隔"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="发送次数" prop="count">
          <el-input
            @input="temp.count = temp.count.replace(/[^0-9]/g, '')"
            v-model.trim="temp.count"
            type="number"
            placeholder="请发送次数"
            style="width: 400px"
          />
          <div style="color: #f56c6c; font-size: 14px; line-height: 24px">
            注：轮询一次，发送的消息次数
          </div>
        </el-form-item>
        <el-form-item label="消息内容" prop="data">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            maxlength="99"
            :placeholder="
              temp.datatype == 2
                ? '请输入：图片名称+后缀，例：xxx1.jpg'
                : temp.datatype == 4
                ? '请输入：视频名称+后缀，例：xxx1.mpg'
                : '请输入内容'
            "
            v-model="temp.data"
            style="width: 400px"
          ></el-input>
          <div style="color: #f56c6c; font-size: 14px; line-height: 24px">
            注：{{
              temp.datatype == 2
                ? "*输入：图片名称+后缀，例：xxx1.jpg"
                : temp.datatype == 4
                ? "*输入：视频名称+后缀，例：xxx1.mpg"
                : "*最多输入99个字符"
            }}
          </div>
        </el-form-item>
        <!-- prop="room" -->
        <el-form-item
          label="选择房台"
          prop="room"
          :class="{ 'is-required': true }"
        >
          <div class="timed-room">
            <el-checkbox v-model="choseAll" @change="onRoomAll"
              >全选</el-checkbox
            >
            <div
              class="timed-room-item"
              v-for="(item, index) in roomList"
              :key="index"
            >
              <div class="timed-top">
                <el-checkbox
                  v-model="item.checkedAll"
                  :label="item.rooms"
                  @change="onChangeRoomAll(index)"
                  >{{ item.name }}</el-checkbox
                >
              </div>
              <div class="time-content">
                <!-- <div class="time-content-item" > -->
                <el-checkbox-group
                  v-model="checkedlist[index]"
                  @change="onChangeRoom(index)"
                >
                  <el-checkbox
                    v-for="(item1, index1) in item.rooms"
                    :label="item1.ip.toString()"
                    :key="index1"
                    >{{ item1.name }}</el-checkbox
                  >
                </el-checkbox-group>
                <!-- </div> -->
              </div>
              <div class="time-btm"></div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select
            v-model="temp.status"
            placeholder="请选择状态"
            style="width: 400px"
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
import { getToken } from "../../utils/auth.js";
import {
  timingmessage,
  gettimingmessage,
  getroomselect,
  timingmessagedelete,
  timingmessagestatus,
  timingmessageinfo,
  updatetimingmessage,
} from "../../api/api.js";
export default {
  name:'TimeMessage',
  data() {
    var checktree = (rule, value, callback) => {
      let total = 0;

      for (let index = 0; index < this.checkedlist.length; index++) {
        const element = this.checkedlist[index];
        console.log("element", element.length);
        total = total + element.length;
      }
      if (total <= 0) {
        return callback(new Error("请选择发送的房台"));
      } else {
        callback();
      }
    };
    var checkmsg = (rule, value, callback) => {
      if (value.length > 16 && this.temp.datatype == 4) {
        return callback(new Error("视频消息内容长度不能超过16个字节"));
      }
      value = value.replace(/\s+/g, "");
      console.log("ptext", value, /^[A-Za-z0-9.]+$/.test(value));
      if (!/^[A-Za-z0-9.]+$/.test(value) && this.temp.datatype == 2) {
        console.log("返回错误");
        return callback(
          new Error("图片消息内容只能输入数字、字母、空格、小数点")
        );
      }
      if (!/^[A-Za-z0-9.]+$/.test(value) && this.temp.datatype == 4) {
        return callback(
          new Error("视频消息内容只能输入数字、字母、空格、小数点")
        );
      }
      callback();
    };

    return {
      rules: {
        name: [
          { required: true, message: "消息名称不能为空", trigger: "blur" },
        ],

        datatype: [
          { required: true, message: "请选择消息类型", trigger: "change" },
        ],
        fontcolor: [
          { required: true, message: "请选择文字颜色", trigger: "blur" },
        ],
        time: [
          { required: true, message: "请选择起止日期", trigger: "change" },
        ],

        circulation: [
          { required: true, message: "轮询间隔不能为空", trigger: "blur" },
        ],
        count: [
          { required: true, message: "发送次数不能为空", trigger: "blur" },
        ],
        data: [
          { required: true, message: "消息内容不能为空", trigger: "blur" },
          { validator: checkmsg, trigger: "blur" },
        ],
        room: [{ validator: checktree, trigger: "change" }],

        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],
      },
      pages: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100],
        total: 0,
      },
      checkedlist: [],
      temp: {
        name: "",
        datatype: "",
        fontcolor: "",
        time: "",
        circulation: "",
        count: "",
        data: "",
        status: 0,
      },

      statusList: [
        { id: 1, name: "上架" },
        { id: 2, name: "下架" },
      ],
      typeList: [
        { id: 1, name: "文字" },
        { id: 2, name: "图片" },
        { id: 4, name: "视频" },
      ],
      roomList: [],
      dialogVal: false,
      dialogText: "新增定时消息",

      list: [],
      id: 0,
      loading: false,
      choseId: 0,

      isSave: false,
      choseAll: false,
    };
  },
  mounted() {
    this.id = JSON.parse(getToken()).store_id;
    this.getroomlist();
    this.init();
    this.roomList.forEach((item) => {
      item.checkedAll = false;
    });
  },

  methods: {
    dialogclose() {
      console.log("关闭了-----------------");
      this.resetcheck();
    },
    init() {
      this.loading = true;
      let params = {
        store_id: this.id,
        page: this.pages.page,
        limit: this.pages.pageSize,
      };
      gettimingmessage(params).then((res) => {
        this.list = res.result.data;
        this.loading = false;
        this.pages.total = res.result.total;
      });
    },
    getroomlist() {
      getroomselect({ store_id: this.id }).then((res) => {
        res.result.forEach((item) => {
          item.checkedAll = false;
          this.checkedlist.push([]);
        });
        this.roomList = res.result;
        console.log("this.roomList", this.roomList);
        this.resetcheck();
      });
    },

    onAdd() {
      Object.keys(this.temp).forEach((key) => {
        this.temp[key] = "";
      });

      this.temp.status = 1;
      this.choseId = 0;
      this.dialogVal = true;
      this.dialogText = "新增定时消息";

      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.diainput.focus();
      });
    },
    onEdit(obj) {
      console.log("obj", obj);
      this.choseId = obj.id;
      timingmessageinfo({ id: obj.id }).then((res) => {
        console.log("res.result.data", res.result.data);
        // this.temp = { ...res.result.data };
        // 两个对象的字段不完全相同时
        Object.keys(this.temp).forEach((key) => {
          this.temp[key] =
            res.result.data[key] == undefined
              ? this.temp[key]
              : res.result.data[key];
        });
        this.temp.fontcolor = this.temp.fontcolor.toString();
        this.temp.time = [];
        this.temp.time.push(res.result.data.start);
        this.temp.time.push(res.result.data.end);
        if (!res.result.data.room_ips) {
          this.roomList.forEach((item, index) => {
            item.rooms.forEach((item1) => {
              this.checkedlist.forEach((item2, index2) => {
                if (index == index2) {
                  item2.push(item1.ip.toString());
                  item.checkedAll = true;
                }
              });
            });
            console.log("item.rooms", item.rooms.length);
            if (item.rooms.length == 0) {
              console.log("为true");
              item.checkedAll = true;
            }
          });
          for (let k = 0; k < this.checkedlist.length; k++) {
            this.checkedlist[k] = Array.from(new Set(this.checkedlist[k]));
            console.log("array[k]", this.checkedlist[k]);
          }
        } else {
          this.roomList.forEach((item, index) => {
            item.rooms.forEach((item1) => {
              res.result.data.room_ips.split(",").forEach((item2, index2) => {
                if (item1.ip == item2) {
                  this.checkedlist[index].push(item1.ip.toString());
                }
              });
            });
            if (item.rooms.length > 0) {
              this.onChangeRoom(index);
            }
          });
        }
        console.log("this.temp", this.temp);
      });

      this.dialogText = "编辑定时消息";
      this.dialogVal = true;

      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.diainput.focus();
      });
    },
    onConfirm() {
      console.log("this.temp", this.temp);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.isSave = true;
          if (this.choseId > 0) {
            let params = {
              id: this.choseId,
              name: this.temp.name,
              datatype: Number(this.temp.datatype),
              start: this.temp.time[0],
              end: this.temp.time[1],
              circulation: Number(this.temp.circulation),
              count: Number(this.temp.count),
              data: this.temp.data,
              status: Number(this.temp.status),
            };
            if (params.datatype == 1) {
              params.fontcolor = Number(this.temp.fontcolor);
            }
            if (this.choseAll) {
              params.room_ips = "";
            } else {
              let templist = [];
              for (let index = 0; index < this.checkedlist.length; index++) {
                const element = this.checkedlist[index];
                for (let j = 0; j < element.length; j++) {
                  const ele = element[j];
                  templist.push(ele);
                }
              }
              console.log("templist", templist);
              params.room_ips = templist.join(",");
            }
            updatetimingmessage(params)
              .then((res) => {
                this.$message.success("修改定时消息成功");
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
          } else {
            console.log("temp", this.temp);
            let params = {
              store_id: this.id,
              name: this.temp.name,
              datatype: Number(this.temp.datatype),
              count: Number(this.temp.count),
              data: this.temp.data,
              status: Number(this.temp.status),
              start: this.temp.time[0],
              end: this.temp.time[1],
              circulation: Number(this.temp.circulation),
            };
            if (params.datatype == 1) {
              params.fontcolor = Number(this.temp.fontcolor);
            }
            if (this.choseAll) {
              params.room_ips = "";
            } else {
              let templist = [];
              for (let index = 0; index < this.checkedlist.length; index++) {
                const element = this.checkedlist[index];
                for (let j = 0; j < element.length; j++) {
                  const ele = element[j];
                  templist.push(ele);
                }
              }
              console.log("templist", templist);
              params.room_ips = templist.join(",");
            }

            timingmessage(params)
              .then((res) => {
                this.$message.success("新增定时消息成功");
                this.dialogVal = false;
                for (let i in this.temp) {
                  this.temp[i] = "";
                }
                this.init();
                this.resetcheck();
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
    onDel(id) {
      this.$confirm("确定删除此条定时消息吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        timingmessagedelete({ id }).then((res) => {
          if (res.code == 0) {
            this.$message.success("删除成功");
            this.init();
          }
        });
      });
    },
    onStatus(obj) {
      let status = 0;
      obj.status == 1 ? (status = 2) : (status = 1);
      timingmessagestatus({
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
    onChangeType() {
      if (this.temp.datatype != 1) {
        this.temp.fontcolor = "";
      }
    },
    onRoomAll() {
      let temp = this.roomList.map((x) => {
        return x.checkedAll;
      });
      console.log("temp", temp);
      if (temp.indexOf(false) >= 0) {
        this.roomList.forEach((item, index) => {
          item.rooms.forEach((item1) => {
            this.checkedlist.forEach((item2, index2) => {
              if (index == index2) {
                item2.push(item1.ip.toString());
                item.checkedAll = true;
              }
            });
          });
          console.log("item.rooms", item.rooms.length);
          if (item.rooms.length == 0) {
            console.log("为true");
            item.checkedAll = true;
          }
        });
        for (let k = 0; k < this.checkedlist.length; k++) {
          this.checkedlist[k] = Array.from(new Set(this.checkedlist[k]));
          console.log("array[k]", this.checkedlist[k]);
        }
      } else {
        this.resetcheck();
      }
    },
    resetcheck() {
      this.checkedlist = [];
      this.roomList.forEach((item) => {
        item.checkedAll = false;

        this.checkedlist.push([]);
      });
    },
    onChangeRoom(index) {
      let tempLength = this.checkedlist[index].length;
      let roomLength = this.roomList[index].rooms.length;
      if (tempLength == roomLength) {
        this.roomList[index].checkedAll = true;
      } else {
        this.roomList[index].checkedAll = false;
      }
      this.$forceUpdate();
    },
    onChangeRoomAll(index) {
      console.log("this.checkedlist", this.checkedlist);
      let templist = this.roomList[index].rooms.map((item) => {
        return item.ip.toString();
      });
      if (this.checkedlist[index].length < this.roomList[index].rooms.length) {
        this.checkedlist[index] = templist;
      } else {
        this.checkedlist[index] = [];
      }
      this.handlecheck();
      this.$forceUpdate();
    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.init();
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.init();
    },
    handlecheck() {
      console.log("选项变化-----------", this.checkedlist);
      console.log("总数据-----------", this.roomList);
      let total = 0;
      let roomtotal = 0;
      for (let index = 0; index < this.checkedlist.length; index++) {
        const element = this.checkedlist[index];
        console.log("element", element.length);
        total = total + element.length;
      }
      for (let j = 0; j < this.roomList.length; j++) {
        const ele = this.roomList[j];
        roomtotal = roomtotal + ele.rooms.length;
      }
      console.log("total", total);
      console.log("roomtotal", roomtotal);
      if (total == roomtotal && roomtotal != 0) {
        this.choseAll = true;
      } else {
        this.choseAll = false;
      }
    },
  },
  watch: {
    checkedlist(newv) {
      this.handlecheck();
    },
  },
};
</script>

<style lang="scss" scoped>
.timed-message {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  ::v-deep {
    table {
      width: 100% !important;
    }
    .el-form-item__content {
      line-height: 30px;
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
  .timed-message-top {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .timed-room {
    width: 400px;
    min-height: 100px;
    border: 1px solid #dcdfe6;
    padding: 5px 15px;
    box-sizing: border-box;
    border-radius: 4px;
    ::v-deep {
      .el-checkbox__label {
        padding-left: 5px;
      }
    }
    .timed-room-item {
      margin-bottom: 10px;
      margin-left: 15px;
      .time-content {
        display: flex;
        flex-wrap: wrap;
        margin-left: 15px;
        margin-top: -5px;
        .time-content-item {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
