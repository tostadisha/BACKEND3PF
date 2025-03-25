import petModel from "./models/Pet.js";

export default class Pet {
  get = (params) => {
    return petModel.find(params);
  };

  getByKey = (key, value) => {
    return petModel.findOne({ [key]: value });
  };

  getBy = (params) => {
    return petModel.findOne({ _id: params });
  };

  save = (doc) => {
    return petModel.create(doc);
  };

  update = (id, doc) => {
    return petModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
  };

  delete = (id) => {
    return petModel.findByIdAndDelete(id);
  };
}
