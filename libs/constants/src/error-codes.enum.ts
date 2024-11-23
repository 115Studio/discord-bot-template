export enum ErrorCodes {
  UnknownError,
  InternalServerError, // 500
  RateLimited,
  NotFound, // generic not found
  Forbidden,
  BadRequest,
  Unauthorized,
  ThirdPartyFail, // discord/other api error
  UnknownUser, // user not found
}
