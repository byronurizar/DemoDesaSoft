module.exports = app => {
    const bitacora = app.db.models.bitacoraPeticion;
    const historialError = app.db.models.historialError;
    const hsConversacion = app.db.models.hsConversacion;

    const hsIntento = app.db.models.hsIntento;
    const hsEntidad = app.db.models.hsEntidad;
    
    var watson = require('watson-developer-cloud');
    const AssistantV1 = require('watson-developer-cloud/assistant/v1');
    const bodyParser = require('body-parser');

    //Asignación de variables
    let apiKeyIBM = "INlT_Nir_z6_7hcir0-dHvf2djgsABTcBFmZIx4uVthd";
    // let versionApi = "2018-09-20";
    let versionApi = "2018-07-10";
    let urlApi = "https://gateway.watsonplatform.net/assistant/api";
    // let workspace_idApi = "18477be7-1d01-4492-9bce-8419b8623458";
    let workspace_idApi = "8db43e6f-0f48-412a-90da-12534aa88656";
    

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
    let codigoConversacion = 0;
    var assistant = new watson.AssistantV1({
        iam_apikey: apiKeyIBM,
        version: versionApi,
        url: urlApi
    });

    app.post('/chatBotDemo/', (req, res) => {
        consumirServicio(req, res);
    });

    function consumirServicio(req, res) {
        hsConversacion.create({
            conversacionId: null, workSpaceId: workspace_idApi, origenPeticion: _origenPeticion
        })
            .then(function (result) {
                codigoConversacion = result.id;

                console.log('Código de Conversacion ' + codigoConversacion);
                const { text, context = { conversation_id: '0c32623a-a042-48bb-9216-3d4e65bafbb7', codigoConversacion: codigoConversacion,monto_solicitado_2:45000} } = req.body;
                jsonSolicitud = req.body;
               
                const params = {
                    input: { text },
                    workspace_id: workspace_idApi,
                    context,
                };
                console.log("Solicitud");
                console.log(params);

                return assistant.message(params, (err, response) => {
                    jsonRespuesta = response;
                    idConversacion = jsonRespuesta.context.conversation_id;
                    _fechaFin = new Date();
console.log("Respuesta Api");
console.log(response);
                    if (escribirBitacoraPeticiones) {
                        let mensajeBitacora = { codigoEmpresa: _codigoEmpresa, jsonSolicitud: JSON.stringify(jsonSolicitud), jsonRespuesta: JSON.stringify(jsonRespuesta), conversacionID: idConversacion, fechaInicio: _fechaInicio, fechaFin: _fechaFin, origenPeticion: _origenPeticion }
                        escrbirBitacoraPeticion(mensajeBitacora);
                    }

                    if (err) {
                        _mensajeError += error;
                        console.error(err);
                        res.status(500).json(err);
                        console.log(response);
                    } else {
                        hsConversacion.update({ conversacionId: idConversacion }, { where: { id: codigoConversacion } })
                            .then(result => { console.log('Actualización correcta') })
                            .catch(error => { console.log('Ocurrió un error al intentar actualizar') });
                            registrarInteno(response);
                        res.json(response);
                    }
                });
            })
            .catch(function (errores) {
                res.send('En un momento lo atenderemos');
                _mensajeError += errores;
                escribirErrores();
            })
    }

    async function escrbirBitacoraPeticion(jsonPeticion) {
        await bitacora.create(jsonPeticion)
            .then(result => {
                console.log('Se inserto en bitacora correctamente');
            })
            .catch(error => {
                nombreFuncion = "escrbirBitacoraPeticion";
                _mensajeError += error;
                escribirErrores();
                console.log('Ocurrió un error al intentar registrar la petición');
            });
    }
    async function escribirErrores() {
        await historialError.create({ codigoEmpresa: _codigoEmpresa, mensajeError: _mensajeError, origenPeticion: _origenPeticion })
            .then(result => {
                console.log('Se inserto en bitacora de errores correctamente')
            })
            .catch(error => {
                console.log('No se logro registrar el error' + error);
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