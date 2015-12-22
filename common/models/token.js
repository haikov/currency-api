module.exports = function(Token) {
  /**
   * Checks if the token exist
   * @param token value to check
   * @param callback function that will be called if token found or not. Is found it'll be called with true, if not with false
     */
  Token.check = function(token, callback) {
    Token.find({where: {value: token}}, function(error, result) {
      if (!error) {
        if (result.length > 0) callback(true);
        else callback(false);
      } else {
        callback(false);
      }
    });
  }
};
