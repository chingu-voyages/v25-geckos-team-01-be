# v25-geckos-team-01-be

Chingu Voyage 25 Geckos 01 Backend repo

## Routes

The test worthy routes

### Authentication Routes

#### Login

Endpoint: "/auth/" <br>
Method: POST <br>
Body: email, password <br>
Return:<br>

```
{
    "data": {
        "name": "john jake",
        "email": "j@j.com",
        "role": "volunteer",
        "tags": [],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjBhYTkzZjQzN2QwMDQzY2M5OTYxNiIsIm5hbWUiOiJqb2huIGpha2UiLCJpYXQiOjE2MDU2NTQ3MjgsImV4cCI6MTYwNTY5MDcyOH0.qTKM5cNPGVbXVBLLm9AfvxycyHqOAQOoMcIRITKmEs0" }
}
```

After logging in save the token on the client side.

#### Register

Endpoint: "/auth/register/" <br>
Method: POST <br>
Body: name(U), email(U), phoneNumber(O), role("organization", "volunteer")(R), description(O), tags(O), password(R)
Return: <br>

```
{
    "data": {
        "name": "john jake4",
        "email": "jj4@jj.com",
        "role": "volunteer",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjQ1ZDZmYTU1M2Y5MGFiY2VhNTNmYiIsIm5hbWUiOiJqb2huIGpha2U0IiwiaWF0IjoxNjA1NjU1OTE5LCJleHAiOjE2MDU2OTE5MTl9.g9mGjQDMEdlSgS-7_u27IRJG-xrNfDLxUsq47sv_jwU"
    }
}
```

(U) needs to be unique
(R) is required
After registering save the token to become signed in.

### Account Routes

#### Load Account Info

Endpoint: "/account/" <br>
Method: GET <br>
Header: `{"authorization": Bearer <token> }`
Return:

```
{
    "data": {
        "name": "john jake4",
        "email": "jj4@jj.com",
        "role": "volunteer",
        "tags": [],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjQ1ZDZmYTU1M2Y5MGFiY2VhNTNmYiIsIm5hbWUiOiJqb2huIGpha2U0IiwiaWF0IjoxNjA1NjU2NTg1LCJleHAiOjE2MDU2OTI1ODV9.pM66zw0UEiD9w5XVFMheVthy1UUhbepZ7sQXqNgpz24"
    }
}
```

#### Update Account Info
Endpoint: "/account/" <br>
Method: PUT <br>
Header: `{"authorization": Bearer <token> }`
Return: 
``` 

```
Disclaimer you cannot update the password or role through this route. 

#### Delete Account
Endpoint: "/account/" <br>
Method: DELETE <br>
Header: `{"authorization": Bearer <token> }`
Return: `This user was successfully deleted`

The client side must delete wherever they are storing the json web token