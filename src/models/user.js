const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error("Age must be a positive number")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Password cannot contain password");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// campo "virtual", feito para criar relação entre duas models
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
});

// methods = pertencentes a instancia

//When a Mongoose document is passed to res.send, Mongoose converts the object into JSON, You can customize
// quando manda um objeto como resposta express faz JSON.stringify()
// se nomear método como toJSON ele será chamado toda vez que JSON.stringify() for chamado naquele objeto
userSchema.methods.toJSON = function(){
    const user = this;
    //toObject = retira metainformações e métodos do objeto
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

// statics = pertencentes ao modelo/schema
// cria função no schema
userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({ email });

    if(!user){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to login");
    }

    return user;
}

// Hash the plain text password before saving
//userSchema.post = depois de um evento, .pre = antes de um evento (ex: salvar, validar)
userSchema.pre("save", async function(next){
    //não uso arrow function devido ao escopo
    //this = documento que vai ser salvo
    const user = this;
    
    if(user.isModified("password")){ 
        user.password = await bcrypt.hash(user.password, 8);
    };

    next();
});

// Delete user tasks when user is removed
userSchema.pre("remove", async function(next){
    const user = this;
    await Task.deleteMany({ owner: user._id });

    next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;