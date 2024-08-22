import { defineStore } from 'pinia'
import { generateUsers } from '@utils/generateUsers'
import {
	SORT_FILTERS,
	USER_ACTIVE_CATEGORIES,
	USER_PAID_CATEGORIES,
} from '@views/admin/constants'

function filterUsersByPaymentAndActiveStatus(
	users,
	activeStatus,
	userPaymentStatus,
	searchTerm
) {
	if (!users || !users.length) return []

	return users.filter((user) => {
		const doesUserMatchPaymentStatus =
			userPaymentStatus === USER_PAID_CATEGORIES.ALL ||
			user.paymentStatus === userPaymentStatus

		const doesUserMatchActiveStatus =
			activeStatus === USER_ACTIVE_CATEGORIES.ALL ||
			user.userStatus === activeStatus

		const searchTermNameMatch =
			!searchTerm || user.fullName.toLowerCase().includes(searchTerm)
		const searchTermEmailMatch =
			!searchTerm || user.email.toLowerCase().includes(searchTerm)
		const searchTermLoginDateMatch =
			!searchTerm ||
			user.lastLogin.format('DD/MMM/YYYY').toLowerCase().includes(searchTerm)
		const searchTermDueDateMatch =
			!searchTerm ||
			user.dueDate.format('DD/MMM/YYYY').toLowerCase().includes(searchTerm)

		return (
			doesUserMatchActiveStatus &&
			doesUserMatchPaymentStatus &&
			(searchTermNameMatch ||
				searchTermEmailMatch ||
				searchTermLoginDateMatch ||
				searchTermDueDateMatch)
		)
	})
}

function sortUsers(users, sortValue) {
	switch (sortValue) {
		case SORT_FILTERS.DEFAULT:
			return users
		case SORT_FILTERS.LAST_LOGIN:
		case SORT_FILTERS.DUE_DATE:
			return users.slice().sort((a, b) => {
				if (a[sortValue].isBefore(b[sortValue], 'day')) {
					return -1
				} else if (a[sortValue].isAfter(b[sortValue], 'day')) {
					return 1
				} else {
					return 0
				}
			})
		default:
			return users.slice().sort((a, b) => {
				if (a[sortValue] < b[sortValue]) {
					return -1
				} else if (a[sortValue] > b[sortValue]) {
					return 1
				} else {
					return 0
				}
			})
	}
}

export const useAdminStore = defineStore('admin', {
	state: () => ({
		users: [],
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
