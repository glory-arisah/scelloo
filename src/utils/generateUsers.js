import { faker } from '@faker-js/faker'
import { dayjsWrapper, today } from './date'

const paymentStatuses = ['paid', 'unpaid', 'overdue']
const userActiveStatuses = ['active', 'inactive']

function generateUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()
	const middleName = faker.person.middleName()
	const shouldAddMiddleName = Math.random() > 0.3
	const email = faker.internet.email({
		firstName,
		lastName,
	})
	const amount = faker.number.int({ min: 50, max: 500 })
	const lastLogin = faker.date.between({
		from: today.subtract(1, 'week').toISOString(),
		to: today.toISOString(),
	})
	const paymentStatus =
		paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
	const userStatus =
		userActiveStatuses[Math.floor(Math.random() * userActiveStatuses.length)]
	const dueDate = faker.date.between({
		from: today.add(3, 'day').toISOString(),
		to: today.add(1, 'week').toISOString(),
	})
	const userActivities = Array.from(
		{
			length: Math.ceil(Math.random() * 4),
		},
		() => ({
			date: today.format('DD/MMM/YYYY'),
			activity: faker.lorem.lines(1),
			detail: faker.lorem.lines(1),
		})
	)

	return {
		firstName,
		lastName,
		email,
		amount,
		lastLogin: dayjsWrapper(lastLogin),
		paymentStatus,
		userStatus,
		userActivities,
		dueDate,
		...(shouldAddMiddleName && { middleName }),
	}
}

export function generateUsers(numberOfUsers) {
	return Array.from({ length: numberOfUsers }, generateUser)
}
