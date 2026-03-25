// import { ApiError } from "./ApiError";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err); // log full error for debugging

  let customError = err;

  // Transform AxiosError into ApiError
  if (err.isAxiosError) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || err.message || "Axios request failed";
    customError = new ApiError(status, message);
  }

  // Transform other errors (like built-in Error)
  if (!(customError instanceof ApiError)) {
    customError = new ApiError(500, customError.message || "Internal Server Error");
  }


  res.status(customError.statusCode).json({
    success: customError.success,
    message: customError.message,
    data: customError.data,
    errors: customError.errors,
  });
};
