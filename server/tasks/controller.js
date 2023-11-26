const mongoose = require("mongoose")

const taskModel = require('./task.model')

exports.getAllTasks = async (req, res, next) => {
    taskModel.find().then(
        (results) => {
            res.send({
                status: 200,
                message: "All tasks from database",
                data: results,
              });
        }, 
        (error) => {
            res.send({
                status: 500,
                message: "Something went wrong!",
                data: error,
            });
        })
}

exports.getTaskById = async (req, res, next) => {
    let taskId = req.params.id;
    taskModel.findById(taskId).then(
        (result) => {
            if (result) {
              res.send({
                status: 200,
                message: "Got task with success!",
                data: result,
              });
            } else {
              res.send({
                status: 404,
                message: "Task not found!",
                data: null,
              });
            }
          },
          (error) => {
            res.send({
              status: 500,
              message: "Something went wrong!",
              data: error,
            });
          }
    )
}

exports.addTask = (req, res, next) => {
    let body = req.body;
    const task = new taskModel({
      title: body.title,
      dueDate: body.dueDate,
      description: body.description,
      status: body.status,
      board: body.board
    });
  
    task.save().then(
      (result) => {
        res.send({
          status: 200,
          message: "Added task with success!",
          data: result,
        });
      },
      (error) => {
        res.send({
          status: 500,
          message: "Something went wrong!",
          data: error,
        });
      }
    );
  };
  
  
exports.deleteTask = (req, res, next) => {
    // va lua id-ul ticketului din request
    let taskId = req.params.id;

    taskModel.deleteOne({ _id: taskId }).then(
        () => {
        res.send({
            status: 200,
            message: "Deleted task with success!",
            data: null,
        });
        },
        (error) => {
        res.send({
            status: 500,
            message: "Something went wrong!",
            data: error,
        });
        }
    );
};
  
exports.updateTask = (req, res, next) => {
    let taskId = req.params.id;

    taskModel
        .updateOne(
        { _id: taskId },
        {
            $set: {
            _id: taskId,
            title: body.title,
            dueDate: body.dueDate,
            description: body.description,
            status: body.status,
            board: body.board
            },
        }
        )
        .then(
        async () => {
            let updatedTask = await taskModel.find({ _id: taskId });
            res.send({
            status: 200,
            message: "Updated task with success!",
            data: updatedTask[0],
            });
        },
        (error) => {
            res.send({
            status: 200,
            message: "Something went wrong!",
            data: error,
            });
        }
    );
};
