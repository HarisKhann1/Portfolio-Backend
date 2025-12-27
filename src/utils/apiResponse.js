class APIResponse {
    constructor(statusCode, data=null, message = "") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}
    
export default APIResponse