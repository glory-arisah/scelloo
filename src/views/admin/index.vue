<template>
	<div class="main_container">
		<div class="table_heading_wrapper">
			<h1 class="table_heading">Table heading</h1>
		</div>

		<section class="payment_status_wrapper">
			<div class="payment_statuses">
				<div
					v-for="paymentStatus in USER_PAID_CATEGORIES"
					:key="paymentStatus"
					:class="[
						'payment_status',
						paymentStatus === paymentStatusFilter ? 'active' : '',
					]"
					@click="handleUserPaymentFilter(paymentStatus)"
				>
					{{ capitalize(paymentStatus) }}
				</div>
			</div>
			<div class="flex_space_placeholder"></div>
			<div class="total_payable_amount_wrapper">
				<span class="total_payable_amount_dialog">Total payable amount: </span
				><span class="total_payable_amount"
					>${{ adminStore.totalPayableAmount }}.00
				</span>
				<span class="total_payable_amount_currency">usd</span>
			</div>
		</section>

		<section class="user_table_container">
			<FilterUsers />
			<UserList />
			<Pagination />
		</section>
	</div>
</template>

<script setup>
	import { useAdminStore } from '@store'
	import { ref, computed, onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	import { USER_PAID_CATEGORIES } from './constants'
	import FilterUsers from '@components/filter-users/index.vue'
	import UserList from '@components/user-list/index.vue'
	import Pagination from '@components/pagination/index.vue'
	import { capitalize } from '@utils/stringFormatter'

	const adminStore = useAdminStore()
	const { filterParams } = storeToRefs(adminStore)

	const searchString = ref('')
	const selectedUser = ref(null)

	const paymentStatusFilter = computed(
		() => filterParams.value.userPaymentStatus
	)

	function handleUserPaymentFilter(paymentStatus) {
		adminStore.updateSelectedUsersId([])
		if (paymentStatus === paymentStatusFilter.value) return

		adminStore.updateFilterParams({
			...adminStore.filterParams,
			userPaymentStatus: paymentStatus,
		})

		adminStore.updatePaginationData({
			...adminStore.pagination,
			pageNumber: 1,
		})
	}

	onMounted(() => {
		adminStore.fetchUsers(95)
	})
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
