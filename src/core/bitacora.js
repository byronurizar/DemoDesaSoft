module.exports = app => {
    const bitacora = app.db.models.bitacoraPeticion;
    // const bitacora = require('../models/bitacoraPeticion');
    console.log('Bitacora' + bitacora);
    function escrbirBitacoraPeticion(modelo, _codigoEmpresa, jsonSolicitud, jsonRespuesta, idConversacion, _fechaInicio, _fechaFin, _origenPeticion) {
        const bitacora=modelo;
        let mensaje = 'Error';
        bitacora.create({ codigoEmpresa: _codigoEmpresa, jsonSolicitud: JSON.stringify(jsonSolicitud), jsonRespuesta: JSON.stringify(jsonRespuesta), conversacionID: idConversacion, fechaInicio: _fechaInicio, fechaFin: _fechaFin, origenPeticion: _origenPeticion })
            .then(result => {
                mensaje = 'Se inserto en bitacora correctamente';
            })
            .catch(error => {
                // nombreFuncion = "escrbirBitacoraPeticion";
                // _mensajeError += error;
                // // escribirErrores();
                mensaje = 'Ocurrió un error al intentar registrar la petición';
            });
        return mensaje;
    }
    exports.escrbirBitacoraPeticion = escrbirBitacoraPeticion;
};