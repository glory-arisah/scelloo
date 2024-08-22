<template>
	<div class="filter_and_pay_container">
		<div class="filter_and_search_wrapper">
			<div
				:class="`
				filter_and_dialog_wrapper
				${isFilterDialogOpen ? 'open' : ''}
			`"
			>
				<div
					ref="filterButton"
					class="filter_container"
					@click="toggleFilterDialog"
				>
					<img
						:src="FilterIcon"
						class="filter_icon"
					/>
					<div class="filter_text">Filter</div>
				</div>

				<section
					ref="filterDialog"
					:style="`--top-offset: ${filterButton?.offsetHeight}px`"
					class="filter_dialog_container"
					v-show="isFilterDialogOpen"
				>
					<div class="sort_by_container">
						<p class="filter_title">SORT BY:</p>
						<div
							v-for="sortFilter in SORT_FILTERS"
							:key="sortFilter"
							class="filter_item"
							@click="handleUpdateSortFilter(sortFilter)"
						>
							<p>
								{{
									splitAndCapitalizeStringByDelimiter(
										sortFilter,
										splitStringAtUpperCaseRegex
									)
								}}
							</p>
							<img
								:src="
									sortFilter === selectedSortFilter
										? SelectedFilter
										: UnselectedFilter
								"
							/>
						</div>
					</div>
					<div class="user_active_filter_container">
						<p class="filter_title">USERS:</p>
						<div
							v-for="activeFilter in USER_ACTIVE_CATEGORIES"
							:key="activeFilter"
							class="filter_item"
							@click="handleUpdateActiveFilter(activeFilter)"
						>
							<p>
								{{
									splitAndCapitalizeStringByDelimiter(
										activeFilter,
										splitStringAtUpperCaseRegex
									)
								}}
							</p>
							<img
								:src="
									activeFilter === selectedActiveUserFilter
										? SelectedFilter
										: UnselectedFilter
								"
							/>
						</div>
					</div>
				</section>
			</div>

			<div class="search_container">
				<img
					class="search_icon"
					:src="SearchIcon"
					alt="search-icon"
				/>
				<input
					class="search_input"
					name="filter-users"
					type="text"
					placeholder="Search Users by Name, Email or Date"
					v-model="localSearchString"
				/>
			</div>
		</div>

		<div class="pay_dues_wrapper">
			<button
				type="button"
				class="pay_dues_btn"
				:disabled="selectedUsersIds.length === 0"
				@click="handleUserPayment"
			>
				pay dues
			</button>
		</div>
	</div>
</template>

<script setup>
	import FilterIcon from '/public/assets/icons/filter.svg'
	import SearchIcon from '/public/assets/icons/search.svg'
	import SelectedFilter from '/public/assets/icons/filter/selected-filter.svg'
	import UnselectedFilter from '/public/assets/icons/filter/unselected-filter.svg'
	import { SORT_FILTERS, USER_ACTIVE_CATEGORIES } from '@views/admin/constants'
	import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
	import { useAdminStore } from '@store'
	import { storeToRefs } from 'pinia'
	import { splitAndCapitalizeStringByDelimiter } from '@utils/stringFormatter'
	import { debounce } from '@utils/debounce'

	const adminStore = useAdminStore()

	const splitStringAtUpperCaseRegex = ref(/(?=[A-Z])/g)
	const isFilterDialogOpen = ref(false)
	const filterDialogCloseDelay = ref(null)
	const filterButton = ref(null)
	const filterDialog = ref(null)
	const { filterParams, selectedUsersIds } = storeToRefs(adminStore)

	const selectedSortFilter = computed(() => filterParams.value.sortBy)
	const selectedActiveUserFilter = computed(
		() => filterParams.value.activeStatus
	)
	const localSearchString = ref(filterParams.value.searchString)

	const debouncedUpdateSearch = debounce((newString) => {
		adminStore.updateFilterParams({
			...adminStore.filterParams,
			searchString: newString,
		})
	}, 300)

	const stopSearchStringWatcher = watch(
		localSearchString,
		(newValue, oldValue) => {
			if (newValue?.trim() !== oldValue?.trim()) debouncedUpdateSearch(newValue)
		}
	)

	function toggleFilterDialog() {
		isFilterDialogOpen.value = !isFilterDialogOpen.value
	}

	function handleUserPayment() {
		if (selectedUsersIds.value.length > 0)
			adminStore.updateUserPaymentStatus(selectedUsersIds.value)
	}

	function handleUpdateSortFilter(sortFilter) {
		if (sortFilter !== selectedSortFilter) {
			adminStore.updateFilterParams({
				...adminStore.filterParams,
				sortBy: sortFilter,
			})

			filterDialogCloseDelay.value = setTimeout(() => {
				isFilterDialogOpen.value = false
			}, 500)
		}
	}

	function handleUpdateActiveFilter(activeFilter) {
		if (activeFilter !== selectedActiveUserFilter) {
			adminStore.updateFilterParams({
				...adminStore.filterParams,
				activeStatus: activeFilter,
			})

			filterDialogCloseDelay.value = setTimeout(() => {
				isFilterDialogOpen.value = false
			}, 500)
		}
	}

	function handleFilterDialogVisibility(event) {
		if (!isFilterDialogOpen.value) return

		const isClickOnFilterDropdownTrigger = filterButton.value.contains(
			event.target
		)
		const isClickInsideFilterDropdown = filterDialog.value.contains(
			event.target
		)

		if (isClickOnFilterDropdownTrigger || isClickInsideFilterDropdown) return

		isFilterDialogOpen.value = false
	}

	onMounted(() => {
		document.addEventListener('click', handleFilterDialogVisibility)
	})

	onUnmounted(() => {
		document.removeEventListener('click', handleFilterDialogVisibility)
		filterDialogCloseDelay.value = null
		stopSearchStringWatcher()
	})
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
