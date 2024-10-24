/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export type TMakeRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;