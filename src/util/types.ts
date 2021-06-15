type Narrowable = string | number | boolean | symbol | void | null | undefined;

export const tuple = <T extends Narrowable[]>(...args: T) => args;
