var disableAllRestMethods = require('./../../helpers/disableAllRestMethods');

module.exports = function(Currency) {
  disableAllRestMethods(Currency, ['find', 'findById', 'findOne', '__get__rates']);
};
