module.exports = function(Rate) {
  Rate.add = function(request, reqObject, cb) {
    var app = Rate.app;

    var apiToken = reqObject.headers['x-application-token'];

    var Bank = app.models.Bank,
      Office = app.models.Office,
      Currency = app.models.Currency,
      Token = app.models.Token;

    if (!request || !request.data) {
      cb(null, {success: false, error: 'Request body can\'t be empty'});
      return;
    }

    var responded = false,
      isError = false,
      errorMessage = '';

    Token.check(apiToken, function(tokenMatch) {
      if (!tokenMatch) {
        cb(null, {success: false, message: 'You provided wrong application token'});
        responded = true;
      } else {
        request.data.forEach(function(item) {

          Bank.findOrCreate({name: item.bank_name, phone: '0'}, {name: item.bank_name, phone: '0'}, function(error, bank) {
            if (!error) {
              Office.findOrCreate({address: item.office_address, name: item.office_name, bankId: bank.id}, {address: item.office_address, name: item.office_name, bankId: bank.id}, function(error, office) {
                if (!error) {
                  Currency.findOrCreate({name: item.type}, {name: item.type}, function(error, currency) {
                    if (!error) {
                      var today = new Date();
                      Rate.findOrCreate({
                        date: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
                        currencyId: currency.id,
                        officeId: office.id,
                        value_sell: item.sell,
                        value_buy: item.buy
                      }, function(error, rate) {
                          if (!error) {
                            //...
                          } else {
                            isError = true;
                            errorMessage = error;
                          }
                      })
                    } else {
                      isError = true;
                      errorMessage = error;
                    }
                  });
                } else {
                  isError = true;
                  errorMessage = error;
                }
              });
            } else {
              isError = true;
              errorMessage = error;
            }
          });
        });
      }
    });

    setTimeout(function() {
      if (!responded) {
        if (!isError) {
          cb(null, {success: true});
        } else {
          cb(null, {success: false, message: errorMessage});
        }
        responded = true;
      }
    }, 3000);
  };

  // POST add request handler
  Rate.remoteMethod('add', {
    accepts: [
      {
        arg: 'request',
        type: 'object',
        required: true,
        http: {
          source: 'body'
        }
      },
      {
        arg: 'reqObject',
        type: 'object',
        required: 'true',
        http: {
          source: 'req'
        }
      }
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path: '/', verb: 'post'}
  });
};
