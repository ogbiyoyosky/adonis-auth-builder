'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    console.log(error)
    if(error.name === 'InvalidJwtToken') {
      return response.status(401).send({
        message:"Please provide a valid token",
        status_code: 401,
        status: 'InvalidToken'
      })
    }

    if(error.name === 'ExpiredJwtToken') {
      return response.status(401).send({
        message:"Expired Access token",
        status_code: 401,
        status: 'Expired JWT'
      })
    }
   
   
   
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
