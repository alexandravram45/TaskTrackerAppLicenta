const mongoose = require("mongoose")

const boardModel = require('./board.model');
const User = require("../user/user.model");

exports.createBoard = (req, res, next) => {
  let user = req.body.user.id;
  let name = req.body.name;
  let columns = req.body.columns;
  let color = req.body.color;

  let createdAt = Date.now();
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
              { user: userId }, 
              { members: { $in: [userId] } } 
          ],
          archived: { $ne: true }
      });
      
      res.json(boards);
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
  }
};

exports.getAllArchivedBoards = async (req, res, next) => {
  try {
      const { userId } = req.query;
      if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
      }
      
      const boards = await boardModel.find({
          archived: true
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
    let members = req.body.members;
    let archived = req.body.archived;
    let boardId = req.params.id;

    let newBoard = await boardModel.findOneAndUpdate( 
      { _id: boardId }, 
      { $set : {
        tasks: tasks, 
        columns: columns, 
        members: members, 
        archived: archived
      }}, 
      { new: true }
    );

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
      return res.status(200).json({ message: 'User is already a member of the board' });
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


const columnModel = require('../columns/column.model');

exports.updateBoardAfterTaskDeletion = async (boardId, deletedTaskId) => {
    try {
      console.log(typeof deletedTaskId)
        // Găsește bordul după ID
        const board = await boardModel.findById(boardId);
        
        if (!board) {
            throw new Error('Board not found');
        }
        
        // Elimină taskul șters din array-ul de taskuri al bordului
        board.tasks = board.tasks.filter(task => {
          const taskString = task.toString();
          const deletedTaskString = deletedTaskId.toString();
          console.log(`Comparing task ${taskString} with deleted task ${deletedTaskString}`);
          return taskString !== deletedTaskString;
        });        
        // Actualizează fiecare coloană asociată pentru a elimina taskul șters din array-ul de taskuri al coloanelor
        const columnUpdatePromises = board.columns.map(async columnId => {
            const column = await columnModel.findById(columnId);
            if (column) {
              column.tasks = column.tasks.filter(task => {
                const taskString = task.toString();
                const deletedTaskString = deletedTaskId.toString();
                console.log(`Comparing task ${taskString} with deleted task ${deletedTaskString}`);
                return taskString !== deletedTaskString;
            });
            console.log(board.columns.tasks)
            
            await column.save();
            }
        });
        
        await Promise.all(columnUpdatePromises);
        
        // Salvează bordul actualizat în baza de date
        await board.save();
        
        
        console.log(`Board ${boardId} updated after task deletion`);
    } catch (error) {
        console.error('Error updating board after task deletion:', error);
        throw error; // Aruncă eroarea pentru a fi gestionată în funcția care apelează această metodă
    }
};



exports.updateBoardAfterColumnDeletion = async (boardId, deletedColumnId) => {
  try {
    console.log(typeof deletedColumnId)
      // Găsește bordul după ID
      const board = await boardModel.findById(boardId);
      
      if (!board) {
          throw new Error('Board not found');
      }
      
      board.columns = board.columns.filter(column => {
        const columnString = column.toString();
        const deletedColumnString = deletedColumnId.toString();
        console.log(`Comparing task ${columnString} with deleted column ${deletedColumnString}`);
        return columnString !== deletedColumnString;
      });        
      
      await board.save();
      
      console.log(`Board ${boardId} updated after column deletion`);
  } catch (error) {
      console.error('Error updating board after column deletion:', error);
      throw error; 
  }
};


exports.deleteBoard = (req, res, next) => {
  let boardId = req.params.id;
  boardModel.findOneAndDelete({ _id: boardId }).then(
      (result) => {
        res.send({
            status: 200,
            message: "Deleted board with success!",
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
  )
};

