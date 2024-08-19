<template>
	<div class="user_table_container">
		<div class="table_header">
			<div class="checkbox_wrapper table_cell">
				<input
					class="select_visible_users_input"
					type="checkbox"
					name="select-visible-users"
				/>
			</div>
			<div class="table_cell">name</div>
			<div class="table_cell">user status</div>
			<div class="table_cell">payment status</div>
			<div class="table_cell">amount</div>
			<div class="table_cell">
				<img
					:src="MoreIcon"
					alt="more"
				/>
			</div>
		</div>
		<div class="user_list"></div>
	</div>
</template>

<script setup>
	import MoreIcon from '@assets/icons/more.svg'
	import { useAdminStore } from '@store'
	import { storeToRefs } from 'pinia'

	const adminStore = useAdminStore()
	const { users } = storeToRefs(adminStore)
</script>

<style lang="scss" scoped>
	.table_header {
		background-color: #f4f2ff;
		display: flex;
		justify-content: space-between;
		padding: 12.5px 20px;
		border-bottom-left-radius: 12px;
		border-bottom-right-radius: 12px;
		align-items: center;

		.table_cell {
			text-transform: uppercase;
			font-family: Inter;
			font-size: 12px;
			font-weight: 600;
			line-height: 14.52px;
			letter-spacing: 0.05em;
			text-align: left;
			color: #6e6893;
		}

		.select_visible_users_input {
			width: 20px;
			height: 20px;
		}
	}
</style>
