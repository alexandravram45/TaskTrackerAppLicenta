const mongoose = require("mongoose")

const commentModel = require('./comment.model');

exports.getCommentById = async (req, res, next) => {
    let commId = req.params.id;
      await commentModel.findOne({ _id: commId })
      .then(
        (result) => {
          if (result) {
            res.send({
              status: 200,
              message: "Get comment with success!",
              data: result,
            });
          } else {
            res.send({
              status: 404,
              message: "Comment not found!",
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


exports.getComments = async (req, res, next) => {
    let taskId = req.params.id;
      await commentModel.find({ taskId: taskId })
      .then(
        (result) => {
          if (result) {
            res.send({
              status: 200,
              message: "Get comment with success!",
              data: result,
            });
          } else {
            res.send({
              status: 404,
              message: "Comment not found!",
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


exports.postComment = (req, res, next) => {
    let content = req.body.content;
    let taskId = req.body.taskId;
    let userId = req.body.userId;
    let createdAt = req.body.createdAt;

    const comment = new commentModel({
      content,
      taskId,
      userId,
      createdAt,
    });
  
    comment.save().then(
      (result) => {
        res.send({
          status: 200,
          message: "Posted comment with success!",
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


  