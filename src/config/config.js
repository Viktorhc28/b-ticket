const { database } = require('../config/keys');
const { Sequelize } = require('sequelize')

// Creating new Object of Sequelize
const sequelize = new Sequelize(
    database.database,
    database.username,
    database.password,
    {
        host: database.host,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            //useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: function (field, next) { // for reading from database
                if (field.type === 'DATETIME' || field.type === 'TIMESTAMP' || field.type === 'DATE') {
                    return field.string();
                    //return field.string() + 'Z';
                }
                return next()
            },
        },
        timezone: (new Date()).getTimezoneOffset() == 180 ? '-03:00' : '-04:00',
        define: {
            freezeTableName: true,
            timestamps: false,
            underscored: true
        },
    }
);

// Exporting the sequelize object. 
// We can use it in another file
// for creating models
module.exports = sequelize