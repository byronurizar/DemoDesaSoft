module.exports = (sequelize, DataType) => {
    const bitacora = sequelize.define('bitacoraPeticion', {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codigoEmpresa: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        jsonSolicitud: {
            type: DataType.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        jsonRespuesta: {
            type: DataType.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        conversacionID: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        fechaInicio: {
            type: DataType.DATE,
            allowNull: true
        },
        fechaFin: {
            type: DataType.DATE,
            allowNull: true
        },
        origenPeticion: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });
    return bitacora;
};