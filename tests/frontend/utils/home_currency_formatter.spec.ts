import { describe, expect, it } from 'vitest'
import {
  currencySymbol,
  formatBadgeCount,
  formatMajorAmount,
} from '../../../resources/js/utils/home/home_currency_formatter'

const NBSP = ' '

describe('formatMajorAmount', () => {
  it('рендерит эталонное значение Home как «€ 12 000»', () => {
    expect(formatMajorAmount(1_200_000, 'EUR')).toBe(`€${NBSP}12${NBSP}000`)
  })

  it('не группирует значения меньше тысячи', () => {
    expect(formatMajorAmount(99_900, 'EUR')).toBe(`€${NBSP}999`)
  })

  it('показывает копейки только когда они есть', () => {
    expect(formatMajorAmount(123_456, 'EUR')).toBe(`€${NBSP}1${NBSP}234,56`)
    expect(formatMajorAmount(0, 'EUR')).toBe(`€${NBSP}0`)
  })

  it('группирует большие суммы по три разряда', () => {
    expect(formatMajorAmount(123_456_789_00, 'EUR')).toBe(`€${NBSP}123${NBSP}456${NBSP}789`)
  })

  it('использует математический минус для отрицательных значений', () => {
    expect(formatMajorAmount(-150_000, 'EUR')).toBe(`€${NBSP}−1${NBSP}500`)
  })

  it('деградирует до нуля на нечисловом вводе', () => {
    expect(formatMajorAmount(Number.NaN, 'EUR')).toBe(`€${NBSP}0`)
  })

  it('оставляет ISO-код для неизвестной валюты', () => {
    expect(currencySymbol('USD')).toBe('USD')
    expect(formatMajorAmount(100, 'USD')).toBe(`USD${NBSP}1`)
  })
})

describe('formatBadgeCount', () => {
  it.each([
    [0, '0'],
    [-3, '0'],
    [9, '9'],
    [99, '99'],
    [100, '99+'],
    [1500, '99+'],
  ])('форматирует %i как %s', (input, expected) => {
    expect(formatBadgeCount(input)).toBe(expected)
  })

  it('деградирует до нуля на нечисловом вводе', () => {
    expect(formatBadgeCount(Number.POSITIVE_INFINITY)).toBe('0')
  })
})
