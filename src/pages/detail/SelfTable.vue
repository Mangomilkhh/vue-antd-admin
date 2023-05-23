<template>
	<page-layout title="自定义表格">
		<a-card :bordered="false">
			<div>
				<a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
				<a-button v-if="editable" @click="check">提交</a-button>
				<a-button v-if="editable" @click="cancel">取消</a-button>
				<a-button v-else @click="editable = true" type="primary">批量修改</a-button>
				<a-table bordered :data-source="dataSource" :columns="columns">
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
	data() {
		return {
			editable: false,
			dataSource: [
				{
					key: '0',
					name: 'zero',
					age: '32',
					address: 'Londonzero',
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
			this.dataSource = this.dataSource2;
			this.editable = false;
		},
		cancel() {
			this.dataSource = JSON.parse(JSON.stringify([...this.dataSource]));
			this.editable = false;
		},
		onCellChange(key, dataIndex, value) {
			// console.log('fff',key, dataIndex, value);
			// this.dataSource2 = [...this.dataSource];
			this.dataSource2 = JSON.parse(JSON.stringify([...this.dataSource]));
			const target = this.dataSource2.find(item => item.key === key);
			if (target) {
				target[dataIndex] = value;
			}
			console.log('3213',this.dataSource,this.dataSource2);
		},
		onDelete(key) {
			const dataSource = [...this.dataSource];
			this.dataSource = dataSource.filter(item => item.key !== key);
		},
		handleAdd() {
			const { count, dataSource } = this;
			const newData = {
				key: count,
				name: `Edward King ${count}`,
				age: 32,
				address: `London, Park Lane no. ${count}`,
			};
			this.dataSource = [...dataSource, newData];
			this.count = count + 1;
		},
	},
};
</script>


<style>
.editable-cell {
	/* position: relative; */
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
	/* padding-right: 24px; */
}

.editable-cell-text-wrapper {
	padding: 5px 24px 5px 5px;
}

/* .editable-cell-icon,
.editable-cell-icon-check {
	position: absolute;
	right: 0;
	width: 20px;
	cursor: pointer;
}

.editable-cell-icon {
	line-height: 18px;
	display: none;
}

.editable-cell-icon-check {
	line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
	display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
	color: #108ee9;
} */

.editable-add-btn {
	margin: 0 10px 10px 0;
}
</style>
  