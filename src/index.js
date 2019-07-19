'use strict';
// import express from 'express';
// import consign from 'consign';
var express=require('express');
var consign=require('consign');

const app=express();

consign({
    cwd:__dirname
})
.include('libs/config.js') //Ejecuta la configuración de la base de datos
.then('db.js') //Ejecuta la Base de datos que tiene modelos y conexion
.then('libs/middlewares.js') //configurar servidor 
.then('routes')
.then('libs/boot.js') //iniciar toma el modulo de sequelize y crea las tablas
.into(app);