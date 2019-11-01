const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { 
    userOneId, 
    userOne, 
    userTwoId, 
    userTwo, 
    taskOne, 
    setupDatabase 
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should creat task for user", async ()=>{
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "From my test"
        })
        .expect(201);
    const task = await Task.findOne({_id: response.body._id});
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test("Should fetch user tasks", async ()=>{
    const result = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(result.body.length).toBe(2);
});

test("Should not delete other users tasks", async ()=>{
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);
    
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});