const getStringEnumValues = (enumType: object) => {
  return Object.keys(enumType)
    .map((key) => enumType[key as unknown as keyof typeof enumType])
    .filter((value) => typeof value === 'string') as string[]
}

const getNumericEnumValues = (enumType: object) => {
  return Object.keys(enumType)
    .map((key) => enumType[key as unknown as keyof typeof enumType])
    .filter((value) => typeof value === 'number') as string[]
}

export { getStringEnumValues, getNumericEnumValues }
