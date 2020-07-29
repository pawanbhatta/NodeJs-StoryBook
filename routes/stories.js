const router = require('express-promise-router')();
const {
    ensureAuth
} = require('../middleware/auth');

const Story = require('../models/Story');
const User = require('../models/User');

// @desc  show add page
// @route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

// @desc  Add Story
// @route POST /stories
router.post('/', ensureAuth, async(req, res) => {
    try {
        const story = new Story(req.body);
        story.user = req.user.id;
        await story.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.log('Error', error);
        res.render('error/500');
    }
});

// @desc  show single story
// @route GET /stories/:id
router.get('/:id', ensureAuth, async(req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('user').lean();

        if (!story) return res.render('error/400');

        res.render('stories/show', {
            story
        });

    } catch (error) {
        console.log('Error', error);
        res.render('error/500');
    }
});

// @desc  SHOW ALL STORIES
// @route GETT /stories
router.get('/', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({
            status: 'public'
        }).populate('user').sort({
            createdAt: 'desc'
        }).lean();
        res.render('stories/index', {
            stories,
        });
    } catch (error) {
        console.log('Error', error);
        res.render('error/500');
    }
})


// @desc  Show Edit Page
// @route PUT /stories/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean();

        if (!story) return res.render('error/404');

        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {
                story
            });
        }
    } catch (error) {
        console.log('Error', error);
        res.render('error/500');
    }
});


// @desc  Update Story
// @route PUT /stories/:id
router.put('/:id', ensureAuth, async(req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();

        if (!story) return res.render('error/404');

        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            story = await Story.findOneAndUpdate({
                _id: req.params.id
            }, req.body, {
                new: true,
                runValidators: true
            });
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.log('Error', error);
        res.render('error/500');
    }
});

// @desc  Delete Story
// @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async(req, res) => {
    try {
        const story = await Story.findById(req.params.id);

        if (!story) return res.render('error/400');

        await story.remove();

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
})

// @desc  show user stories
// @route GET /stories/user/:id
router.get('/user/:userId', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        }).populate('user').lean();

        res.render('stories/index', {
            stories
        });
    } catch (error) {
        console.log('Error', error);
        res.render('error/500');
    }
});

module.exports = router;