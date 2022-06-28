import { getNumericEnumValues, getStringEnumValues } from '@helpers/enums'

enum TestStringEnum {
  foo = 'bar',
}

enum TestNumericEnum {
  foo,
}

describe('Enum helpers', () => {
  it('retrieves string enum values', () => {
    const keys = getStringEnumValues(TestStringEnum)
    expect(keys).toEqual(['bar'])
  })

  it('retrieves numeric enum values', () => {
    const keys = getNumericEnumValues(TestNumericEnum)
    expect(keys).toEqual([0])
  })
})
