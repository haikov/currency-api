var disableAllRestMethods = require('./../../helpers/disableAllRestMethods');

module.exports = function(Office) {
  disableAllRestMethods(Office,
    ['find', 'findById', 'findOne', '__get__rates',
      '__findById__bank', '__get__bank']);
};
