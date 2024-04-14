const mongoose = require("mongoose")

const columnModel = require('./column.model');

exports.createColumn = (req, res, next) => {
    let boardId = req.body.boardId;
    let title = req.body.title;
    let tasks = req.body.tasks;

    const column = new columnModel({
      title,
      boardId,
      tasks,
    });
  
    column.save().then(
      (result) => {
        res.send({
          status: 200,
          message: "Created column with success!",
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
  

  
exports.getColumnsByBoardId = (req, res, next) => {
    const boardId = req.body.boardId;

    columnModel.find({ boardId: boardId }).then(
        (results) => {
            res.send({
                status: 200,
                message: "All columns from database",
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
  };

  
  exports.getColumnById = async (req, res, next) => {
    let columnId = req.params.id;
      await columnModel.findOne({ _id: columnId })
      .then(
        (result) => {
          if (result) {
            res.send({
              status: 200,
              message: "Get column with success!",
              data: result,
            });
          } else {
            res.send({
              status: 404,
              message: "Column not found!",
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
  };

  exports.updateColumn = async (req, res, next) => {
    try {
      let tasks = req.body.taskIds;
      let _id = req.params.id;
  
      console.log(tasks);
  
      let updateQuery;
      if (Array.isArray(tasks)) {
        // If tasks is an array, set the tasks directly
        updateQuery = { $set: { tasks: tasks } };
      } else if (typeof tasks === 'string') {
        // If tasks is a single task ID string, push it to the existing tasks
        updateQuery = { $push: { tasks: tasks } };
      } else {
        return res.status(400).json({
          message: "Invalid task format. TaskIds must be either an array of taskIds or a single taskId string.",
        });
      }
  
      let newColumn = await columnModel.findOneAndUpdate(
        { _id },
        updateQuery,
        { new: true }
      );
  
      if (!newColumn) {
        return res.status(404).json({
          message: "Column not found",
        });
      }
  
      res.status(200).json({
        message: "Updated column with success!",
        data: newColumn,
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong!",
        error: error.message,
      });
    }
  };
  