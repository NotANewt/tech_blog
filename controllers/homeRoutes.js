const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET route to get all blogs and join with user and coment data
router.get('/', async (req, res) => {
  try {
    // Get all blogs and JOIN with user and comment data
    const blogData = await Blog.findAll({
      include: [User, Comment],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route to get data for an individual blog with withAuth middleware to prevent access to blog/:id route if not logged in
router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [User],
        },
        {
          model: User,
        },
      ],
      order: [[Comment, 'date_created', 'desc']],
    });

    const blog = blogData.get({ plain: true });

    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in,
      is_author: req.session.user_id == blog.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route to return all blogs written by the user with withAuth middleware to prevent access to dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route for create blog post
router.get('/dashboard/blog', withAuth, async (req, res) => {
  res.render('editblog', {
    logged_in: true,
  });
});

// GET route to edit a blog post
router.get('/dashboard/blog/:id', withAuth, async (req, res) => {
  if (!req.params.id) {
    res.render('editblog');
  }
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [User],
        },
        {
          model: User,
        },
      ],
      order: [[Comment, 'date_created', 'desc']],
    });

    const blog = blogData.get({ plain: true });

    res.render('editblog', {
      ...blog,
      logged_in: req.session.logged_in,
      is_author: req.session.user_id == blog.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET to check user is logged in, sends them to the dashboard if they are or sends them to the login page
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  // if not logged in, send them to the login page
  res.render('login');
});

module.exports = router;
