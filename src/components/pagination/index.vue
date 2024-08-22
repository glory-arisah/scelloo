<template>
	<div class="pagination_wrapper">
		<div class="users_per_page_wrapper">
			Rows per page: {{ usersPerPageCount }}
			<CustomDropDown
				:options="userCountOptions"
				v-model="usersPerPageCount"
				@optionSelected="handleUsersPerPageCount"
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
	import PrevPageIcon from '@assets/icons/pagination/prev-page.svg'
	import NextPageIcon from '@assets/icons/pagination/next-page.svg'
	import CustomDropDown from './custom-drop-down/index.vue'
	import { useAdminStore } from '@store'
	import { storeToRefs } from 'pinia'
	import { ref, computed } from 'vue'

	const adminStore = useAdminStore()
	const { pageNumber, usersPerPage, filteredUsers, paginatedUsers } =
		storeToRefs(adminStore)

	const userCountOptions = ref([10, 15, 20])
	const usersPerPageCount = ref(usersPerPage.value)
	const paginationOffset = ref(0)

	function handleUsersPerPageCount(usersPerPage) {
		adminStore.updatePaginationData({
			usersPerPage,
			pageNumber: 1,
		})

		paginationOffset.value = usersPerPage * (pageNumber.value - 1)
	}

	const userCountDialog = computed(() => {
		if (filteredUsers.value?.length === 0) return 0
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
		paginationOffset.value = usersPerPage.value * (pageNumber.value - 1)
	}

	function handleNextPageNavigation() {
		if (pageNumber.value === lastPageNumber.value) return

		adminStore.updatePaginationData({
			pageNumber: pageNumber.value + 1,
			usersPerPage: usersPerPage.value,
		})
		paginationOffset.value = usersPerPage.value * (pageNumber.value - 1)
	}
</script>

<style lang="scss" scoped>
	.pagination_wrapper {
		display: flex;
		justify-content: flex-end;
		padding: 15px 28px;
		background: #f4f2ff;
		gap: 68px;
		border-bottom-left-radius: 12px;
		border-bottom-right-radius: 12px;

		.nav_btns_wrapper {
			display: flex;
			gap: 56px;

			.pagination_btn {
				cursor: pointer;
				outline: none;
				border: none;
				background: transparent;

				&:disabled,
				&[disabled] {
					opacity: 0.4;
					cursor: not-allowed;
				}

				.next {
					transform: rotate(-180deg);
				}
			}
		}

		.users_count_wrapper,
		.users_per_page_wrapper {
			font-family: Inter;
			font-size: 12px;
			font-weight: 600;
			line-height: 14.52px;
			letter-spacing: 0.05em;
			text-align: left;
			color: #6e6893;

			display: flex;
			align-items: center;
			gap: 10px;
		}

		select {
			background-image: url(assets/icons/pagination/arrow-down.svg);
			background-position: right 5px top 50%;
		}
	}
</style>
