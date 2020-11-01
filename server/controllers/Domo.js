const models = require('../models');

const {
  Domo,
} = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occurred!',
      });
    }

    return res.render('app', {
      csrfToken: req.csrfToken(),
      domos: docs,
    });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.height) {
    return res.status(400).json({
      error: 'Name, age, and height are required!',
    });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({
    redirect: '/maker',
  }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Domo already exists.',
      });
    }

    return res.status(400).json({
      error: 'An error occured',
    });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occurred',
      });
    }

    return res.json({
      domos: docs,
    });
  });
};

const getAllDomos = (request, response) => {
  const res = response;

  return Domo.DomoModel.find({}, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: 'An error occured',
      });
    }

    return res.json({
      domos: docs,
    });
  }).lean();
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.getAllDomos = getAllDomos;
module.exports.make = makeDomo;