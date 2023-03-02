const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data);

const error = (res, err) => responseWithData(res, 500, {
   status: 500,
   message: "Oops! Something wrong!",
   err: err.message
});

const badrequest = (res, message) => responseWithData(res, 400, {
   status: 400,
   message
});

const ok = (res, data) => responseWithData(res, 200, data);

const created = (res, data) => responseWithData(res, 201, data);

const unathorize = (res) => responseWithData(res, 401, {
   status: 401,
   message: "Unathorized"
});

const notfound = (res) => responseWithData(res, 404, {
   status: 404,
   message: "Resource not found"
});

module.exports = {
   error,
   badrequest,
   ok,
   created,
   unathorize,
   notfound
}