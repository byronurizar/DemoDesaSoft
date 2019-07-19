module.exports = (sequelize, DataType) => {
    const hsEntidad = sequelize.define('hsEntidad', {
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
        nombreEntidad: {
            type: DataType.TEXT,
            allowNull: true
        },
        confianza: {
            type: DataType.DOUBLE(18, 12),
            allowNull: false,
            defaultValue:0
        },
        respuestaBot: {
            type: DataType.TEXT,
            allowNull: true
        },
        cumplioExpresionLogica: {
            type: DataType.TEXT,
            allowNull: true
        }
    });
    return hsEntidad;
};