module.exports = (sequelize, DataType) => {
    const hsIntento = sequelize.define('hsIntento', {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        conversacionId: {
            type: DataType.TEXT,
            allowNull: true
        },
        nombreIntento: {
            type: DataType.TEXT,
            allowNull: true
        },
        confianza: {
            type: DataType.DOUBLE(18, 12),
            allowNull: false,
            defaultValue:0
        },
        mensajeUsuario: {
            type: DataType.TEXT,
            allowNull: true
        },
        mensajeBot: {
            type: DataType.TEXT,
            allowNull: true
        },
        tipoMensaje: {
            type: DataType.TEXT,
            allowNull: true
        }
    });
    return hsIntento;
};