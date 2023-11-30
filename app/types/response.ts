export type ErrorResponse = {
  message: string;
};
export type CustomResponse<T = object> = {
  message: string;
} & T;

export type DataResponse<T> = {
  message: string;
  data: T;
};
