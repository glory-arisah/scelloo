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
			v-show="isOpen"
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

	const props = defineProps({
		options: {
			type: Array,
			required: true,
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
	})

	const emit = defineEmits(['update:modelValue', 'option-selected'])

	const isOpen = ref(false)
	const selectedOption = ref(
		props.options.find((option) => option.value === props.value)
	)

	function toggleDropdown() {
		isOpen.value = !isOpen.value
	}

	function selectOption(option) {
		selectedOption.value = option
		emit('update:modelValue', option)
		emit('option-selected', option)
		isOpen.value = false
	}
</script>

<style lang="scss" scoped>
	.custom-dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown_header {
		display: flex;
		border: none;
		outline: none;
		align-items: center;
		width: fit-content;
		border-radius: 4px;
		cursor: pointer;
		background-color: transparent;
	}

	.dropdown-list {
		position: absolute;
		top: 100%;
		left: -100%;
		right: 0;
		border: 1px solid #ccc;
		border-top: none;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
		max-height: 200px;
		overflow-y: auto;
		z-index: 1000;
		width: 65px;
	}

	.dropdown-list li {
		padding: 10px;
		cursor: pointer;
	}

	.dropdown-list li:hover,
	.current_selection {
		background-color: #f0f0f0;
	}
</style>
