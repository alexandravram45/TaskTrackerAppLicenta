const mongoose = require("mongoose")

const columnModel = require('./column.model');
const { updateBoardAfterColumnDeletion } = require("../boards/controller");

exports.createColumn = (req, res, next) => {
    let boardId = req.body.boardId;
    let title = req.body.title;
    let tasks = req.body.tasks;

    const column = new columnModel({
      title,
      boardId,
      tasks,
      done: false
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
      let done = req.body.done;

      let updateQuery;

      if (typeof done !== 'undefined') {
        updateQuery = { $set: { done: done } };
      }
  
      if (tasks) {
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
  
  
exports.deleteColumn = (req, res, next) => {
  // va lua id-ul ticketului din request
  let columnId = req.params.id;

  columnModel.findOneAndDelete({ _id: columnId }).then(
      async (result) => {
        try {
          const boardId = req.params.boardId; // Presupunând că ai acces la ID-ul bordului asociat taskului
          await updateBoardAfterColumnDeletion(boardId, columnId);
          res.send({
              status: 200,
              message: "Deleted column with success!",
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