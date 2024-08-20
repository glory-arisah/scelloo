<template>
	<div class="main_container">
		<div class="table_heading_wrapper">
			<h1 class="table_heading">Table heading</h1>
		</div>

		<section class="payment_status_wrapper">
			<div class="payment_statuses">
				<div>All</div>
				<div>Paid</div>
				<div>Unpaid</div>
				<div>Overdue</div>
			</div>
			<div class="flex_space_placeholder"></div>
			<div class="total_payable_amount_wrapper">
				<span class="total_payable_amount_dialog">Total payable amount: </span
				><span class="total_payable_amount">${{ totalPayableAmount }}.00 </span>
				<span class="total_payable_amount_currency">usd</span>
			</div>
		</section>

		<section class="user_table_container">
			<FilterUsers />
			<UserList />
		</section>
	</div>
</template>

<script setup>
	import { useAdminStore } from '@store'
	import { ref, computed, onMounted } from 'vue'
	import FilterUsers from '@components/filter-users/index.vue'
	import UserList from '@components/user-list/index.vue'
	import {
		USER_ACTIVE_CATEGORIES,
		USER_PAID_CATEGORIES,
		SORT_FILTERS,
	} from './constants'

	const adminStore = useAdminStore()
	const searchString = ref('')
	const selectedUser = ref(null)

	onMounted(() => {
		adminStore.fetchUsers(80)
	})
	const totalPayableAmount = computed(() => 900)
</script>

<style lang="scss" scoped>
	.main_container {
		padding: 50px 2rem 0;
		@media screen and (min-width: 744px) {
			padding: 50px 100px 100px;
		}

		.table_heading_wrapper {
			margin-bottom: 1rem;

			.table_heading {
				font-family: Inter;
				font-size: 14px;
				font-weight: 700;
				line-height: 16.94px;
				letter-spacing: 0.1em;
				text-align: left;
				color: #6e6893;
				text-transform: uppercase;
			}
		}

		.payment_status_wrapper {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #c6c2de;
			margin-bottom: 20px;

			.payment_statuses {
				display: flex;

				div {
					color: #6e6893;
					font-family: Inter;
					font-size: 14px;
					font-weight: 500;
					line-height: 16.94px;
					text-align: left;
					cursor: pointer;
					padding: 6px 4px;
					margin-right: 0.2rem;

					@media screen and (min-width: 744px) {
						padding: 6px 10px;
						margin-right: 30px;
					}
				}
			}

			.total_payable_amount_wrapper {
				.total_payable_amount_dialog {
					font-family: Inter;
					font-size: 14px;
					font-weight: 500;
					line-height: 16.94px;
					text-align: left;
					color: #6e6893;
				}

				.total_payable_amount {
					font-family: Inter;
					font-size: 18px;
					font-weight: 700;
					line-height: 21.78px;
					text-align: left;
					color: #6d5bd0;
				}

				.total_payable_amount_currency {
					font-family: Inter;
					font-size: 18px;
					font-weight: 400;
					line-height: 21.78px;
					text-align: left;
					text-transform: uppercase;
					color: #6e6893;
				}
			}
		}

		.user_table_container {
			background: #fff;
			border-radius: 12px; // look into later
			box-shadow: 0px 0px 5px 0px #00000033;
		}
	}
</style>
