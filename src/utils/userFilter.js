import {
	SORT_FILTERS,
	USER_ACTIVE_CATEGORIES,
	USER_PAID_CATEGORIES,
} from '@views/admin/constants'

export function filterUsersByPaymentAndActiveStatus(
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

export function sortUsers(users, sortValue) {
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
