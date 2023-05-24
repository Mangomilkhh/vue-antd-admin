<template>
	<page-layout title="自定义表格">
		<a-card :bordered="false"  v-if="showComponent">
			<div>
				<a-button @click="handleAdd">Add</a-button>
				<a-button v-if="editable" @click="check">提交</a-button>
				<a-button v-if="editable" @click="cancel">取消</a-button>
				<a-button v-else @click="editable = true" type="primary">批量修改</a-button>
				<a-table bordered :data-source="dataSource" :columns="columns" :key="componentKey">
					<template slot="name" slot-scope="text, record">
						<editable-cell :text="text" :editable="editable" @change="onCellChange(record.key, 'name', $event)" />
					</template>
					<template slot="address" slot-scope="text, record">
						<editable-cell :text="text" :editable="editable" @change="onCellChange(record.key, 'address', $event)" />
					</template>
					<template slot="operation" slot-scope="text, record">
						<a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="() => onDelete(record.key)">
							<a href="javascript:;">Delete</a>
						</a-popconfirm>
					</template>
				</a-table>
			</div>
		</a-card>
	</page-layout>
</template>

<script>
import PageLayout from "../../layouts/PageLayout";
import EditableCell from "./EditableCell.vue"

export default {
	name: "SelfTable",
	components: {
		EditableCell, PageLayout
	},
	inject: ['selfRefresh'],//TabsView祖先文件provide过来的方法
	data() {
		return {
			componentKey:0,
			showComponent: true,
			editable: false,
			dataSource: [
				{
					key: '0',
					name: 'zero',
					age: '3',
					address: '',
				},
				{
					key: '1',
					name: 'one',
					age: '32',
					address: 'Londonone',
				},
			],
			dataSource2: [],
			count: 2,
			columns: [
				{
					title: 'name',
					dataIndex: 'name',
					width: '30%',
					align: "center",
					scopedSlots: { customRender: 'name' },
				},
				{
					title: 'age',
					dataIndex: 'age',
				},
				{
					title: 'address',
					dataIndex: 'address',
					width: '30',
					scopedSlots: { customRender: 'address' },
				},
				{
					title: 'operation',
					dataIndex: 'operation',
					scopedSlots: { customRender: 'operation' },
				},
			],
		};
	},
	methods: {
		check() {
			this.editable = false;
      //提交this.dataSource给接口再刷新

			//把组件设置显示隐藏的方式刷新
			// this.showComponent = false
      // this.$nextTick(() => {
      //   this.showComponent = true
      // })

			//给组件的key增加的方式刷新,视图才可以显示最新值
			// this.componentKey += 1;
		},
		cancel() {
			this.editable = false;
      //试试重新刷新接口,获取初始值

      // this.dataSource=(接口的初始值)

			// window.location.reload();//会刷新这个网页，性能不好
			// this.selfRefresh('selftable_cancel'//刷新当前组件
			// 	, {
			// 		cachedKey: "/details/selftable163",
			// 		// fullPath: "/details/selftable",
			// 		// keyPath: "/details/selftable",
			// 		loading: false,
			// 		path: "/details/selftable",
			// 		_init_: true
			// 	})
		},
		onCellChange(key, dataIndex, value) {
      //数据一直实时更新，就看视图怎么显示
			// const dataSource2 = [...this.dataSource];
			const dataSource2 = JSON.parse(JSON.stringify([...this.dataSource]));
			const target = dataSource2.find(item => item.key === key);
			if (target) {
				target[dataIndex] = value;
				this.dataSource = dataSource2;
			}
			// console.log('100',key, dataIndex, value);
			// console.log('3213', this.dataSource, dataSource2);
		},
		onDelete() {
			// const dataSource = [...this.dataSource];
			// this.dataSource = dataSource.filter(item => item.key !== key);
		},
		handleAdd() {
			// const { count, dataSource } = this;
			// const newData = {
			// 	key: count,
			// 	name: `Edward King ${count}`,
			// 	age: 32,
			// 	address: `London, Park Lane no. ${count}`,
			// };
			// this.dataSource = [...dataSource, newData];
			// this.count = count + 1;
		},
	},
};
</script>


<style>
.editable-cell {
	/* position: relative; */
}

.editable-cell-text-wrapper {
	padding: 5px 24px 5px 5px;
}

.ant-btn {
	margin: 0 10px 10px 0;
}
</style>
  