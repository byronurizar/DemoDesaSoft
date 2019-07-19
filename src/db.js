// import Sequelize from 'sequelize';
// import fs from 'fs'; // modulo definido para leer file sistem
// import path from 'path';
var Sequelize=require('sequelize');
var fs=require('fs');
var path=require('path');
let db = null;

module.exports = app => {

    const config = app.libs.config;
    console.log(config);
    if (!db) {
        const sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config.params
        );

        db = {
            sequelize,
            Sequelize,
            models: {}
        };
        const dir = path.join(__dirname, 'models');
        fs.readdirSync(dir).forEach(filename => {
          const modelDir = path.join(dir, filename);
          const model = sequelize.import(modelDir);
          db.models[model.name] = model;
        });
        // Object.keys(db.models).forEach(key => {
        //   db.models[key].associate(db.models);
        // });
    }
    return db;
};