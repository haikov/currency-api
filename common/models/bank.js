var disableAllRestMethods = require('./../../helpers/disableAllRestMethods');

module.exports = function(Bank) {
  disableAllRestMethods(Bank, ['find', 'findById', 'findOne', '__get__offices', '__get__rates']);
};
