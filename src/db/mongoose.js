const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://taskapp:taskapp@cluster0-jrbyt.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
});