/**
 * Game Starter route '/'
 */
exports.index = function(req, res) {
    res.render('layout', {
        env: process.env.NODE_ENV || 'development'
    });
}
