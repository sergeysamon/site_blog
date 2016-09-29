module.exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};

module.exports.isNotLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.redirect('/');
};

module.exports.searchInArrObj = function (arr, param) {
    return JSON.stringify(arr).search(param) != -1;
};