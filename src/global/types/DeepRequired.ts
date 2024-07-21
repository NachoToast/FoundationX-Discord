export type DeepRequired<T> = T extends
    | undefined
    | null
    | boolean
    | string
    | number
    ? T
    : {
          [K in keyof T]-?: DeepRequired<T[K]>;
      };
