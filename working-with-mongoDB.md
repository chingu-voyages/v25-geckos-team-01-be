# Working With MongoDB


## Mongoose CRUD commands

**Create**
```
Model.insertMany(arrayToInsert, function(error) {
  if (error) {
    console.log(error)
  } else {
    console.log("successful insert");
    mongoose.connection.close();
  }
})
```

**Read**
```
Model.find({fName: "Bob"}, function(err, arr){
   if (err) {
     console.log(err);
   } else {
     console.log(arr);
     mongoose.connection.close();
   }
 });
 ```

**Update**
```
Model.updateMany({queryKey: "queryValue"}, {updateKey: "updateValue"}, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("successful change");
    mongoose.connection.close();
  }
});
```

**Delete**
```
Model.deleteMany({queryKey: "queryValue"}, function(err){
  if (err) console.log(err);
  else {
    console.log("successful delete");
    mongoose.connection.close();
  }
});
```
