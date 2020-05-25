module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};

/* 

What happens over here is:
 Every route handler that is defined in express will be executed within this function
 The asyncMiddleware function takes a parameter called handler which holds a reference to 
 the entire route handler.
 
 The issue is that, the route handlers are called by express framework, and the req,res
 parameters are passed to the route handler by express. And since we are calling the asyncmiddleware 
 function, we have no way to pass these parameters to the function

 So we treat this function as a factory function, which generates another function, that is an express route
 handler, and then express passes the req,res,next parameters to this function, and from there we pass the
 req,res parameters to the route handler we want to call, and await it's response since it is an async method.

 When something goes wrong then we pass the exception to the next middleware in the request processing pipeline
 and there that exception is handled by express error middleware function.

 So we have a single place where we define try and catch block and execute our code within this function.
 So no need to write try catch block in every route handler.

*/
