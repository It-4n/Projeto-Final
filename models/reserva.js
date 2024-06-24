const Sequelize = require('sequelize');
const database = require('../db');
const sequelize = require('../db');
const { UPDATE } = require('sequelize/lib/query-types');
const { IGNORE } = require('sequelize/lib/index-hints');

const Reserva = database.define('reservas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data: {
        type: Sequelize.DATE,
        allowNull: false
    },
    hora: {
        type: Sequelize.TIME,
        allowNull: false
    }
});

(async () => {
    await Reserva.sync();
})();

module.exports = Reserva;