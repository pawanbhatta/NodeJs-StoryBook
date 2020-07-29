const passport = require('passport');
const router = require('express-promise-router')();

// @desc    Auth with google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// @desc    Callback with google
// route    GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/dashboard'
}), (req, res) => {
    res.redirect('/dashboard');
});

// @desc    Logout User
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})



module.exports = router;