<template>
	<div class="filter_and_pay_container">
		<div class="filter_and_search_wrapper">
			<div class="filter_container">
				<img
					:src="FilterIcon"
					class="filter_icon"
				/>
				<div class="filter_text">Filter</div>
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
</script>

<style lang="scss" scoped>
	.filter_and_pay_container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;

		.filter_and_search_wrapper {
			display: flex;

			.filter_container {
				display: flex;
				padding: 10px;
				border: 1px solid #c6c2de;
				background: #fff;
				align-items: center;
				margin: 0 20px 0 0;
				border-radius: 6px;
				cursor: pointer;

				&.selected {
					box-shadow: 0px 0px 3px 0px #6d5bd0;
					border: 1px solid #6d5bd0;
				}

				&:hover {
					// INSERT HOVER STYLES
				}

				.filter_text {
					margin-left: 10px;
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
