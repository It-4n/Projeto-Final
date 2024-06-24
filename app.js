const express = require('express');
const multer = require('multer');
const bp = require('body-parser');
const { engine } = require('express-handlebars');
const Reserva = require('./models/reserva');
const app = express();


app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(express.static('./public'));

app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
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

app.post('/reservar', (req, res) => {
    Reserva.create({
        nome: req.body.nome,
        data: req.body.data,
        hora: req.body.hora
    }).then(reserva => {
        res.redirect('/reservar');
        res.send('Reserva criada.');
    }).catch(err => {
        res.render('reservar', { erro: 'Error ao criar reserva:' + err });
    });
});

app.get('/admreservas', (req, res) => {
    Reserva.findAll()
        .then(reservas => {
            res.render('admreservas', { reservas: reservas });
        })
        .catch(err => {
            res.render('admreservas', { erro: 'Erro ao buscar reservas:' + err });
        });
});

app.get('/editar/:id', (req, res) => {
    const id = parseInt(req.params.id);

    Reserva.findByPk(id)
        .then(reserva => {
            if (reserva) {
                res.render('editar', { reserva: reserva });
            } else {
                res.send('Reserva não encontrada');
            }
        })
        .catch(error => {
            res.send('Erro ao buscar reserva: ' + error.message);
        });
});

app.post('/editar/:id', (req, res) => {
    const id = parseInt(req.params.id);

    Reserva.update(
        {
            nome: req.body.nome,
            data: req.body.data,
            hora: req.body.hora
        },
        { where: { id: id } }
    )
    .then(linhasAtt => {
        if (linhasAtt > 0) {
            console.log('Registro atualizado com sucesso: ' + linhasAtt + ' linhas afetadas');
            res.redirect('/admreservas');
        } else {
            throw new Error('Reserva não encontrada ou nenhum registro atualizado');
        }
    })
    .catch(error => {
        res.send('Erro ao atualizar reserva: ' + error.message);
    });
});

// app.get('admreservas/:id', (req, res) => {
//     Reserva.destroy({ where: { id: req.body.id } })
//         .then(function () {
//             res.redirect('/admreservas');
//         }).catch(function (erro) {
//             res.send('Erro ao excluir a reserva');
//         });
// });

app.get('/admreservas', (req, res) => {
    res.render('admreservas');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(4444, () => {
    console.log("Servidor rodando em http://localhost:4444");
});