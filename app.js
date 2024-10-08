const express = require('express');
const multer = require('multer');
const bp = require('body-parser');
const { engine } = require('express-handlebars');
const Reserva = require('./models/reserva');
const Usuario = require('./models/usuario');
const app = express();

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(express.static('./public'));

app.set('view engine', 'handlebars');
app.set('views', './views');
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/reservar', (req, res) => {
    res.render('reservar');
});

app.post('/reservar', (req, res) => {
    Reserva.create({
        nome: req.body.nome,
        data: req.body.data,
        hora: req.body.hora
    }).then(reservas => {
        res.redirect('/admreservas');
    }).catch(err => {
        res.render('admreservas', { erro: 'Error ao criar reserva:' + err });
    });
});

app.get('/sobre', (req, res) => {
    res.render('sobre');
});

app.get('/editar', (req, res) => {
    res.render('editar');
});

app.get('/editar/:id', (req, res) => {
    const id = req.params.id

    Reserva.findByPk(id)
        .then(reservas => {
            if (reservas) {
                res.render('editar', { reservas: reservas });
            } else {
                res.send('Reserva não encontrada');
            }
        })
        .catch(error => {
            res.send('Erro ao buscar reserva: ' + error.message);
        });
});

app.post('/editar/:id', (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.send('ID inválido');
    }

    console.log('ID recebido:', id);
    console.log('Dados recebidos:', req.body);

    Reserva.update({
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
        console.error('Erro ao atualizar reserva:', error);
        res.send('Erro ao atualizar reserva: ' + error.message);
    });
});

app.get('/admreservas', (req, res) => {
    res.render('admreservas');
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

app.get('/admreservas/:id', (req, res) => {
    Reserva.destroy({ where: { id: req.params.id } })
        .then(function () {
            res.redirect('/admreservas');
        }).catch(function (erro) {
            res.send('Erro ao excluir a reserva');
        });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    
});

app.get('/registrar', (req, res) => {
    res.render('registrar');
});

// app.post('/registrar', (req, res) => {
//     Usuario.create({
//         name: req.body.name,
//         telefone: req.body.telefone,
//         email: req.body.email,
//         senha: req.body.senha
//     }).then(usuarios => {
//         res.redirect('/login');
//     }).catch(err => {
//         res.render('login', { erro: 'Error ao cadastrar:' + err });
//     });
// });

app.listen(5555, () => {
    console.log("Servidor rodando em http://localhost:5555");
});