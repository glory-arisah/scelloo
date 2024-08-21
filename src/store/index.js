import { defineStore } from 'pinia'
import { generateUsers } from '@utils/generateUsers'
import { SORT_FILTERS, USER_ACTIVE_CATEGORIES } from '@views/admin/constants'

function filterByActiveUser(users, userActiveStatus) {
	switch (userActiveStatus) {
		case USER_ACTIVE_CATEGORIES.ALL:
			return users
		default:
			return users.filter((user) => user?.userStatus === userActiveStatus)
	}
}

function sortUsers(users, sortValue) {
	switch (sortValue) {
		case SORT_FILTERS.DEFAULT:
			return users
		case SORT_FILTERS.LAST_LOGIN:
			return users
				.slice()
				.sort((a, b) =>
					dayjsWrapper(a, 'MM/DDD/YYYY').isBefore(
						dayjsWrapper(b, 'MM/DDD/YYYY')
					)
				)
		default:
			return users.slice().sort((a, b) => a[sortValue] < b[sortValue])
	}
}

export const useAdminStore = defineStore('admin', {
	state: () => ({
		users: [],
		filterParams: {
			sortBy: SORT_FILTERS.DEFAULT,
			userActiveCategory: USER_ACTIVE_CATEGORIES.ALL,
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
			if (Object.values(state.filterParams).some((filter) => !filter))
				return state.users

			return filterByActiveUser(
				state.users,
				state.filterParams.userActiveCategory
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
	},
})
