class AppError extends Error {
    constructor(public statusCode: number, message: string, stack = "") {
        super(message)

        if (stack) {
            this.stack = stack
        }

        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError;

/* 
Public key - It declares a property named statusCode on the AppError class. The public keyword means this property can be accessed from anywhere:
- Inside the AppError class itself (e.g., this.statusCode).
- From an instance of the class (e.g., myError.statusCode).
- From any other part of your application that has access to an AppError object. */


/*
Here's a step-by-step of what happens when you run new AppError(404, "User not found"):

The AppError constructor is called with statusCode = 404 and message = "User not found".
Inside the constructor, super(message) is called first. This passes "User not found" up to the parent Error class's constructor, which sets the standard error.message property.
Next, this.statusCode = statusCode runs. The public property statusCode on the new object is set to 404.
The if (stack) condition is false, so the else block runs. Error.captureStackTrace(this, this.constructor) creates the .stack property on the error object, which gives you a helpful trace of where the error was created in your code.
The newly created and initialized object is returned.
This gives you a custom, reusable error object that works perfectly for API development, carrying both a human-readable message and a machine-readable HTTP status code. */
