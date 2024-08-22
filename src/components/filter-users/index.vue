<template>
	<div class="filter_and_pay_container">
		<div class="filter_and_search_wrapper">
			<div class="filter_and_dialog_wrapper">
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
			>
				pay dues
			</button>
		</div>
	</div>
</template>

<script setup>
	import FilterIcon from '@assets/icons/filter.svg'
	import SearchIcon from '@assets/icons/search.svg'
	import SelectedFilter from '@assets/icons/filter/selected-filter.svg'
	import UnselectedFilter from '@assets/icons/filter/unselected-filter.svg'
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
	const { filterParams } = storeToRefs(adminStore)

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

	watch(localSearchString, (newValue, oldValue) => {
		if (newValue?.trim() !== oldValue?.trim()) debouncedUpdateSearch(newValue)
	})

	function toggleFilterDialog() {
		isFilterDialogOpen.value = !isFilterDialogOpen.value
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

		const isClickOnFilterButton = filterButton.value.contains(event.target)
		const isClickInsideFilterDialog = filterDialog.value.contains(event.target)

		if (isClickOnFilterButton || isClickInsideFilterDialog) return

		isFilterDialogOpen.value = false
	}

	onMounted(() => {
		document.addEventListener('click', handleFilterDialogVisibility)
	})

	onUnmounted(() => {
		document.removeEventListener('click', handleFilterDialogVisibility)
		filterDialogCloseDelay.value = null
	})
</script>

<style lang="scss" scoped>
	.filter_and_pay_container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;

		.filter_and_search_wrapper {
			display: flex;
			position: relative;

			.filter_container {
				display: flex;
				padding: 10px;
				border: 1px solid #c6c2de;
				background: #fff;
				align-items: center;
				margin: 0 20px 0 0;
				border-radius: 6px;
				cursor: pointer;
				transition: border 300ms, transform 500ms;

				&.selected {
					box-shadow: 0px 0px 3px 0px #6d5bd0;
					border: 1px solid #6d5bd0;
				}

				&:hover {
					border: 1px solid #6d5bd0;
					transition: border 300ms;
				}

				&:active {
					transform: scale(0.96);
					transition: transform 200ms;
				}

				.filter_text {
					margin-left: 10px;
					font-family: Inter;
					font-size: 16px;
					font-weight: 400;
					line-height: 19.36px;
					text-align: left;
				}
			}

			.filter_dialog_container {
				position: absolute;
				top: calc(var(--top-offset, 42px) + 5px);
				left: 0px;
				background: #fff;
				z-index: 1000;
				padding: 24px 18px;
				box-shadow: 0px 5px 8px 0px #00000033;
				border: 1px solid #c6c2de;
				border-radius: 6px;

				.sort_by_container {
					border-bottom: 1px solid #f2f0f9;
					margin-bottom: 5px;
				}

				.filter_title {
					font-family: Inter;
					font-size: 12px;
					font-weight: 400;
					line-height: 14.52px;
					letter-spacing: 0.05em;
					text-align: left;
					color: #6e6893;
					padding: 5px 10px;
				}

				.filter_item {
					display: flex;
					justify-content: space-between;
					gap: 90px;
					padding: 10px 10px;
					border-radius: 4px;
					cursor: pointer;

					&:hover {
						background: #f2f0f9;
					}
				}
			}

			.search_container {
				display: flex;
				position: relative;

				.search_input {
					padding: 10px 0 10px 40px;
					border-radius: 6px;
					border: none;
					background: #f4f2ff;
					text-overflow: ellipsis;
					transition: border 200ms;

					&:hover,
					&:focus,
					&:focus-visible {
						border: 1px solid #6d5bd0;
						transition: border 200ms;
						cursor: pointer;
					}
				}

				.search_icon {
					position: absolute;
					left: 10px;
					top: 50%;
					left: 10px;
					transform: translateY(-50%);
				}
			}
		}

		.pay_dues_wrapper {
			border-radius: 6px;
			background: #6d5bd0;

			.pay_dues_btn {
				padding: 10px;
				font-family: Inter;
				font-size: 16px;
				font-weight: 600;
				line-height: 19.36px;
				text-align: left;
				text-transform: uppercase;
				background: transparent;
				color: #ffffff;
				outline: none;
				border: none;
			}
		}
	}
</style>
