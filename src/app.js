const express = require("express");
require("./db/mongoose"); //só faço arquivo ser executado
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
//const port = process.env.PORT;

//traduz automaticamento dados recebidos como JSON para objeto
app.use(express.json());
//pega rotas de outro arquivo
app.use(userRouter);
app.use(taskRouter);

module.exports = app;