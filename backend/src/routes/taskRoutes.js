const router = require('express').Router();
const { body } = require('express-validator');
const { getTasks, getTaskById, createTask, updateTask, deleteTask, addComment } = require('../controllers/taskController');
const { authenticate, authorize, checkPasswordReset } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate, checkPasswordReset);

router.get('/', getTasks);
router.get('/:id', getTaskById);

router.post('/',
  authorize('Admin', 'Project Manager'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('status').optional().isIn(['To Do', 'In Progress', 'Completed']).withMessage('Invalid status'),
    body('dueDate').optional().custom((value) => {
      if (value) {
        const due = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (due < today) {
          throw new Error('Due date cannot be in the past');
        }
      }
      return true;
    }),
    validate,
  ],
  createTask
);

router.put('/:id', updateTask);

router.delete('/:id', authorize('Admin', 'Project Manager'), deleteTask);

router.post('/:id/comments',
  [
    body('content').notEmpty().withMessage('Comment content required'),
    validate,
  ],
  addComment
);

module.exports = router;
