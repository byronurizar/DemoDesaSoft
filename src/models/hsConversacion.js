module.exports = (sequelize, DataType) => {
    const hsConversacion = sequelize.define('hsConversacion', {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        conversacionId: {
            type: DataType.TEXT,
            allowNull: true
        },
        workSpaceId: {
            type: DataType.TEXT,
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
    return hsConversacion;
};