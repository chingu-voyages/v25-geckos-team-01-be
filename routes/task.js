const express = require("express");
const Task = require("../models/Task");
const { isLoggedIn } = require("../services/authServices");

const router = express.Router();

// GET view Task screen
router.get("/:userName/:taskID", async (req, res) => {
    // search for task ID, task will contain user ID, return task info
    console.log(req.params.userName);
});

// POST to create a new Task
router.post("/add", isLoggedIn, async (req, res) => {
    // from user screen a new task can be created
    // purpose - form input, creates a new task that will be stored according to all input data
    console.log("**************test********", req.user.id)
  try {
    let {
      userName,
      title,
      description,
      skillsRequired,
      location,
      endTask,
      status
    } = req.body;
    let task = new Task();
    task.postedBy = req.user.id; // tried req.user, but user name was not being added to task DB.
    task.title = title;
    task.description = description;
    task.skillsRequired = skillsRequired;
    task.location = location;
    task.endTask = endTask;
    task.status = status;
    await task.save();
    res.status(200).json({data: task});
  } catch (err) {
    console.log(err);
    res.json({message: "An error occured", err}).sendStatus(400);
  }
});

// GET edit Task screen
// router.get("/edit/", isLoggedIn, (req, res) => {
//   // from user screen, select task and make edits, should be able to get req.user - not working at present.
//   let loggedInName;
//   console.log(req.user.id, req.params)
//   User.findOne({_id: req.user.id}, (err, doc) => {
//     if (err) console.log(err);
//     loggedInName = doc.
//   });
//
//   // need to find task based on URI,
//   // verify that appropriate user is logged in
//     if (userName === loggedInName) { //compared to posted by task name
//       // search for task, verify postedBy matches userName and then provide data
//       Task.findOne({_id: taskID}, (err, doc) => {
//         if (err) {
//           console.log(err);
//           mongoose.connection.close();
//         } else {
//           if (doc.postedBy === userName) {
//             console.log("found task", doc)
//             //provide data ??
//             res.status(200).json({data: doc});
//
//             mongoose.connection.close();
//           } else {
//             console.log("User not authorized to edit task");
//             mongoose.connection.close();
//           }
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.json({message: "An error occured", err}).sendStatus(400);
//   }
//
// });


// PUT to edit a Task
router.put("/update", isLoggedIn, async (req, res) => {
  console.log(req.user);
  // data has been updated, saving to task handled Here
  // verify user is logged in and matches userName, then find task and update values
  // req.user should return userID


});

module.exports = router;
