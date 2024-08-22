<template>
	<div class="pagination_wrapper">
		<div class="users_per_page_wrapper">
			Rows per page: {{ usersPerPageCount }}
			<CustomDropDown
				ref="customDropDown"
				:options="userCountOptions"
				:isDropdownOpen="isDropdownOpen"
				v-model="usersPerPageCount"
				@optionSelected="handleUsersPerPageCount"
				@toggleDropdownVisibility="(value) => (isDropdownOpen = value)"
			/>
		</div>
		<div class="users_count_wrapper">{{ userCountDialog }}</div>
		<div class="nav_btns_wrapper">
			<div>
				<button
					class="pagination_btn prev"
					@click="handlePrevPageNavigation"
					:disabled="pageNumber === 1"
				>
					<img
						:src="PrevPageIcon"
						alt="previous page"
					/>
				</button>
			</div>
			<div>
				<button
					class="pagination_btn next"
					@click="handleNextPageNavigation"
					:disabled="pageNumber === lastPageNumber"
				>
					<img
						:src="NextPageIcon"
						alt="next page"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import PrevPageIcon from '/public/assets/icons/pagination/prev-page.svg'
	import NextPageIcon from '/public/assets/icons/pagination/next-page.svg'
	import CustomDropDown from './custom-drop-down/index.vue'
	import { useAdminStore } from '@store'
	import { storeToRefs } from 'pinia'
	import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

	const adminStore = useAdminStore()
	const { pageNumber, usersPerPage, filteredUsers, paginatedUsers } =
		storeToRefs(adminStore)

	const userCountOptions = ref([10, 15, 20])
	const usersPerPageCount = ref(usersPerPage.value)
	const isDropdownOpen = ref(false)
	const customDropDown = ref(null)

	const paginationOffset = computed(
		() => usersPerPage.value * (pageNumber.value - 1)
	)

	function handleUsersPerPageCount(usersPerPage) {
		adminStore.updatePaginationData({
			usersPerPage,
			pageNumber: 1,
		})
	}

	const userCountDialog = computed(() => {
		if (filteredUsers.value?.length === 0) return ''
		if (filteredUsers.value?.length === 1) return '1 of 1'

		return `${paginationOffset.value + 1}-${
			paginationOffset.value + paginatedUsers.value.length
		} of ${filteredUsers.value?.length}`
	})

	const lastPageNumber = computed(() =>
		Math.ceil(filteredUsers.value.length / usersPerPage.value)
	)

	function handlePrevPageNavigation() {
		if (pageNumber.value === 1) return

		adminStore.updatePaginationData({
			pageNumber: pageNumber.value - 1,
			usersPerPage: usersPerPage.value,
		})
	}

	function handleNextPageNavigation() {
		if (pageNumber.value === lastPageNumber.value) return

		adminStore.updatePaginationData({
			pageNumber: pageNumber.value + 1,
			usersPerPage: usersPerPage.value,
		})
	}

	function handlePaginationDropdownVisibility(event) {
		if (!isDropdownOpen.value) return

		const isClickOnCustomDropdown = customDropDown.value.$el.contains(
			event.target
		)

		if (isClickOnCustomDropdown) return
		isDropdownOpen.value = false
	}

	onMounted(() => {
		document.addEventListener('click', handlePaginationDropdownVisibility)
	})

	onUnmounted(() => {
		document.removeEventListener('click', handlePaginationDropdownVisibility)
	})
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
