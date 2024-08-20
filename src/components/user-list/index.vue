<template>
	<div class="table_container">
		<table>
			<thead class="table_header">
				<tr class="table_header_row row">
					<td class="cell">
						<div class="checkbox_wrapper cell">
							<input
								class="user_checkbox select_users_input"
								type="checkbox"
								name="select-visible-users"
							/>
						</div>
					</td>
					<td class="cell">name</td>
					<td class="cell">user status</td>
					<td class="cell"></td>
					<td class="cell">payment status</td>
					<td class="cell">
						<div class="align_right">amount</div>
					</td>
					<td class="cell"></td>
					<td
						class="cell"
						colspan="2"
					>
						<div>
							<img
								:src="MoreIcon"
								alt="more"
							/>
						</div>
					</td>
				</tr>
			</thead>
			<tbody>
				<tr
					class="row"
					v-for="user in paginatedUsers"
					:key="user.fullName"
				>
					<td class="cell">
						<div class="checkbox_wrapper cell">
							<input
								class="user_checkbox select_user_input"
								type="checkbox"
								name="select-visible-users"
							/>
							<img
								:src="ChevronDown"
								class="chevron_down"
							/>
						</div>
					</td>
					<td class="cell">
						<div class="split_two_rows user_name_email">
							<p class="user_name">{{ user.fullName }}</p>
							<p class="user_email">{{ user.email }}</p>
						</div>
					</td>
					<td class="cell">
						<div class="split_two_rows user_active_status">
							<div class="user_status_wrapper">
								<img
									:src="
										user.userStatus === 'active'
											? ActivIndicator
											: InactiveIndicator
									"
									:alt="user.userStatus"
								/>
								<span :class="user.userStatus">
									{{ capitalize(user.userStatus) }}
								</span>
							</div>
							<p class="user_last_login">
								Last login:
								<span class="last_login_date">{{
									user.lastLogin.format('DD/MMM/YYYY')
								}}</span>
							</p>
						</div>
					</td>
					<td></td>
					<td class="cell">
						<div class="split_two_rows user_paid_status">
							<div
								class="user_paid_indicator"
								:style="`
									background: var(--clr-bg-${user.paymentStatus});
									color: var(--clr-text-${user.paymentStatus})
								`"
							>
								<img :src="user.paymentIndicator" />
								<span class="payment_status">
									{{ capitalize(user.paymentStatus) }}
								</span>
							</div>
							<p class="user_payment_dialog">
								{{
									user.paymentStatus === USER_PAID_CATEGORIES.PAID
										? 'Paid on:'
										: user.paymentStatus === USER_PAID_CATEGORIES.UNPAID
										? 'Dues on:'
										: 'Dued on:'
								}}
								<span class="payment_date">{{
									user.lastLogin.add(1, 'day').format('DD/MMM/YYYY')
								}}</span>
							</p>
						</div>
					</td>
					<td class="cell">
						<div class="split_two_rows align_right amount_wrapper">
							<div class="amount">${{ user.amount }}</div>
							<div class="currency">USD</div>
						</div>
					</td>
					<td class="cell">
						<div class="view_more">View more</div>
					</td>
					<td class="cell">
						<div class="more_details_wrapper">
							<img
								:src="MoreIcon"
								alt="more"
							/>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
	import MoreIcon from '@assets/icons/more.svg'
	import ChevronDown from '@assets/icons/chevron-down.svg'
	import ActivIndicator from '@assets/icons/active-indicator.svg'
	import InactiveIndicator from '@assets/icons/inactive-indicator.svg'
	import PaidIndicator from '@assets/icons/payment-status/paid.svg'
	import UnpaidIndicator from '@assets/icons/payment-status/unpaid.svg'
	import OverdueIndicator from '@assets/icons/payment-status/overdue.svg'

	import { useAdminStore } from '@store'
	import { storeToRefs } from 'pinia'
	import { computed } from 'vue'
	import { USER_PAID_CATEGORIES } from '@views/admin/constants'
	import { capitalize } from '@utils/stringFormatter'

	const adminStore = useAdminStore()
	const { pageNumber, usersPerPage, sortedUsers } = storeToRefs(adminStore)

	// PAGINATION
	const paginatedUsers = computed(() => {
		const startId = usersPerPage.value * (pageNumber.value - 1)
		const endId = startId + usersPerPage.value
		return sortedUsers.value.slice(startId, endId).map((user) => {
			const hasMiddleName = !!user?.middleName

			const fullName = `${user.firstName} ${
				hasMiddleName ? user.middleName : ''
			} ${user.lastName}`
			return {
				...user,
				fullName,
				paymentIndicator:
					user.paymentStatus === USER_PAID_CATEGORIES.PAID
						? PaidIndicator
						: user.paymentStatus === USER_PAID_CATEGORIES.UNPAID
						? UnpaidIndicator
						: OverdueIndicator,
			}
		})
	})
</script>

<style lang="scss" scoped>
	.table_container {
		font-family: Arial, sans-serif;
		width: 100%;

		table {
			width: 100%;
			border-collapse: collapse;
		}

		thead {
			font-family: Inter;
			font-size: 12px;
			font-weight: 600;
			line-height: 14.52px;
			letter-spacing: 0.05em;
			text-align: left;
			color: #6e6893;
			text-transform: uppercase;
			background: #f4f2ff;
		}

		td:first-of-type {
			padding-left: 20px;

			div {
				width: fit-content;
			}
		}

		td:last-of-type {
			padding-right: 20px;
		}

		.row {
			height: 60px;
		}

		.user_checkbox {
			width: 20px;
			height: 20px;
		}

		.chevron_down {
			margin-left: 20px;
			&.open {
				transform: rotate(360);
				transition: transform 200ms;
			}

			&:hover {
				cursor: pointer;
			}

			&:active {
				transform: scale(0.96);
			}
		}

		.user_name_email {
			.user_name {
				font-family: Inter;
				font-size: 14px;
				font-weight: 500;
				line-height: 16.94px;
				text-align: left;
				color: #25213b;
			}

			.user_email {
				font-family: Inter;
				font-size: 14px;
				font-weight: 400;
				line-height: 16.94px;
				letter-spacing: 0.05em;
				text-align: left;
				color: #6e6893;
			}
		}

		.split_two_rows {
			display: flex;
			flex-direction: column;
			gap: 5px;
		}

		.user_active_status {
			.user_status_wrapper {
				border-radius: 10px;
				display: flex;
				padding: 2px 6px;
				background: #e6e6f2;
				width: fit-content;
				gap: 5px;

				span {
					font-family: Inter;
					font-size: 12px;
					font-weight: 500;
					line-height: 14.52px;
					text-align: left;
				}

				.active {
					color: #4a4aff;
				}

				.inactive {
					color: #6e6893;
				}
			}

			.user_last_login {
				font-family: Inter;
				font-size: 12px;
				font-weight: 500;
				line-height: 14.52px;
				text-align: left;
				color: #6e6893;

				.last_login_date {
					text-transform: uppercase;
				}
			}
		}

		.user_paid_status {
			.user_paid_indicator {
				border-radius: 10px;
				display: flex;
				padding: 2px 6px;
				width: fit-content;
				gap: 5px;

				.payment_status {
					font-family: Inter;
					font-size: 12px;
					font-weight: 500;
					line-height: 14.52px;
					text-align: left;
				}
			}

			.user_payment_dialog {
				font-family: Inter;
				font-size: 12px;
				font-weight: 500;
				line-height: 14.52px;
				text-align: left;
			}

			.payment_date {
				text-transform: uppercase;
			}
		}

		.align_right {
			text-align: right;
		}

		.amount_wrapper {
			.amount {
				font-family: Inter;
				font-size: 14px;
				font-weight: 500;
				line-height: 16.94px;
				color: #25213b;
			}

			.currency {
				font-family: Inter;
				font-size: 12px;
				font-weight: 400;
				line-height: 14.52px;
				letter-spacing: 0.05em;
				color: #6e6893;
			}
		}

		.view_more {
			font-family: Inter;
			font-size: 12px;
			font-weight: 500;
			line-height: 14.52px;
			text-align: left;
			color: #6e6893;
			margin-left: 25px;
		}
	}
</style>
