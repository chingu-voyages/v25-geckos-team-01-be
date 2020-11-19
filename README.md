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
        "name": "test dummy",
        "slug": "test-dummy",
        "email": "test@dummy.com",
        "phoneNumber": "223123123123123123123213213",
        "role": "volunteer",
        "description": "test dummy",
        "tags": [
            "smat, intuligent, bave, "
        ],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjViMGVlNTA5MWQwMTQ4Y2YxZDdmYyIsIm5hbWUiOiJ0ZXN0IGR1bW15IiwiaWF0IjoxNjA1NzQyODMwLCJleHAiOjE2MDU3Nzg4MzB9.4hI4lC05BkbOE7OkhyFjH4gRHGCBXcUrAlqrusQTc6k"
    }
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
        "name": "test dummy",
        "slug": "test-dummy",
        "email": "test@dummy.com",
        "phoneNumber": "223123123123123123123213213",
        "role": "volunteer",
        "description": "test dummy",
        "tags": [
            "smat, intuligent, bave, "
        ],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjViMGVlNTA5MWQwMTQ4Y2YxZDdmYyIsIm5hbWUiOiJ0ZXN0IGR1bW15IiwiaWF0IjoxNjA1NzQyODMwLCJleHAiOjE2MDU3Nzg4MzB9.4hI4lC05BkbOE7OkhyFjH4gRHGCBXcUrAlqrusQTc6k"
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
        "name": "test dummy",
        "slug": "test-dummy",
        "email": "test@dummy.com",
        "phoneNumber": "223123123123123123123213213",
        "role": "volunteer",
        "description": "test dummy",
        "tags": [
            "smat, intuligent, bave, "
        ],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjViMGVlNTA5MWQwMTQ4Y2YxZDdmYyIsIm5hbWUiOiJ0ZXN0IGR1bW15IiwiaWF0IjoxNjA1NzQyODMwLCJleHAiOjE2MDU3Nzg4MzB9.4hI4lC05BkbOE7OkhyFjH4gRHGCBXcUrAlqrusQTc6k"
    }
}
```

#### Update Account Info

Endpoint: "/account/" <br>
Method: PUT <br>
Header: `{"authorization": Bearer <token> }`
Body: name(U), email(U), phoneNumber(O), description(O), tags(O) <br>
Return:

```
{
    "data": {
        "name": "test dummer",
        "slug": "test-dummy",
        "email": "test@dummer.com",
        "phoneNumber": "223123123123123123123213213",
        "role": "volunteer",
        "description": "test dummer described ",
        "tags": [
            "smurt, unitllgent, breve"
        ],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjViMGVlNTA5MWQwMTQ4Y2YxZDdmYyIsIm5hbWUiOiJ0ZXN0IGR1bW1lciIsImlhdCI6MTYwNTc0MzA4MiwiZXhwIjoxNjA1Nzc5MDgyfQ.VFiz9YeaI__6gh3Q59kLNfMeXCTLP4Dhyxy748P_zoI"
    }
}
```

Disclaimer you cannot update the password or role through this route.

#### Delete Account

Endpoint: "/account/" <br>
Method: DELETE <br>
Header: `{"authorization": Bearer <token> }`
Return:

```
{
    "data": "User has been deleted"
}
```

The client side must delete wherever they are storing the json web token
