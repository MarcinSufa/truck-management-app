import moment, { Moment } from 'moment'

export function calculateTimeLine(start: Moment, end: Moment): string[] {
  const timeSeries: string[] = []

  while (start.isSameOrBefore(end)) {
    timeSeries.push(start.add(15, 'm').format('HH:mm'))
  }
  return timeSeries

}

export function calculateDayTimeLines(start= '00:00:00', end= '23:59:59'): string[] {
  return calculateTimeLine(moment(start, 'HH:mm:ss'), moment( end, 'HH:mm:ss'))
}
