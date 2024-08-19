import { defineStore } from 'pinia'
import { generateUsers } from '@utils/generateUsers'

export const useAdminStore = defineStore('admin', {
	state: () => ({
		users: [],
	}),
	actions: {
		fetchUsers(numberOfUsers) {
			this.users = generateUsers(numberOfUsers)
		},
	},
})
