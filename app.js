const express = require('express');
const multer = require('multer');
const bp = require('body-parser');
const { engine } = require('express-handlebars');
const { Sequelize, STRING, AggregateError } = require('sequelize');
const Reserva = require('./models/reserva');
const app = express();


app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(express.static('./public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/reservar', (req, res) => {
    res.render('reservar');
});

app.get('/sobre', (req, res) => {
    res.render('sobre');
});

app.get('/editar', (req, res) => {
    res.render('editar');
});

app.get('/deletar', (req, res) => {
    res.render('deletar');
});

app.post('/reservar', function (req, res) {
    Reserva.create({
        nome: req.body.nome,
        data: req.body.data,
        hora: req.body.hora
    }).then(reserva => {
        console.log('Reserva criada.');
    }).catch(err => {
        res.render('reservar', { erro: 'Error ao criar reserva:' + err });
    });
});

app.post('/editar/:id', (req, res) => {
    const id = req.body.id;
    
    const update = {
        nome: req.body.nome,
        data: req.body.data,
        hora: req.body.hora
    };

    Reserva.findByPk(id)
        .then(reserva => {
            if (reserva) {
                return reserva.update(update);
            } else {
                throw new Error('Reserva não encontrada');
            }
        })
        .then(() => {
            res.redirect('/admreserva');
        })
        .catch(error => {
            res.send('Erro ao atualizar reserva: ' + error.message);
        });
});

app.get('/admreservas/:id', function (req, res) {
    Reserva.destroy({ where: { id: req.body.id } })
        .then(function () {
            res.redirect('/admreservas');
        }).catch(function (erro) {
            res.send('Erro ao excluir a reserva');
        });
});

app.get('/admreservas', (req, res) => {
    Reserva.findAll()
        .then(reservas => {
            const nome = String(reservas.nome);
            res.render('admreservas', { reservas: reservas });
        })
        .catch(err => {
            res.render('admreservas', { erro: 'Erro ao buscar reservas:' + err });
        });
});

app.get('/admreservas', (req, res) => {
    res.render('admreservas');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(4444, function () {
    console.log("http://localhost:4444");
});