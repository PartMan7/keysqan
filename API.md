# API Documentation

## v1

All API responses are either `{ success: true, data: Any }` or `{ success: false, data: Any, error: Error }`. The responses given below are contained in `res.data`.<br/>
<br/>
POST `/login` `{ email: String }` -> `null`<br/>
POST `/otp` `{ otp: String | Number, email: String }` -> `String` (token)<br/>
<br/>
(Note that all API endpoints after this line require the x-auth-token header)<br/>
<br/>
GET `/logout` -> `null`<br/>
<br/>
GET `/api/key/:keyId` -> `Key`<br/>
GET `/api/user/:userId` -> `User`<br/>
GET `/api/exchange/:keyId`<br/>
	-> `[String (warnings)]` if req.user 'borrows' key<br/>
	-> `null` if req.user 'returns' key<br/>
	-> `User` (key.with) if erroring due to key with some other person<br/>
GET `/api/transfer/:keyId/:giverId` -> `null`
