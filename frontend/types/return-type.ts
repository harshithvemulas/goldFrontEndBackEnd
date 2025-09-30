export interface ReturnType {
  [x: string]: any;
  status: boolean;
  statusCode: number;
  statusText: string;
  message: string;
  data?: any;
  error?: any;
}
