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


### Task Routes

#### Add Task

Endpoint: "/task/add/" <br>
Method: POST <br>
Header: `{"authorization" : Bearer <token>}` <br>
Body: title, description, skillsRequired(O), location(O), taskEnd <br>
Return:
```
{
    "data": {
        "id": "5fc2a3b13132f38508b22927",
        "title": "Task",
        "postedBy": "5fc28ae8f3f63b4250aa2c42",
        "description": "task description",
        "skillsRequired": [
            "css, javascript, html"
        ],
        "location": "Wallabey Way Sydney, Australia",
        "taskEnd": "2029-09-29T04:00:00.000Z",
        "interestedIn": []
    }
}
```
The authenticated user must be an organization

#### Edit Task View

Endpoint: "task/edit/:taskId/" <br>
Method: PUT  
Header: `{"authorization" : Bearer <token>}` <br>
Body: title(O), description(O), skillsRequired(O), location(O), taskEnd(O), status(O) <br>
Return:
```
{
    "data": {
        "id": "5fc2a3b13132f38508b22927",
        "title": "New Task",
        "postedBy": "5fc28ae8f3f63b4250aa2c42",
        "description": "task description",
        "skillsRequired": [
            "css, javascript, html"
        ],
        "location": "Wallabey Way Sydney, Australia",
        "taskEnd": "2029-09-29T04:00:00.000Z",
        "status": "open",
        "interestedIn": []
    }
}
```
The authenticated user must be the author of the Task. All updated values are optional, but the skills Required Array is not added onto, but replaced completely.  

#### Anonymous User Task View

Endpoint: "task/:userName/:taskId/"  
Method: GET  
Return:
```
{
    "data": {
        "id": "5fc2a3b13132f38508b22927",
        "title": "New Task",
        "postedBy": "5fc28ae8f3f63b4250aa2c42",
        "description": "task description",
        "skillsRequired": [
            "css, javascript, html"
        ],
        "location": "Wallabey Way Sydney, Australia",
        "taskEnd": "2029-09-29T04:00:00.000Z",
        "status": "open"
    }
}
```
The Interested In Array is not shown.

#### Volunteer - Add Interest

Endpoint: "/task/add-interest/:taskId"  
Method: PUT  
Header: {"authorization" : Bearer <token>}  
Return:
```
{
    "data": {
        "id": "5fc914d6d5fdab442cb06072",
        "title": "Testing Task",
        "postedBy": "5fc914bdd5fdab442cb06071",
        "description": "Et architecto qui occaecati voluptatem illum qui est non. Neque veritatis nulla...",
        "skillsRequired": [
            "html, css, javascript"
        ],
        "location": "Remote",
        "status": "open"
    }
}
```

* Only a volunteer can add interest, and they must be logged in to do so.

#### Volunteer - Remove Interest

Endpoint: "/task/remove-interest/:taskId"  
Method: PUT  
Header: {"authorization" : Bearer <token>}  
Return:
```
{
    "data": {
        "id": "5fc914d6d5fdab442cb06072",
        "title": "Testing Task",
        "postedBy": "5fc914bdd5fdab442cb06071",
        "description": "Et architecto qui occaecati voluptatem illum qui est non. Neque veritatis nulla laboriosam...",
        "skillsRequired": [
            "html, css, javascript"
        ],
        "location": "Remote",
        "status": "open"
    }
}
```

#### Organization - Accept/Decline Interest from Volunteer

Endpoint: "/task/accept-interest/:taskId"  
Method: PUT  
Header: {"authorization" : Bearer <token>}  
Body: acceptedStatus(R)(no / yes), volunteer(R)(use id #)  
Return:
```
{
    "data": {
        "id": "5fc914d6d5fdab442cb06072",
        "title": "Testing Task",
        "postedBy": "5fc914bdd5fdab442cb06071",
        "description": "Et architecto qui occaecati voluptatem illum qui est non. Neque veritatis nulla...",
        "skillsRequired": [
            "html, css, javascript"
        ],
        "location": "Remote",
        "status": "open",
        "interestedIn": [
            {
                "accepted": "no",
                "user": "5fc8079e42bdda256489ff19"
            },
            {
                "accepted": "yes",
                "user": "5fca74ca4132ae20fcdfb362"
            }
        ]
    }
}
```

* (R) is required

#### Delete Task

Endpoint: "task/delete/:taskId/" <br>
Method: DELETE <br>
Header: `{"authorization" : Bearer <token>}` <br>
<br>
Ideally instead of deleting a Task the User would change the status from "open" to "closed"

Heroku
