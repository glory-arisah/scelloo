f
<template>
	<div class="table_container">
		<table
			class="parent_table"
			cellpadding="0"
			cellspacing="0"
		>
			<thead class="table_header">
				<tr :class="checkAllUsersClasslist">
					<td class="cell">
						<div class="checkbox_wrapper cell">
							<label class="custom-checkbox">
								<input
									type="checkbox"
									name="select-visible-users"
									:checked="allPaginatedUserChecked"
									@change="handleSelectAllPaginatedUsers"
								/>
								<span class="checkmark">
									<img
										:src="CheckMark"
										alt="select all users"
									/>
								</span>
							</label>
						</div>
					</td>
					<td class="cell">name</td>
					<td class="cell">user status</td>
					<td class="cell"></td>
					<td class="cell">payment status</td>
					<td class="cell">
						<div class="align_right">amount</div>
					</td>
					<td
						class="cell"
						colspan="2"
					>
						<div class="view_more_cell">
							<div></div>
							<div class="more_icon_wrapper">
								<img
									:src="MoreIcon"
									alt="more"
								/>
							</div>
						</div>
					</td>
				</tr>
			</thead>

			<template
				v-for="user in paginationUsersWithIcons"
				:key="user.id"
			>
				<tr
					:class="[
						'row',
						user.id === userInView?.id ? 'highlight_row' : '',
						selectedUsersIds.includes(user.id) ? 'highlight_row_border' : '',
					]"
				>
					<td class="cell">
						<div class="checkbox_wrapper cell">
							<label class="custom-checkbox">
								<input
									type="checkbox"
									name="select-visible-user"
									:value="user.id"
									:checked="selectedUsersIds.includes(user.id)"
									v-model="selectedUsersIds"
								/>
								<span class="checkmark">
									<img
										:src="CheckMark"
										alt="select user"
									/>
								</span>
							</label>
							<img
								:src="ChevronDown"
								:class="[
									'chevron_down',
									user.id === userInViewId ? 'open' : '',
								]"
								role="button"
								@click="toggleUserActivitiesVisibility(user.id)"
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
							<div
								class="user_status_wrapper"
								:style="`
									--clr-bg: var(--clr-bg-${user.activeStatus});
									--clr-font: var(--clr-font-${user.activeStatus})
								`"
							>
								<img
									:src="user.activeIndicator"
									:alt="user.activeStatus"
								/>
								<span :class="user.activeStatus">
									{{ capitalize(user.activeStatus) }}
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
									--clr-bg: var(--clr-bg-${user.paymentStatus});
									--clr-font: var(--clr-font-${user.paymentStatus})
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
									user.dueDate.format('DD/MMM/YYYY')
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
						<div class="more_details_wrapper">
							<div class="view_more_cell">
								<div class="view_more">View more</div>
								<div
									class="more_icon_wrapper"
									@click="handleSelectedOption(user.id)"
								>
									<img
										:src="MoreIcon"
										alt="more"
									/>
								</div>
							</div>

							<div
								class="more_dialog_wrapper"
								v-if="selectedOption === user.id"
								@click="closeOptionsDialog"
							>
								<button class="close_icon">
									<img
										:src="CloseIcon"
										alt="close options"
									/>
								</button>
								<ul class="options_list">
									<li class="item edit">Edit</li>
									<li class="item view_profile">View Profile</li>
									<li class="item activate_user">Activate User</li>
								</ul>
								<p class="delete"><span>Delete</span></p>
							</div>
						</div>
					</td>
				</tr>

				<tr
					v-if="userInView && userInView.id === user.id"
					class="accordion_content"
					:style="{
						height: `${contentHeight}px`,
					}"
				>
					<td
						colspan="7"
						ref="contentRef"
					>
						<table
							class="activity_table"
							cellpadding="0"
							cellspacing="20"
						>
							<thead>
								<tr class="activity_header_row">
									<th class="activity_cell">DATE</th>
									<th class="activity_cell">USER ACTIVITY</th>
									<th class="activity_cell">
										<div class="user_activity_details">
											<span> DETAIL </span>
											<img
												:src="DetailsIcon"
												alt="details"
											/>
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-if="
										!userInView.userActivities ||
										!userInView.userActivities.length
									"
									class="no_records row"
								>
									<td
										colspan="3"
										class="no_records"
										style="height: 100px"
									>
										NO RECORDS FOUND
									</td>
								</tr>

								<template v-else>
									<tr
										v-for="(userActivity, index) in userInView.userActivities"
										:key="index"
										class="row"
									>
										<td class="activity_cell date">{{ userActivity.date }}</td>
										<td class="activity_cell activity">
											{{ userActivity.activity }}
										</td>
										<td class="activity_cell detail">
											{{ userActivity.detail }}
										</td>
									</tr>
								</template>
							</tbody>
						</table>
					</td>
				</tr>
			</template>
		</table>
	</div>
</template>

<script setup>
	import MoreIcon from '/public/assets/icons/more.svg'
	import ChevronDown from '/public/assets/icons/chevron-down.svg'
	import PaidIndicator from '/public/assets/icons/payment-status/paid.svg'
	import UnpaidIndicator from '/public/assets/icons/payment-status/unpaid.svg'
	import OverdueIndicator from '/public/assets/icons/payment-status/overdue.svg'
	import ActiveIndicator from '/public/assets/icons/active-status/active.svg'
	import InactiveIndicator from '/public/assets/icons/active-status/inactive.svg'
	import CheckMark from '/public/assets/icons/payment-status/checkmark.svg'
	import DetailsIcon from '/public/assets/icons/details.svg'
	import CloseIcon from '/public/assets/icons/close.svg'

	import { useAdminStore } from '@store'
	import { storeToRefs } from 'pinia'
	import { ref, computed, nextTick, watch, onUnmounted } from 'vue'
	import {
		USER_PAID_CATEGORIES,
		USER_ACTIVE_CATEGORIES,
	} from '@views/admin/constants'
	import { capitalize } from '@utils/stringFormatter'

	const adminStore = useAdminStore()
	const {
		pageNumber,
		usersPerPage,
		paginatedUsers,
		filterParams,
		selectedUsersIds,
	} = storeToRefs(adminStore)

	const userInViewId = ref(0)
	const contentHeight = ref(0)
	const contentRef = ref(null)
	const tickBoxChecked = ref([])
	const selectedOption = ref('')

	const userInView = computed(() => {
		if (!userInViewId.value) return null
		return paginatedUsers.value.find((user) => user.id === userInViewId.value)
	})

	const stopExpandedUserDetailsWatcher = watch(
		() => ({
			pageNumber: pageNumber.value,
			usersPerPage: usersPerPage.value,
			filterParams: filterParams.value,
		}),
		() => {
			userInViewId.value = null
		}
	)

	const allPaginatedUserChecked = computed(() => {
		return (
			paginatedUsers.value.length > 0 &&
			paginatedUsers.value.every((user) =>
				selectedUsersIds.value.includes(user.id)
			)
		)
	})

	const checkAllUsersClasslist = computed(() => [
		'row',
		'table_header_row',
		allPaginatedUserChecked.value ? 'highlight_row_border' : '',
	])

	const paginationUsersWithIcons = computed(() =>
		paginatedUsers.value.map((user, index) => ({
			...user,
			paymentIndicator:
				user.paymentStatus === USER_PAID_CATEGORIES.PAID
					? PaidIndicator
					: user.paymentStatus === USER_PAID_CATEGORIES.UNPAID
					? UnpaidIndicator
					: OverdueIndicator,
			activeIndicator:
				user.activeStatus === USER_ACTIVE_CATEGORIES.ACTIVE
					? ActiveIndicator
					: InactiveIndicator,
		}))
	)

	function closeOptionsDialog() {
		selectedOption.value = ''
	}

	function handleSelectedOption(userId) {
		if (selectedOption.value === userId) {
			selectedOption.value = ''
			return
		}

		selectedOption.value = userId
	}

	function toggleUserActivitiesVisibility(userId) {
		if (userInViewId.value === userId) {
			userInViewId.value = 0
			return
		}

		userInViewId.value = userId
		nextTick(() => {
			if (contentRef.value) {
				contentHeight.value = contentRef.value.scrollHeight
			}
		})
	}

	function handleSelectAllPaginatedUsers(event) {
		if (event.target.checked) {
			adminStore.updateSelectedUsersId(
				paginatedUsers.value.map((user) => user.id)
			)
		} else {
			adminStore.updateSelectedUsersId([])
		}
	}

	onUnmounted(() => {
		stopExpandedUserDetailsWatcher()
	})
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
