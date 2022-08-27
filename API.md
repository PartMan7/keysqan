# API Documentation

## v1

All API responses are either `{ success: true, data: Any }` or `{ success: false, data: Any, error: Error }`. The responses given below are contained in `res.data`.

POST `/login` `{ email: String }` -> `null`
POST `/otp` `{ otp: String | Number, email: String }` -> `String` (token)

(Note that all API endpoints after this line require the x-auth-token header)

GET `/logout` -> `null`

GET `/api/key/:keyId` -> `Key`
GET `/api/user/:userId` -> `User`
GET `/api/exchange/:keyId`
	-> `[String (warnings)]` if req.user 'borrows' key
	-> `null` if req.user 'returns' key
	-> `User` (key.with) if erroring due to key with some other person
GET `/api/transfer/:keyId/:giverId` -> `null`
