
const redirLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) res.redirect('/profile');
    else next();
};

const requiresLogin = (req, res, next) => {
    if (req.session && req.session.userId) next()
    else {
        let error = new Error ('You must be logged in to view this page.');
        error.status = 401;
        next(error);
    }
};

module.exports.redirLoggedIn = redirLoggedIn;
module.exports.requiresLogin = requiresLogin;