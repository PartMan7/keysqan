# API Documentation


## v0

All API responses are either `{ success: true, data: Any }` or `{ success: false, data: Any, error: Error }`. Note that **requests will fail** if `version` is either absent as a header or if it is outdated. The responses given below are contained in `res.data`.<br/>
<br/>
POST `/login` `{ mobile: String }` -> `null`<br/>
POST `/otp` `{ otp: String, mobile: String }` -> `String` (token)<br/>
<br/>
(Note that all API endpoints after this line require the `x-auth-token` header)<br/>
<br/>
GET `/api/key/:keyId` -> `{ key: Key, with?: User }`<br/>
GET `/api/user/:userId` -> `User`<br/>
GET `/api/exchange/:keyId/:nonce`<br/>
	-> `[String (warnings)]` if req.user 'borrows' key<br/>
	-> `null` if req.user 'returns' key<br/>
	-> `User` (key.with) if erroring due to key with some other person<br/>
GET `/api/transfer/:keyId/:giverId` -> `null`
