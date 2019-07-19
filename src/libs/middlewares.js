// import express from 'express';
var express=require('express');
module.exports=app=>{
    //Configuraciones
    app.set('port',process.env.PORT || 3000);

    //middlewares -- lo que se ejecuta antes de procesar datos
     app.use(express.json());
};