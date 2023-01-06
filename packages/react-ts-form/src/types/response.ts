export type RecursiveErrorType<T extends any> = T extends object
  ?
      | {
          errorMessage?: string;
        } & {
          [key in keyof T]+?: RecursiveErrorType<T[key]>;
        }
  : {
      errorMessage: string;
    };
