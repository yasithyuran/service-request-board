const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const JobRequest = require('../models/JobRequest');
const { protect } = require('../middleware/auth');

// GET /api/jobs - list all jobs (public)
router.get('/', async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const jobs = await JobRequest.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/:id - fetch single job (public)
router.get('/:id', 
  param('id').isMongoId().withMessage('Invalid job ID'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const job = await JobRequest.findById(req.params.id).populate('owner', 'name email');
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/jobs - create new job (PROTECTED - login required)
router.post('/', protect, [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 1000 }),
  body('category').isIn(['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other']),
  body('location').notEmpty().withMessage('Location is required'),
  body('contactName').notEmpty().withMessage('Contact name is required'),
  body('contactEmail').isEmail().withMessage('Valid email is required'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const job = new JobRequest({
      ...req.body,
      owner: req.user._id
    });
    await job.save();
    
    const populatedJob = await JobRequest.findById(job._id).populate('owner', 'name email');
    res.status(201).json(populatedJob);
  } catch (error) {
    next(error);
  }
});

// PUT /api/jobs/:id - update entire job (OWNER ONLY)
router.put('/:id', protect,
  param('id').isMongoId(),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').isIn(['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other']),
    body('location').notEmpty().withMessage('Location is required'),
    body('contactName').notEmpty().withMessage('Contact name is required'),
    body('contactEmail').isEmail().withMessage('Valid email is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const job = await JobRequest.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      // STRICT OWNERSHIP CHECK
      console.log('Job owner:', job.owner.toString());
      console.log('Current user:', req.user._id.toString());
      
      if (job.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Access denied. You can only edit your own jobs.',
          yourId: req.user._id,
          ownerId: job.owner
        });
      }
      
      // Update job
      const updatedJob = await JobRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('owner', 'name email');
      
      res.json(updatedJob);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/jobs/:id - update status (OWNER ONLY)
router.patch('/:id', protect,
  param('id').isMongoId(),
  body('status').isIn(['Open', 'In Progress', 'Closed']).withMessage('Invalid status'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const job = await JobRequest.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      // STRICT OWNERSHIP CHECK
      if (job.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Access denied. You can only update your own jobs.'
        });
      }
      
      job.status = req.body.status;
      await job.save();
      
      const populatedJob = await JobRequest.findById(job._id).populate('owner', 'name email');
      res.json(populatedJob);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/jobs/:id - delete job (OWNER ONLY)
router.delete('/:id', protect,
  param('id').isMongoId(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const job = await JobRequest.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      // STRICT OWNERSHIP CHECK
      if (job.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Access denied. You can only delete your own jobs.'
        });
      }
      
      await JobRequest.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;