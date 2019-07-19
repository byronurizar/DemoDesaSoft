module.exports = app => {
    // const bitacora=require('../core/bitacora');
    const bitacora = app.db.models.bitacoraPeticion;
    const historialError = app.db.models.historialError;
    const hsConversacion = app.db.models.hsConversacion;
    const hsIntento = app.db.models.hsIntento;
    const hsEntidad = app.db.models.hsEntidad;
 // console.log("MODELO HISTORIAL ERROR");
 // console.log(hsConversacion);
    var prueba=require('../core/engine');
    var watson = require('watson-developer-cloud');
    const AssistantV1 = require('watson-developer-cloud/assistant/v1');
    const bodyParser = require('body-parser');

   // console.log(prueba.buscarEntidad('Prueba 123'));
   // console.log(prueba.BuscarIntento('Intento'));

    //Asignación de variables
    let apiKeyIBM = "INlT_Nir_z6_7hcir0-dHvf2djgsABTcBFmZIx4uVthd"; //chat bot banco
    let versionApi = "2018-09-20";
    let urlApi = "https://gateway.watsonplatform.net/assistant/api";
    // let workspace_idApi = "18477be7-1d01-4492-9bce-8419b8623458";
    let workspace_idApi = "8db43e6f-0f48-412a-90da-12534aa88656"; //chat bot banco

    let jsonSolicitud = "";
    let jsonRespuesta = "";
    let idConversacion = "";
    let _codigoEmpresa = 1;
    let _origenPeticion = "PostMan Demo";
    let escribirBitacoraPeticiones = true;
    let _fechaInicio = new Date();
    let _fechaFin;
    let _mensajeError = "";
    let nombreFuncion = "No Registrada";
    var assistant = new watson.AssistantV1({
        iam_apikey: apiKeyIBM,
        version: versionApi,
        url: urlApi
    });

    app.post('/conversacion/', (req, res) => {
        const { text, context = { conversation_id: '5ccba814-8d4d-4f03-908c-269d8f5a105c', codigoConversacion: 588685,monto_solicitado_2:25000 } } = req.body;
        jsonSolicitud = req.body;
        const params = {
            input: { text },
            workspace_id: workspace_idApi,
            context,
        };

        assistant.message(params, (err, response) => {
            jsonRespuesta = response;
            idConversacion = jsonRespuesta.context.conversation_id;
            _fechaFin = new Date();
            if (escribirBitacoraPeticiones) {
                escrbirBitacoraPeticion();
            }
            // registraConversacionUsuario(response);
            registrarConversacion();
            // //Insertar Intento
            registrarInteno(response);

            if (err) {
                _mensajeError += error;
                escribirErrores();
                console.error(err);
                res.status(500).json(err);
                console.log(response);
            } else {
                res.json(response);
            }
        });
    });
    app.route('/Demo')
        .post((req, res) => {
            // let variable = '"valor"';
            // console.log(variable.replace('"', "'").replace('"', "'"));
            // console.log(req.body);
            // bitacora.create(req.body)
            //     .then(result => res.json(result))
            //     .catch(error => {
            //         res.status(412).json({ msg: error.message });
            //     });

            // hsConversacion.create({
            //     conversacionId: idConversacion,
            //     workSpaceId: workspace_idApi,
            //     origenPeticion: _origenPeticion
            // }).then(result => {
            //     console.log('Se inserto en bitacora de errores correctamente')
            // }).catch(error => {
            //     _mensajeError += error;
            //     escribirErrores();
            //     console.log('No se logro registrar el error');
            // });
            var params = {
                workspace_id: workspace_idApi
            };

            assistant.listLogs(params, function (err, response) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(JSON.stringify(response, null, 2));
                }
            });
        })
        .get((req, res) => {
            historialError.findAll({})
                .then(result => res.json(result))
                .catch(error => {
                    res.status(412).json({ msg: error.message });
                });
        });

    function escrbirBitacoraPeticion() {
        bitacora.create({ codigoEmpresa: _codigoEmpresa, jsonSolicitud: JSON.stringify(jsonSolicitud), jsonRespuesta: JSON.stringify(jsonRespuesta), conversacionID: idConversacion, fechaInicio: _fechaInicio, fechaFin: _fechaFin, origenPeticion: _origenPeticion })
            .then(result => {
                console.log('Se inserto en bitacora correctamente')
            })
            .catch(error => {
                nombreFuncion = "escrbirBitacoraPeticion";
                _mensajeError += error;
                escribirErrores();
                console.log('Ocurrió un error al intentar registrar la petición');
            });
    }

    function registrarConversacion() {
        try {
            hsConversacion.create({
                conversacionId: idConversacion, workSpaceId: workspace_idApi, origenPeticion: _origenPeticion
            }).then(result => {
                console.log('Conversación registrada exitosamente')
            }).catch(error => {
                nombreFuncion = "registrarConversacion";
                _mensajeError += error;
                escribirErrores();
                console.log('No se logro registrar el error');
            });
        } catch (error) {
            nombreFuncion = "registrarConversacion General";
            _mensajeError += error;
            escribirErrores();
        }
    }

    function escribirErrores() {
        historialError.create({ codigoEmpresa: _codigoEmpresa, mensajeError: _mensajeError, origenPeticion: _origenPeticion })
            .then(result => {
                console.log('Se inserto en bitacora de errores correctamente')
            })
            .catch(error => {
                console.log('No se logro registrar el error');
            });
    }

    function registrarInteno(jsonInteno) {
        registrarEntidad(jsonInteno);
        try {
            let idChat;
            let nombre;
            let nivelConfianza;
            let mensajeUsuario;
            let mensajeBot;
            let tipoMensaje;
            for (let i = 0; i < jsonInteno.intents.length; i++) {
                idChat = idConversacion;
                mensajeUsuario = jsonInteno.input.text;
                nombre = jsonInteno.intents[i].intent;
                nivelConfianza = jsonInteno.intents[i].confidence;
                for (let a = 0; a < jsonInteno.output.generic.length; a++) {
                    tipoMensaje = jsonInteno.output.generic[a].response_type;
                    mensajeBot = jsonInteno.output.generic[a].text;
                    hsIntento.create({ conversacionId: idChat, nombreIntento: nombre, confianza: nivelConfianza, mensajeUsuario: mensajeUsuario, mensajeBot: mensajeBot, tipoMensaje: tipoMensaje })
                        .then(result => {
                            // console.log('Intento registrado correctamente '+ JSON.stringify(result))
                            console.log('Intento registrado correctamente')
                        })
                        .catch(error => {
                            nombreFuncion = "registrarInteno";
                            _mensajeError += error;
                            escribirErrores();
                            console.log('Ocurrió un error al intentar registrar el intento');
                        });
                }
            }
        } catch (error) {
            nombreFuncion = "registrarInteno General";
            _mensajeError += error;
            escribirErrores();
        }
    }
    function registrarEntidad(jsonBot) {
        try {
            let conversacionId, nombreIntento, nombreEntidad, confianza, respuestaBot, cumplioExpresionLogica;
            conversacionId = idConversacion;
            try {
                nombreIntento = jsonBot.intents[0].intent;
            } catch{
                nombreIntento = "";
            }
            for (let a = 0; a < jsonBot.entities.length; a++) {
                nombreEntidad = jsonBot.entities[a].entity;
                respuestaBot = jsonBot.entities[a].value;
                confianza = jsonBot.entities[a].confidence;
                cumplioExpresionLogica = "N/A";
                hsEntidad.create({ conversacionId: conversacionId, nombreIntento: nombreIntento, nombreEntidad: nombreEntidad, confianza: confianza, respuestaBot: respuestaBot, cumplioExpresionLogica: cumplioExpresionLogica })
                    .then(result => {
                        console.log('Entidad registrada exitosamente')
                    })
                    .catch(error => {
                        nombreFuncion = "registrarEntidad";
                        _mensajeError += error;
                        escribirErrores();
                        console.log('Ocurrió un error al intentar registrar la entidad');
                    });
            }
        } catch (error) {
            nombreFuncion = "registrarEntidad General";
            _mensajeError += error;
            escribirErrores();
        }
    }
};
