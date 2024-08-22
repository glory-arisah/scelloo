<template>
	<div class="custom-dropdown">
		<button
			class="dropdown_header"
			@click="toggleDropdown"
		>
			<img
				class="dropdown-arrow"
				:src="ArrowDownIcon"
				alt="select number of users per page"
			/>
		</button>
		<ul
			v-show="isDropdownOpen"
			class="dropdown-list"
		>
			<li
				v-for="(option, index) in options"
				:key="index"
				@click="selectOption(option)"
				:class="option === modelValue ? 'current_selection' : ''"
			>
				{{ option }}
			</li>
		</ul>
	</div>
</template>

<script setup>
	import ArrowDownIcon from '@assets/icons/pagination/arrow-down.svg'
	import { ref, computed } from 'vue'

	const { options, modelValue, isDropdownOpen } = defineProps({
		options: {
			type: Array,
			required: true,
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
		isDropdownOpen: {
			type: Boolean,
			default: false,
			required: true,
		},
	})

	const emit = defineEmits([
		'update:modelValue',
		'option-selected',
		'toggle-dropdown-visibility',
	])

	const selectedOption = ref(
		options.find((option) => option.value === modelValue)
	)

	function toggleDropdown() {
		emit('toggle-dropdown-visibility', !isDropdownOpen.value)
	}

	function selectOption(option) {
		selectedOption.value = option
		emit('update:modelValue', option)
		emit('option-selected', option)
		emit('toggle-dropdown-visibility', false)
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
