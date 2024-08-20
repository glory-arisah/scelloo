import dayjs from 'dayjs'

export const dayjsWrapper = (date, format = 'YYYY-MM-DD') => dayjs(date, format)
export const today = dayjs()
