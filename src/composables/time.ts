import moment, { Moment } from 'moment'

export function calculateTimeLine(start: Moment, end: Moment): string[] {
  const timeSeries: string[] = []

  while (start.isSameOrBefore(end)) {
    timeSeries.push(start.add(15, 'm').format('HH:mm'))
  }
  return timeSeries

}

export function calculateDayTimeLines() {
  return calculateTimeLine(moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss'))
}
