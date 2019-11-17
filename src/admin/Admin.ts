import express from 'express';

const adminRouter = express.Router();

adminRouter.get('/',  (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
  })

export default adminRouter;