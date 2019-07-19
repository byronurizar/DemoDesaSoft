module.exports = app => {

    //Creación de tablas 
    app.db.sequelize.sync().done(() => {
        //Inicalizar el servidor
        app.listen(app.get('port'), function () {
            console.log('Servidor en el Puerto', app.get('port'));
        });
    });
};