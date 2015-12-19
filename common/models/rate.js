module.exports = function(Rate) {
  Rate.add = function(request, cb) {
    var app = Rate.app;

    var Bank = app.models.Bank,
      Office = app.models.Office,
      Currency = app.models.Currency;

    var responded = false;

    request.data.forEach(function(item) {
      var bank = new Bank({name: item.bank_name, phone: '0'}),
        office = new Office({address: item.office_address, name: item.office_name, _bank: bank}),
        currency = new Currency({name: item.type});

      var rate = new Rate({
        date: new Date(),
        value_sell: item.sell,
        value_buy: item.buy,
        _currency: currency,
        _office: office
      });

      Bank.find({where: {name: bank.name, phone: bank.phone}}, function (e, result) {
        if (!e) {
          if (result.length > 0) bank.save();
        } else {
          if (!responded) {
            cb(null, {success: false, error: e});
            responded = true;
          }
        }
      });

      Office.find({where: {address: office.address, name: office.name}}, function (e, result) {
        if (!e) {
          if (result.length > 0) office.save();
        } else {
          if (!responded) {
            cb(null, {success: false, error: e});
            responded = true;
          }
        }
      });

      Currency.find({where: {name: currency.name}}, function (e, result) {
        if (!e) {
          if (result.length > 0) currency.save();
        } else {
          if (!responded) {
            cb(null, {success: false, error: e});
            responded = true;
          }
        }
      });

      var start = new Date();
      start.setHours(0,0,0,0);

      var end = new Date();
      end.setHours(23,59,59,999);

      Rate.find({created_on: {$gte: start, $lt: end}, where: {
        '_office.address': office.address,
        '_currency.name': currency.name
      }}, function (e, result) {
        if (!e) {
          if (result.length === 0) rate.save();
        } else {
          if (!responded) {
            cb(null, {success: false, error: e});
            responded = true;
          }
        }
      });
    });

    setTimeout(function() {
      if (!responded) {
        cb(null, {success: true});
        responded = true;
      }
    }, 3000);
  };

  // POST add request handler
  Rate.remoteMethod('add', {
    accepts: {arg: 'request', type: 'object', required: true, http: {source: 'body'}},
    returns: {arg: 'data', type: 'object'},
    http: {path: '/', verb: 'post'}
  });
};
