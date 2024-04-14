const mongoose = require("mongoose")

const boardModel = require('./board.model');
const User = require("../user/user.model");

exports.createBoard = (req, res, next) => {
  let user = req.body.user.id;
  let name = req.body.name;
  let columns = req.body.columns;
  let color = req.body.color;

  let createdAt = new Date();
  let favorite = false;
  let members = [];

  const board = new boardModel({
    user,
    name,
    columns,
    color,
    createdAt,
    favorite,
    members
  });

  board.save().then(
    (result) => {
      res.status(200).json({
        message: "Created board with success!",
        data: result,
      });
    },
    (error) => {
      res.status(500).json({
        message: "Something went wrong!",
        error: error,
      });
    }
  );
};


exports.getBoardById = async (req, res, next) => {
    try {
        const board = await boardModel.findById(req.params.id)
  
        if (!board) {
          return res.status(404).json({ msg: 'Board not found' });
        }
        res.json(board);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}
  
exports.getAllBoards = async (req, res, next) => {
  try {
      const { userId } = req.query;
      if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
      }
      
      const boards = await boardModel.find({
          $or: [
              { user: userId }, // Verifică dacă userId este egal cu user-ul boardului
              { members: { $in: [userId] } } // Verifică dacă userId este inclus în array-ul members
          ]
      });
      
      res.json(boards);
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
  }
};


exports.updateBoard = async (req, res, next) => {
    let tasks = req.body.tasks;
    let columns = req.body.columns;
    let boardId = req.params.id;

    let newBoard = await boardModel.findOneAndUpdate( { _id: boardId }, { $set : {tasks: tasks, columns: columns}}, { new: true });

    newBoard.save().then(
      (result) => {
        res.status(200).json({
          message: "Updated board with success!",
          data: result,
        });
      },
      (error) => {
        res.status(500).json({
          message: "Something went wrong!",
          error: error,
        });
      }
    );
}

exports.updateColumnOrder = async (req, res, next) => {
  let boardId = req.params.id;
  let newColumnOrder = req.body.newColumnOrder;

  const board = await boardModel.findOneAndUpdate( { _id: boardId }, { $set : { columnOrder: newColumnOrder }}, { new: true });

  if (!board) {
    throw new Error('Board not found');
  }

  board.save().then(
    (result) => {
      res.status(200).json({
        message: "Updated board column order with success!",
        data: result,
      });
    },
    (error) => {
      res.status(500).json({
        message: "Something went wrong!",
        error: error,
      });
    }
  );
};

exports.updateBoardName = async (req, res, next) => {
  let newBoardName = req.body.name;
  let boardId = req.params.id;
   
  const board = await boardModel.findOneAndUpdate({ _id: boardId }, { $set : { name: newBoardName }}, { new: true });
  if (!board) {
    throw new Error('Board not found');
  }

  board.save().then(
    (result) => {
      res.status(200).json({
        message: "Updated board name with success!",
        data: result,
      });
    },
    (error) => {
      res.status(500).json({
        message: "Something went wrong!",
        error: error,
      });
    }
  );

}

exports.addToFavorites = async (req, res, next) => {
  let boardId = req.params.id;
  let favorite = req.body.favorite;
   
  const board = await boardModel.findOneAndUpdate({ _id: boardId }, { $set : { favorite: favorite }}, { new: true });
  if (!board) {
    throw new Error('Board not found');
  }

  board.save().then(
    (result) => {
      res.status(200).json({
        message: "Added board to favorite with success!",
        data: result,
      });
    },
    (error) => {
      res.status(500).json({
        message: "Something went wrong!",
        error: error,
      });
    }
  );

}


exports.addMemberToBoard = async (req, res) => {
  try {
    let boardId = req.params.boardId;
    let userId = req.params.userId;

    const board = await boardModel.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of the board' });
    }

    if (userId === board.user.toString()) {
      return res.status(400).json({ message: 'User cannot be added to their own board' });
    }
    
    board.members.push(userId);

    await board.save();

    res.status(200).json({
      message: "Added member to board successfully!",
      data: board,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
}
