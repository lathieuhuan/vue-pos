export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type RequiredInPartial<T, K extends keyof T> = Omit<Partial<T>, K> & Required<Pick<T, K>>;
