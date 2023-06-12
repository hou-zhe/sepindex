<template>
  <div class="set-meat">
    <div class="set-meat-top">
      <div class="set-meat-top-lft">
        <div class="set-meat-top-item">
          <span style="margin-right: 10px">物品名称</span>
          <el-input
            v-model.trim="search.name"
            placeholder="请输入物品名称"
            style="width: 200px"
            @keyup.enter.native="onSearch"
          ></el-input>
        </div>
        <div class="set-meat-top-item">
          <span style="margin-right: 10px">物品种类</span>
          <el-select
            v-model="search.type"
            placeholder="请选择种类"
            style="width: 130px"
            @change="onSearch"
          >
            <el-option
              v-for="(item, index) in typeList1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="set-meat-top-item">
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
      v-loading="loading"
    >
      <el-table-column align="center" label="套餐代码" width="80" >
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
      <el-table-column align="center" label="套餐名称">
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
            ></el-image>
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
      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="{ row }">
          {{ row.status == 1 ? "上架" : "下架" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280" >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
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

    <!-- 步骤条 -->
    <el-dialog
      :title="dialogText"
      :visible.sync="dialogVal"
      :close-on-click-modal="false"
      width="55%"
      class="set-meat-dialog"
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
        <el-step title="关联商品" icon="el-icon-s-goods"></el-step>
      </el-steps>
      <!-- 基本信息 -->
      <div
        style="margin-top: 20px"
        v-if="activeStep == 0"
        class="set-meat-dialog-form"
      >
        <el-form
          ref="dataForm"
          :inline="true"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          @keyup.enter.native="isNextLoading ? '' : onStep(1)"
        >
          <fieldset style="border-radius: 10px; padding: 10px">
            <legend>必填信息</legend>
            <div class="set-meat-item">
              <el-form-item label="物品代码" prop="code"
                ><el-input
                  ref="diainput"
                  type="number"
                  maxlength="6"
                  oninput="if(value.length > 6) value=value.slice(0, 6)"
                  v-model.trim="temp.code"
              /></el-form-item>
              <el-form-item label="物品名称" prop="name"
                ><el-input
                  style="margin-right: 15px; width: 100%"
                  v-model.trim="temp.name"
              /></el-form-item>
            </div>
            <div class="set-meat-item">
              <el-form-item label="物品价格" prop="money"
                ><el-input type="number" v-model.trim="temp.money"
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
            <div class="set-meat-item">
              <div style="display: flex">
                <el-form-item label="计量单位" prop="unit">
                  <el-select
                    v-model="temp.unit"
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
                <div style="display: inline">
                  <el-popover placement="right" trigger="click">
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
                    <div class="set-meat-table-add" v-if="isAddUnit">
                      <el-input
                        v-model.trim="unitNew"
                        placeholder="请输入计量单位,回车键完成"
                        @keyup.enter.native="isEnter ? '' : addUnitConfirm()"
                        style="margin-bottom: 5px"
                      ></el-input>
                      <span style="color: #f56c6c; font-size: 14px"
                        >注：回车键完成</span
                      >
                      <!-- div style="width: 100px;display: inline;">
												<el-button style="display: inline;" type="primary" size="mini">确定</el-button>
											</div> -->
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
                ><el-input v-model.trim="barcode"
              /></el-form-item>

              <div style="display: flex; margin-top: 5px">
                <el-button
                  style="display: inline; padding: 0 10px; height: 30px"
                  size="mini"
                  @click="onAddBar"
                  >添加</el-button
                >
                <div style="display: inline-block; margin-top: 3px">
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
            <div style="display: flex; justify-content: space-between">
              <div class="set-meat-item-lft">
                <el-form-item label="拼音码" style="width: 100%"
                  ><el-input v-model.trim="temp.pym"
                /></el-form-item>
                <el-form-item label="展示位置" style="width: 100%">
                  <el-checkbox v-model="temp.pos" label="小程序"></el-checkbox>
                  <el-checkbox v-model="temp.pos1" label="咨客"></el-checkbox>
                  <el-checkbox v-model="temp.pos2" label="VOD"></el-checkbox>
                </el-form-item>
                <!-- <el-form-item label="标签">
									<el-checkbox v-model="temp.tag1" label="是否下架同步套餐"></el-checkbox>
									<el-checkbox v-model="temp.tag" label="是否定义成套餐"></el-checkbox>
								</el-form-item> -->
              </div>
              <div>
                <!-- <el-upload action="https://jsonplaceholder.typicode.com/posts/" class="set-meat-upload"
									list-type="picture-card" :on-remove="onImgRemove" :on-success="onImgSuccess">
									<i class="el-icon-plus"></i>
								</el-upload> -->
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
                    @change="onImgUpload(0)"
                    style="cursor: pointer; font-size: 0"
                  />
                  <img
                    v-if="temp.pic"
                    :src="temp.pic"
                    alt=""
                    class="input-img"
                  />
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
                  <input
                    type="file"
                    id="file1"
                    name="file"
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                    @change="onImgUpload(1)"
                    class="set-upload-input"
                  />
                  <el-button type="primary" size="mini" style="cursor: pointer"
                    >上传</el-button
                  >
                  <el-button type="primary" size="mini" @click="onSystem()"
                    >系统图</el-button
                  >
                </div>
              </div>
            </div>
          </fieldset>
        </el-form>
      </div>
      <!-- 关联商品 -->

      <div
        v-if="activeStep == 1"
        style="display: flex; margin-top: 20px; position: relative"
      >
        <!-- 左侧tab -->
        <div class="set-meat-package">
          <!-- 顶部标题和内容 -->
          <div class="set-meat-package-content">
            <div class="set-meat-package-title">套餐分组</div>
            <div>
              <div
                class="set-meat-package-item"
                v-for="(item, idx) in packTab"
                :key="idx"
                @click="onTab(idx)"
              >
                <span
                  :class="isTab == idx ? 'set-meat-package-item-active' : ''"
                  >{{ item.name }}
                  <span v-if="idx == 0">({{ packTabTotal }})</span>
                  <span v-if="idx > 0">({{ item.goods_num }})</span></span
                >
                <span v-if="idx > 0 && !isScan">
                  <span
                    style="text-decoration: underline; cursor: pointer"
                    @click="onGoods(item)"
                    >商品</span
                  >
                  <span
                    style="
                      text-decoration: underline;
                      cursor: pointer;
                      margin-left: 5px;
                    "
                    @click="onEditGroup(item)"
                    >修改</span
                  >
                </span>
              </div>
            </div>
          </div>
          <!-- 添加tab的按钮 -->
          <el-button
            :type="isScan ? 'info' : 'primary'"
            style="justify-self: flex-end"
            @click="isScan ? '' : onAddGroup()"
            >添加分组</el-button
          >
        </div>
        <!-- 关联商品右侧表格 -->

        <el-table
          :data="rgtChoseGoodsList"
          max-height="400"
          class="drop-table"
          stripe
          border
          fit
          highlight-current-row
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          v-loading="goodsLoading"
        >
          <el-table-column align="center" label="排序" width="80">
            <template slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="物品名称">
            <template slot-scope="{ row }">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="'数量\n(可选择数量)'"
            width="120"
          >
            <template slot-scope="{ row }">
              <el-input
                type="number"
                style="width: 60px"
                v-model.trim="row.group_num"
                disabled
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'上限数量'" width="170">
            <template slot-scope="{ row }">
              <el-input
                type="number"
                style="width: 80px"
                :disabled="isScan"
                v-model.trim="row.goods_num"
                @keyup.enter.native="onConfirm()"
                @change="onBlurMount(row)"
              ></el-input>
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
              <el-button
                :type="isScan ? 'info' : 'danger'"
                size="mini"
                @click="isScan ? '' : onChoseRgtDel(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="set-meat-footer" v-if="!isScan">
        <div v-if="activeStep == 1">
          <span style="color: #f56c6c">注：最多可添加5个分组</span>
          <span style="margin-left: 20px; color: #f56c6c"
            >注：拖动上方列表可进行排序</span
          >
        </div>
        <div v-if="activeStep == 0"></div>
        <div style="align-items: flex-end">
          <el-button
            type="info"
            @click="dialogVal = false"
            v-if="activeStep == 0"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="onStep(0)"
            v-if="activeStep == 1 && !isScan"
            >上一步</el-button
          >
          <el-button
            type="primary"
            @click="isNextLoading ? '' : onStep(1)"
            v-no-more-click
            v-if="activeStep == 0"
            >下一步<span style="font-size: 12px">(Enter)</span></el-button
          >
          <el-button
            type="success"
            @click="onConfirm()"
            v-if="activeStep == 1 && !isScan"
            >提交</el-button
          >
        </div>
      </div>
    </el-dialog>
    <!-- 添加分组 -->
    <el-dialog
      :title="dialogGroupText"
      :visible.sync="dialogGroup"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form
        ref="groupForm"
        :inline="true"
        :rules="groupRules"
        :model="groupTemp"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="分组名称" prop="name"
          ><el-input v-model.trim="groupTemp.name" placeholder="请填写分组名称"
        /></el-form-item>
        <el-form-item label="分组类型" prop="type">
          <el-select
            v-model="groupTemp.type"
            placeholder="请选择类型"
            style="width: 93%"
          >
            <el-option
              v-for="(item, index) in groupTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可选择数量" prop="num"
          ><el-input
            type="number"
            :min="1"
            v-model.trim="groupTemp.num"
            placeholder="大于0的数字"
            @keyup.enter.native="isGroupLoading ? '' : onGroupConfirm()"
        /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGroup = false">取消</el-button>
        <el-button
          type="primary"
          @click="isGroupLoading ? '' : onGroupConfirm()"
          v-no-more-click
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!-- 选择商品弹窗 -->
    <el-dialog
      title="选择商品"
      :visible.sync="dialogGoods"
      :close-on-click-modal="false"
      width="55%"
    >
      <div style="display: flex; margin: -20px 0 30px">
        <el-select
          v-model="goods.type"
          placeholder="请选择物品种类"
          style="width: 30%"
          @change="onSearchGoods"
        >
          <el-option
            v-for="(item, index) in typeList1"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          v-model.trim="goods.name"
          placeholder="搜索物品名称"
          style="width: 30%; margin-left: 20px"
          @keyup.enter.native="onSearchGoods"
        ></el-input>
        
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
            class="set-meat-chose-goods"
            size="mini"
            plain
            type="success"
            @click="onChoseGoodsAll"
            >全选</el-button
          >
          <el-table
            :data="notChoseGoodsList"
            stripe
            border
            fit
            highlight-current-row
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
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
                <el-button type="primary" size="mini" @click="onChoseGoods(row)"
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
            class="set-meat-chose-goods"
            size="mini"
            plain
            type="danger"
            @click="onChoseGoodsAllDel"
            >全部删除</el-button
          >
          <el-table
            :data="ChoseGoodsList"
            stripe
            border
            fit
            highlight-current-row
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
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
                <el-button
                  type="danger"
                  size="mini"
                  @click="onChoseGoodsDel(row)"
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
// import plupload from 'plupload'
import { getToken } from "../../utils/auth.js";
import {
  set_upload_param,
  check_object_radio,
  get_uploaded_object_name,
} from "../../utils/upload.js";
import {
  goodslist2,
  goodsadd2,
  goodsinfo2,
  goodsupdate2,
  goodsdelete2,
  goodsstatus2,
  goodscategoryselect,
  goodsunitlist,
  goodsunitadd,
  goodsunitdelete,
  ossgetpolicytoken,
  goodsgrouplist,
  goodsgroupadd,
  goodsgroupinfo,
  goodsgroupupdate,
  goodsgroupselectedgoods,
  goodsgroupunselectedgoods,
  goodsgroupaddgoods,
  goodsgroupdeletegoods,
  goodsgroupupdategoodsnum,
  goodsgroupupdategoodssort,
  goodspicturelist,
  goodspicturetypes,
} from "../../api/api.js";
import Sortable from "sortablejs";
import $ from "jquery";
import { addAll } from "@/utils/index.js";
export default {
  name:'SetMeat',
  data() {
    var checkNum = (rule, value, callback) => {
      if (value <= 0) {
        return callback(new Error("必须大于0"));
      } else {
        callback();
      }
    };
    return {
      search: {
        name: "",
        type: "",
        status: "",
      },
      loading: false,
      id: 0,
      choseId: 0,

      typeList: [],
      typeList1: [],

      statusList: [
        { id: 1, name: "上架" },
        { id: 2, name: "下架" },
      ],
      statusList1: [
        { id: 0, name: "全部" },
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
      activeStep: 0,

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
        unit: [
          { required: true, message: "计量单位不能为空", trigger: "change" },
        ],
      },
      temp: {
        name: "",
        code: "",
        money: "",
        stdmode: "",
        unit: "",
        status: 1,
        pos: true,
        pos1: true,
        pos2: true,
        tag: true,
        tag1: true,
        pic: "",
        pym:''
      },
      barcode: "",
      barcodeList: [],

      unitList: [],

      isAddUnit: false,
      unitNew: "", //新增单位名称

      packagelist: [],
      isTab: 0, //tab的当前项
      packTab: [],

      // 分组管理的弹窗数据
      dialogGroupText: "新增分组",
      dialogGroup: false,
      groupRules: {
        name: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        num: [
          { required: true, message: "请选择数量", trigger: "blur" },
          { validator: checkNum, trigger: "blur" },
        ],
      },
      groupTemp: {
        name: "",
        type: "",
        num: 1,
      },
      groupTypeList: [
        { name: "主饮", id: 1 },
        { name: "副饮", id: 2 },
      ],
      // 选择商品弹框
      dialogGoods: false,
      goods: {
        type: "",
        name: "",
      },
      // goodsTypeList:[{name:'全部物品种类',id:1},{name:'酒水',id:2}],
      notChoseGoodsList: [],
      ChoseGoodsList: [],

      aliyunOssToken: {},
      meatId: 0,
      choseGroupId: 0,
      packTabTotal: 0,
      choseGoodsId: 0,
      rgtChoseGoodsList: [],
      goodsLoading: false,

      systemDialog: false,
      systemList: [],
      systemListRgt: [],
      isSystem: 0,

      isScan: false,

      isEnter: false,

      isNextLoading: false,
      isGroupLoading: false,
      // choseMoutObj: {}
    };
  },
  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.init();
    this.getCategory();
  },
  mounted() {
    this.getOssToken();
    // this.initPlUploader()
  },
  methods: {
    getOssToken() {
      ossgetpolicytoken(13).then((res) => {
        if (res.code == 0) {
          this.aliyunOssToken = res.result;
        }
      });
    },
    init() {
      this.loading = true;
      goodslist2(
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
        this.typeList = res.result;
        this.typeList1 = addAll(res.result);
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
    async onScan(obj) {
      this.meatId = obj.id;
      this.activeStep = 1;
      this.dialogVal = true;
      this.isScan = true;
      await this.initGroup();
      await this.onTab(0);
    },
    onAdd() {
      this.isScan = false;
      Object.keys(this.temp).forEach((key) => {
        this.temp[key] = "";
      });
      this.temp.pos = true;
      this.temp.pos1 = true;
      this.temp.pos2 = true;
      this.temp.tag = true;
      this.temp.tag1 = true;
      this.temp.status = 1;
      this.activeStep = 0;
      this.barcodeList = [];
      this.getUnit();
      this.choseId = 0;
      this.dialogText = "新增套餐";
      this.dialogVal = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.diainput.focus();
      });
    },
    async onEdit(obj) {
      this.isScan = false;
      this.choseId = obj.id;
      this.activeStep = 0;
      await this.getUnit();
      goodsinfo2(obj.id).then((res) => {
        let reda = res.result.data;
        this.temp.code = reda.code;
        this.temp.name = reda.name;
        this.temp.money = reda.price;
        this.temp.stdmode = reda.good_type_id;
        this.temp.unit = reda.unit;
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
        });

        this.$forceUpdate();

        this.dialogText = "修改套餐";
        this.dialogVal = true;

        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
          this.$refs.diainput.focus();
        });
      });
    },
    onImgRemove() {},
    onImgSuccess() {},
    onStatus(obj) {
      let status = 0;
      if (obj.status == 1) {
        status = 2;
      } else {
        status = 1;
      }
      goodsstatus2({
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
      this.$confirm("是否确认删除此套餐？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        goodsdelete2({ id }).then((res) => {
          if (res.code == 0) {
            this.$message.success("删除成功");
            this.init();
          }
        });
      });
    },
    // 单位
    getUnit() {
      goodsunitlist(this.id).then((res) => {
        this.unitList = res.result.data;
      });
    },
    onAddUnit() {
      this.isAddUnit = true;
    },
    addUnitConfirm() {
      if (this.unitNew.length > 0) {
        this.isEnter = true;
        goodsunitadd({
          store_id: this.id,
          name: this.unitNew,
        })
          .then((res) => {
            this.isAddUnit = false;
            this.unitNew = "";
            this.$message.success("新增成功");
            this.getUnit();
            this.isEnter = false;
          })
          .catch((err) => {
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
    onStep(e) {
      if (e == 1) {
        // 下一步时
        let barcodes = this.barcodeList.toString();
        let show_case = [];
        let tag = [];
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
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            this.isNextLoading = true;
            if (this.choseId > 0) {
              goodsupdate2({
                id: this.choseId,
                code: this.temp.code,
                name: this.temp.name,
                status: this.temp.status,
                price: this.temp.money,
                good_type_id: this.temp.stdmode,
                unit: this.temp.unit,
                barcodes: barcodes,
                jianpin: this.temp.pym,
                show_case_arr: show_case,
                tag_arr: tag,
                picture_url: this.temp.pic,
              })
                .then(async (res) => {
                  if (res.code == 0) {
                    this.activeStep = 1;
                    this.meatId = res.result.id;
                    await this.initGroup();
                    this.isTab = 0;
                    await this.onTab(0);
                    this.$nextTick(() => {
                      this.rowDrop();
                    });
                    this.rgtChoseGoodsList = [];
                    this.isNextLoading = false;
                  }
                })
                .catch((err) => {
                  this.isNextLoading = false;
                });
            } else {
              goodsadd2({
                store_id: this.id,
                code: this.temp.code,
                name: this.temp.name,
                status: this.temp.status,
                price: this.temp.money,
                good_type_id: this.temp.stdmode,
                unit: this.temp.unit,
                barcodes: barcodes,
                jianpin: this.temp.pym,
                show_case_arr: show_case,
                tag_arr: tag,
                picture_url: this.temp.pic,
              })
                .then(async (res) => {
                  if (res.code == 0) {
                    this.activeStep = 1;
                    this.meatId = res.result.id;
                    await this.initGroup();
                    await this.onTab(0);
                    this.isTab = 0;
                    this.$nextTick(() => {
                      this.rowDrop();
                    });
                    this.isNextLoading = false;
                  }

                  // this.$message.success('新增套餐成功')
                  // this.dialogVal = false
                  // for(let i in this.temp) {
                  // 	this.temp[i] = ''
                  // }
                  // this.init()
                  // this.$nextTick(()=>{
                  // 	this.$refs['dataForm'].clearValidate()
                  // })
                })
                .catch((err) => {
                  this.isNextLoading = false;
                });
            }
          }
        });
      } else {
        this.activeStep = 0;
      }
    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.init();
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.init();
    },
    onConfirm() {
      this.dialogVal = false;
      this.activeStep = 0;
      this.init();
    },
    // 关联商品排序表格方法
    rowDrop() {
      let tbody = document.querySelector(
        ".drop-table .el-table__body-wrapper tbody"
      );
      let _this = this;
      Sortable.create(tbody, {
        // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
        group: {
          name: "words",
          pull: true,
          put: true,
        },
        animation: 150, // ms, number 单位：ms，定义排序动画的时间
        onAdd: function (evt) {
          // 拖拽时候添加有新的节点的时候发生该事件
          console.log("onAdd.foo:", [evt.item, evt.from]);
        },
        onUpdate: function (evt) {
          // 拖拽更新节点位置发生该事件
          console.log("onUpdate.foo:", [evt.item, evt.from]);
        },
        onRemove: function (evt) {
          // 删除拖拽节点的时候促发该事件
          console.log("onRemove.foo:", [evt.item, evt.from]);
        },
        onStart: function (evt) {
          // 开始拖拽出发该函数
          console.log("onStart.foo:", [evt.item, evt.from]);
        },
        onSort: function (evt) {
          // 发生排序发生该事件
          console.log("onUpdate.foo:", [evt.item, evt.from]);
        },
        onEnd({ newIndex, oldIndex }) {
          // 结束拖拽
          let currRow = _this.rgtChoseGoodsList.splice(oldIndex, 1)[0];
          _this.rgtChoseGoodsList.splice(newIndex, 0, currRow);
          let sorts = [];
          _this.rgtChoseGoodsList.forEach((item) => {
            sorts.push({ good_id: item.id, group_id: item.group_id });
          });
          goodsgroupupdategoodssort({
            good_id: _this.meatId,
            id: _this.choseGroupId,
            good_sorts: sorts,
          }).then((res) => {
            _this.$message.success("排序成功");
            _this.onTab(_this.isTab);
          });
        },
      });
    },
    // 类型分组的数据
    async initGroup() {
      this.packTabTotal = 0;
      await goodsgrouplist(this.meatId).then((res) => {
        res.result.data.forEach((item) => {
          this.packTabTotal = item.goods_num + this.packTabTotal;
        });
        this.packTab = [{ id: 0, name: "全部" }, ...res.result.data];
      });
    },

    onAddGroup() {
      if (this.packTab.length >= 6) {
        if (document.getElementsByClassName("el-message").length > 0)
          return false;
        this.$message.warning("最多可添加5个分组");
        return false;
      }
      Object.keys(this.groupTemp).forEach((key) => {
        this.groupTemp[key] = "";
      });
      this.groupTemp.num = 1;
      this.choseGroupId = 0;
      this.dialogGroupText = "新增分组";
      this.dialogGroup = true;
      this.$nextTick(() => {
        this.$refs["groupForm"].clearValidate();
      });
    },
    onEditGroup(obj) {
      this.choseGroupId = obj.id;
      goodsgroupinfo(obj.id).then((res) => {
        this.dialogGroupText = "编辑分组";
        this.dialogGroup = true;
        this.groupTemp.name = res.result.data.name;
        this.groupTemp.type = res.result.data.type;
        this.groupTemp.num = res.result.data.num;
        this.$nextTick(() => {
          this.$refs["groupForm"].clearValidate();
        });
      });
    },
    onGroupConfirm() {
      console.log("呜呜呜呜呜呜我11111111111111111111");
      this.$refs["groupForm"].validate((valid) => {
        console.log("valid", valid);
        if (valid) {
          this.isGroupLoading = true;
          if (this.choseGroupId > 0) {
            goodsgroupupdate({
              id: this.choseGroupId,
              name: this.groupTemp.name,
              type: this.groupTemp.type,
              num: this.groupTemp.num,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("编辑套餐分组成功");
                  for (let i in this.groupTemp) {
                    this.groupTemp[i] = "";
                  }

                  this.choseGroupId = 0;
                  this.initGroup();
                  this.dialogGroup = false;
                  this.$nextTick(() => {
                    this.$refs["groupForm"].clearValidate();
                  });
                  this.onTab(this.isTab);
                  this.isGroupLoading = false;
                }
              })
              .catch((err) => {
                this.isGroupLoading = false;
              });
          } else {
            goodsgroupadd({
              good_id: this.meatId,
              name: this.groupTemp.name,
              type: this.groupTemp.type,
              num: this.groupTemp.num,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("新增套餐分组成功");
                  for (let i in this.groupTemp) {
                    this.groupTemp[i] = "";
                  }
                  this.isTab = 0;
                  this.choseGroupId = 0;
                  this.initGroup();
                  this.dialogGroup = false;
                  this.$nextTick(() => {
                    this.$refs["groupForm"].clearValidate();
                  });
                }
                this.isGroupLoading = false;
              })
              .catch((err) => {
                this.isGroupLoading = false;
              });
          }
        } else {
          console.log("呜呜呜呜呜呜我");
        }
      });
    },
    // 商品弹窗的数据
    onTab(e) {
      this.isTab = e;
      this.choseGroupId = this.packTab[e].id;
      this.goodsLoading = true;
      goodsgroupselectedgoods(this.meatId, this.packTab[e].id).then((res) => {
        this.rgtChoseGoodsList = res.result.data;
        this.goodsLoading = false;
      });
    },
    async onGoods(obj) {
      Object.keys(this.goods).forEach((key) => {
        this.goods[key] = "";
      });
      this.goods.type = '0';
      this.choseGoodsId = obj.id;
      await goodsgroupunselectedgoods(
        this.id,
        obj.id,
        this.goods.type,
        this.goods.name
      ).then((res) => {
        this.notChoseGoodsList = res.result.data;
      });
      await goodsgroupselectedgoods(this.meatId, obj.id).then((res) => {
        this.ChoseGoodsList = res.result.data;
        this.dialogGoods = true;
      });
    },
    // 未选择商品到已选择里面
    onChoseGoods(obj) {
      this.notChoseGoodsList.map((item, i) => {
        if (item.id == obj.id) {
          this.notChoseGoodsList.splice(i, 1);
          this.ChoseGoodsList.push(item);
        }
      });
      this.initGroup();
    },
    onChoseGoodsAll() {
      // this.onGoodsConfirm()
      this.notChoseGoodsList.forEach((item) => {
        this.ChoseGoodsList.push(item);
      });
      this.notChoseGoodsList = [];
    },
    // 已选择商品到未选择里面
    onChoseGoodsDel(obj) {
      // goodsgroupdeletegoods({
      // 	id: this.choseGroupId,
      // 	good_ids: [obj.id]
      // }).then(res=>{
      // 	this.$message.success('删除成功')
      // 	this.dialogGoods = false
      // 	this.onTab(this.isTab)
      // 	this.initGroup()
      // })
      // this.ChoseGoodsList.forEach(item=>{
      // 	this.notChoseGoodsList.push(item)
      // })
      this.ChoseGoodsList = this.ChoseGoodsList.filter((item) => {
        return item.id != obj.id;
      });
      this.notChoseGoodsList.push(obj);
      // this.ChoseGoodsList.map((item,i) =>{
      // 	if(item.id == obj.id) {
      // 		this.ChoseGoodsList.splice(i,1)
      // 		this.notChoseGoodsList.push(item)
      // 	}
      // })
    },
    onChoseGoodsAllDel() {
      // let ids = []
      // this.ChoseGoodsList.forEach(item=>{
      // 	ids.push(item.id)
      // })
      // goodsgroupdeletegoods({
      // 	id: this.choseGroupId,
      // 	good_ids: ids
      // }).then(res=>{
      // 	this.$message.success('删除成功')
      // 	this.dialogGoods = false
      // 	this.onTab(this.isTab)
      // 	this.initGroup()
      // })
      this.ChoseGoodsList.forEach((item) => {
        this.notChoseGoodsList.push(item);
      });
      this.ChoseGoodsList = [];
    },
    onChoseRgtDel(obj) {
      goodsgroupdeletegoods({
        id: obj.group_id,
        good_ids: [obj.id],
      }).then((res) => {
        this.$message.success("删除成功");
        this.onTab(this.isTab);
        this.initGroup();
      });
    },
    onBlurMount(obj) {
      if (Number(obj.goods_num) <= 0) {
        this.$message.warning("不能为0");
        obj.goods_num = 1;
        // return;
      }

      // console.log(obj,'obj')
      if (Number(obj.goods_num) > Number(obj.group_num)) {
        this.$message.warning("不能大于数量");
        obj.goods_num = obj.group_num;
      }
      goodsgroupupdategoodsnum({
        id: obj.group_id,
        good_id: obj.id,
        num: Number(obj.goods_num),
      }).then((res) => {
        console.log("成功");
      });
    },
    // onUpdateMount(obj){
    // 	this.choseMoutObj = obj
    // 	obj.ismount = true
    // },
    // onFocus(row){
    // 	console.log(row,'row')
    // },
    onBlurUp(obj) {
      // goodsgroupupdategoodsnum({
      // 	id: this.choseGoodsId,
      // 	good_id: obj.id,
      // 	num: obj.group_num
      // }).then(res=>{
      // 	console.log('成功')
      // })
    },

    onSearchGoods() {
      goodsgroupunselectedgoods(
        this.id,
        this.choseGoodsId,
        this.goods.type,
        this.goods.name
      ).then((res) => {
        this.notChoseGoodsList = res.result.data;
      });
    },
    onGoodsConfirm() {
      let ids = [];
      this.ChoseGoodsList.forEach((item) => {
        ids.push(item.id);
      });
      goodsgroupaddgoods({
        id: this.choseGoodsId,
        good_ids: ids,
      }).then((res) => {
        this.goods.name = "";
        this.goods.type = "";
        this.$message.success("商品选择已确定");
        this.dialogGoods = false;
        this.onTab(this.isTab);
        this.initGroup();
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
        this.$message.warning("请先选择图片");
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
      console.log("queren");
      let pic = "";
      this.systemListRgt.forEach((item) => {
        if (item.checkout) {
          pic = item.picture_url;
        }
      });
      console.log(pic, "pic");
      this.temp.pic = pic;
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

    initPlUploader() {
      const _this = this;
      var uploader = new plupload.Uploader({
        runtimes: "html5,flash,silverlight,html4",
        browse_button: "file",
        url: "https://sep-admin-test.oss-cn-beijing.aliyuncs.com",
        resize: {
          width: 300,
          crop: false,
          quality: 60,
          preserve_headers: false,
        },
        filters: {
          mime_types: [
            //只允许上传图片和zip文件
            { title: "Image files", extensions: "jpg,jpeg,HEIC,gif,png,bmp" },
          ],
          max_file_size: "20mb", //最大只能上传10mb的文件
          prevent_duplicates: true, //不允许选取重复文件
        },

        init: {
          PostInit: function () {
            set_upload_param(uploader, "", false, 5);
          },
          //当文件添加到上传队列后触发监听函数参数
          FilesAdded: function (up, files) {
            if (!files[0] || !/image\//.test(files[0].type)) return; //确保文件是图片
            if (files[0].type == "image/gif") {
              //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
              var fr = new mOxie.FileReader();
              fr.onload = function () {
                console.log("sds", fr.result);
                _this.userInfo.headimgurl = fr.result;
                fr.destroy();
                fr = null;
              };
              fr.readAsDataURL(files[0].getSource());
            } else {
              var preloader = new mOxie.Image();
              preloader.onload = function () {
                preloader.downsize(200, 200); //先压缩一下要预览的图片,宽300，高300
                var imgsrc =
                  preloader.type == "image/jpeg"
                    ? preloader.getAsDataURL("image/jpeg", 80)
                    : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                _this.userInfo.headimgurl = imgsrc; //callback传入的参数为预览图片的url
                preloader.destroy();
                preloader = null;
              };
              preloader.load(files[0].getSource());
            }
            set_upload_param(up, files[0].name, true, 5);
          },
          BeforeUpload: function (up, file) {
            console.log("BeforeUpload");
            console.log(file);
            check_object_radio();
            set_upload_param(up, file.name, true, 5);
          },
          // 当队列中的某一个文件上传完成后触发监听函数参数
          FileUploaded: async function (up, file, info) {
            console.log(file);
            console.log(info);
            console.log(get_uploaded_object_name(file.name));
            try {
              // console.log()
              // let params = {};
              // params['headimgurl'] = process.env.VUE_APP_BASE_API + get_uploaded_object_name(file.name);
              // let res = await _this.$API.post(`/bulletscreen/user/update`, params);
              // if (res.code === 0) {
              // 	console.log('修改成功');
              // 	_this.reset();
              // } else {
              // 	console.log(res.message);
              // }
            } catch (error) {
              console.log(error.message);
              // console.log('修改个人信息失败');
            }
          },
          // 报错
          Error: function (up, err) {
            console.log(err);
            if (err.code == -600) {
              console.log("选择的文件太大了");
            } else if (err.code == -601) {
              console.log("选择的文件后缀不对");
            } else if (err.code == -602) {
              console.log("图片已经上传过一遍了");
            } else {
              console.log("未知错误");
            }
          },
        },
      });
      uploader.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.set-meat {
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
    .el-table th > .cell {
      white-space: pre-wrap;
    }
  }
  ::v-deep {
    table {
      width: 100% !important;
    }
  }
  .set-upload-input {
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
    input {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .img-close {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 16px;
      z-index: 10;
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
      left: 0;
      top: 0;
      z-index: 1;
    }
  }
  .set-meat-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    .set-meat-top-lft {
      display: flex;
      align-items: center;
      .set-meat-top-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        span {
          flex-shrink: 0;
          font-size: 14px;
          margin-right: 10px;
        }
      }
      .set-meat-top-item:not(:first-child) {
        width: 200px;
      }
    }
  }
  .set-meat-dialog {
    .set-meat-dialog-form {
      max-height: 550px;
      overflow-y: scroll;
    }
    .set-meat-dialog-form::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .set-meat-dialog-form {
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      overflow-x: hidden;
      overflow-y: auto;
    }
    .set-meat-item {
      display: flex;
      justify-content: space-between;
    }
    .set-meat-upload {
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
    }
  }
  .set-meat-footer {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    // justify-content: flex-end;
  }
  .set-meat-package {
    width: 30%;
    padding-right: 20px;
    box-sizing: border-box;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .set-meat-package-content {
      width: 100%;
      min-height: 350px;
      background-color: #fff;
      padding: 20px 10px;
      border-radius: 10px;
      box-sizing: border-box;
    }
    .set-meat-package-title {
      width: 100%;
      height: 30px;
      font-size: 16px;
      line-height: 30px;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .set-meat-package-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      margin: 10px 0;
      cursor: pointer;
    }
    .set-meat-package-item-active {
      color: #409eff;
    }
  }
}
.set-meat-table-add {
  width: 100%;
  height: 53px;
  border: 1px solid EBEEF5;
  margin-top: 10px;
  ::v-deep .el-input__inner{
		border: 1px solid #7B7D84;
	}
}
.set-meat-chose-goods {
  position: absolute;
  right: 20px;
  top: -20px;
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
    border: 2px solid #f2f2f2;
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
</style>
