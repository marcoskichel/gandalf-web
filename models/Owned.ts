export type Owned<T> = T & { ownerId: string }

export const withOwner = <T>(data: T, ownerId: string): Owned<T> => ({
  ...data,
  ownerId,
})
