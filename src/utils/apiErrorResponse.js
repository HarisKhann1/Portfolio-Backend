class ApiErrorResponse {
    constructor (statusCode, message = "") {
        this.statusCode = statusCode
        this.message = message
        this.success = false
        this.timestamp = new Date().toISOString
    }
}

export default ApiErrorResponse