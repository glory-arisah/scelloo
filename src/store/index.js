import { defineStore } from 'pinia'
import { generateUsers } from '@utils/generateUsers'
import {
	filterUsersByPaymentAndActiveStatus,
	sortUsers,
} from '@utils/userFilter'
import {
	SORT_FILTERS,
	USER_ACTIVE_CATEGORIES,
	USER_PAID_CATEGORIES,
} from '@views/admin/constants'

export const useAdminStore = defineStore('admin', {
	state: () => ({
		users: [],
		selectedUsersIds: [],
		filterParams: {
			sortBy: SORT_FILTERS.DEFAULT,
			activeStatus: USER_ACTIVE_CATEGORIES.ALL,
			userPaymentStatus: USER_PAID_CATEGORIES.ALL,
			searchString: '',
		},
		pagination: {
			pageNumber: 1,
			usersPerPage: 10,
		},
	}),
	actions: {
		fetchUsers(numberOfUsers) {
			this.users = generateUsers(numberOfUsers)
		},
		updateSelectedUsersId(payload) {
			this.selectedUsersIds = payload
		},
		updateUserPaymentStatus(userIds) {
			if (!userIds || !userIds.length) return

			this.users = this.users.map((user) => ({
				...user,
				paymentStatus:
					userIds.includes(user.id) &&
					user.paymentStatus !== USER_PAID_CATEGORIES.PAID
						? USER_PAID_CATEGORIES.PAID
						: user.paymentStatus,
			}))
		},
		updateFilterParams(payload) {
			this.filterParams = payload
		},
		updatePaginationData(payload) {
			this.pagination = payload
		},
	},
	getters: {
		pageNumber: (state) => state.pagination.pageNumber,
		usersPerPage: (state) => state.pagination.usersPerPage,
		filteredUsers: (state) => {
			return filterUsersByPaymentAndActiveStatus(
				state.users,
				state.filterParams.activeStatus,
				state.filterParams.userPaymentStatus,
				state.filterParams.searchString
			)
		},
		sortedUsers(state) {
			return sortUsers(this.filteredUsers, state.filterParams.sortBy)
		},
		paginatedUsers() {
			const startId = this.usersPerPage * (this.pageNumber - 1)
			const endId = startId + this.usersPerPage
			return this.sortedUsers.slice(startId, endId)
		},
		totalPayableAmount() {
			if (!this.filteredUsers || !this.filteredUsers.length) return 0

			return this.filteredUsers.reduce((acc, user) => {
				if (
					user.paymentStatus === USER_PAID_CATEGORIES.UNPAID ||
					user.paymentStatus === USER_PAID_CATEGORIES.OVERDUE
				) {
					acc += user.amount
				}

				return acc
			}, 0)
		},
	},
})
