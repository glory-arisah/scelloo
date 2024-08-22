import { faker } from '@faker-js/faker'
import { dayjsWrapper, today } from './date'

const paymentStatuses = ['paid', 'unpaid', 'overdue']
const userActiveStatuses = ['active', 'inactive']

function generateUser() {
	const id = faker.string.uuid()
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()
	const middleName = faker.person.middleName()
	const shouldAddMiddleName = Math.random() > 0.3
	const fullName = `${firstName} ${
		shouldAddMiddleName ? middleName : ''
	} ${lastName}`
	const email = faker.internet.email({
		firstName,
		lastName,
	})
	const amount = faker.number.int({ min: 50, max: 500 })
	const lastLogin = faker.date.between({
		from: today.clone().subtract(1, 'week').toISOString(),
		to: today.clone().toISOString(),
	})
	const paymentStatus =
		paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
	const activeStatus =
		userActiveStatuses[Math.floor(Math.random() * userActiveStatuses.length)]
	const dueDate = faker.date.between({
		from: today.clone().add(3, 'day').toISOString(),
		to: today.clone().add(1, 'week').toISOString(),
	})
	const userActivities = Array.from(
		{
			length: Math.floor(Math.random() * 4),
		},
		() => ({
			date: today.format('DD/MMM/YYYY'),
			activity: faker.lorem.lines(1),
			detail: faker.lorem.lines(1),
		})
	)

	return {
		id,
		firstName,
		lastName,
		fullName,
		email,
		amount,
		lastLogin: dayjsWrapper(lastLogin),
		paymentStatus,
		activeStatus,
		userActivities,
		dueDate: dayjsWrapper(dueDate),
		...(shouldAddMiddleName && { middleName }),
	}
}

export function generateUsers(numberOfUsers) {
	return Array.from({ length: numberOfUsers }, generateUser)
}
