const mongoose = require("mongoose")

const Task = require('./task.model')
const { updateBoardAfterTaskDeletion } = require("../boards/controller")

exports.getAllTasks = async (req, res, next) => {
  Task.find().then(
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

exports.getTasksByColumnId = async (req, res, next) => {
  let columnId = req.params.id
  Task.findOne({ columnId: columnId }).then(
        (results) => {
            res.send({
                status: 200,
                message: "All tasks from database for column " + `${columnId}`,
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
    Task.findOne({ _id: taskId }).then(
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
    let title = req.body.title;
    let columnId = req.body.columnId;

    const task = new Task({
      title,
      columnId
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
    let taskId = req.params.id;

    Task.findOneAndDelete({ _id: taskId }).then(
        async (result) => {
          try {
            const boardId = req.params.boardId;
            await updateBoardAfterTaskDeletion(boardId, taskId);
            res.send({
                status: 200,
                message: "Deleted task with success!",
                data: result,
            });
          } catch (err) {
            console.error(err);
            res.status(500).json({
                status: 500,
                message: "Something went wrong while updating the board!",
                error: err.message,
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
    );
};
  
exports.updateTask = (req, res, next) => {
    let taskId = req.params.id;
    let body = req.body;

    Task
        .updateOne(
        { _id: taskId },
        {
            $set: {
            _id: taskId,
            title: body.title,
            dueDate: body.dueDate,
            description: body.description,
            status: body.status,
            board: body.board,
            assignee: body.assignee,
            points: body.points,
            done: body.done,
            },
        }
        )
        .then(
        async () => {
            let updatedTask = await Task.find({ _id: taskId });
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
