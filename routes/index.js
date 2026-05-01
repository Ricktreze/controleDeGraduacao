var express = require('express');
const cors = require('cors');
const app = express();
const { ObjectId } = require("mongodb");
// const upload = require("../config/multer");
// const PictureController = require("../controller/pictureController");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: '*' // Replace with your React app's URL
}));
const PORT = 4015;
const db = require("../db/db");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express 16' });
});

app.get("/api/aluno", async (req, res) => {

  const sort = { stamp: -1 };
  const returnRouter = req.query.returnRouter;
  const aluno = await db.find("aluno");
  res.header('Access-Control-Allow-Origin', '*');
  res.json(aluno);
});

app.get("/api/alunoNome", async (req, res) => {
  const sort = { stamp: -1 };
  const nomealuno = req.query.nomealuno;

  let aluno = await db.findNome("aluno", sort, { nomealuno: { $regex: nomealuno, $options: 'i'  } });
  res.header('Access-Control-Allow-Origin', '*');
  if (aluno.length === 0) {
    aluno = await db.find("aluno");
  }
  res.json(aluno);
});

app.post("/api/aluno", async (req, res) => {
  const alunoBody = req.body;
  const _id = req.query._id;
  res.header('Access-Control-Allow-Origin', '*');

  const objPrices = {
    nomealuno: alunoBody.nomealuno,
    idade: alunoBody.idade,
    sexo: alunoBody.sexo,
    faixa: alunoBody.faixa,
    grau: alunoBody.grau,
    dataInicio: alunoBody.dataInicio,
    dataUltimaGraduacao: alunoBody.dataUltimaGraduacao,
    dataProximaGraduacao: alunoBody.dataProximaGraduacao,
    observacoes: alunoBody.observacoes,
    status: alunoBody.status
  }
  const result = await db.update(_id, objPrices, "aluno");
  res.status(201)
  res.json(result.toString())
  // res.redirect(returnRouter)
});

app.put("/api/aluno", async (req, res) => {
  const alunoBody = req.body;
  res.header('Access-Control-Allow-Origin', '*');

  const objPrices = {
    nomealuno: alunoBody.nomealuno,
    idade: alunoBody.idade,
    sexo: alunoBody.sexo,
    faixa: alunoBody.faixa,
    grau: alunoBody.grau,
    dataInicio: alunoBody.dataInicio,
    dataUltimaGraduacao: alunoBody.dataUltimaGraduacao,
    dataProximaGraduacao: alunoBody.dataProximaGraduacao,
    observacoes: alunoBody.observacoes,
    status: alunoBody.status,
    _id: new ObjectId(alunoBody._id)
  }
  const result = await db.insert("aluno", objPrices);
  res.status(201)
  res.json(result.insertedId.toString())
  // res.redirect(returnRouter)
});

app.delete("/api/aluno", async (req, res) => {
  const _id = req.query.id;
  db.remove(_id, "aluno")
});

// presença
app.put("/api/presenca", async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const presencaBody = req.body;
  const idAluno = req.query._id;
  const objPrices = {
    nomeAluno: presencaBody.nomeAluno,
    dataPresenca: presencaBody.dataPresenca.substring(0, 10),
    idAluno: idAluno,
    _id: new ObjectId()
  }
  const result = await db.insert("presenca", objPrices);
  res.status(201)
  res.json(result.insertedId.toString())

});

app.get("/api/presenca", async (req, res) => {

  const sort = { stamp: -1 };
  const returnRouter = req.query.returnRouter;
  const dataDe = req.query.presencaDe;
  const dataAte = req.query.presencaAte;
  const objPersenca = { dataPresenca: { $gte: dataDe, $lte: dataAte } }
  var presenca = null
  if (!dataAte) {
    presenca = await db.find("presenca");
  } else {
    presenca = await db.find("presenca", objPersenca);
  }

  res.header('Access-Control-Allow-Origin', '*');
  res.json(presenca);
});

app.get("/api/graduacoes", async (req, res) => {

  const sort = { stamp: -1 };
  const dataDe = req.query.dataDe;
  const dataAte = req.query.dataAte;
  const nomeAluno = req.query.nomeAluno;
  let filtroDataGraduacao = null;

  if (nomeAluno && dataDe) {
    filtroDataGraduacao = {
      nomealuno: { $regex: nomeAluno, $options: 'i'  },
      dataProximaGraduacao: {
      $gte: dataDe,
      $lte: dataAte
      }
    }
  }else if(nomeAluno && !dataDe){
    filtroDataGraduacao = {
       nomealuno: { $regex: nomeAluno, $options: 'i'  }
    }

  }else if(!nomeAluno && dataDe){
    filtroDataGraduacao = {
      dataProximaGraduacao: {
        $gte: dataDe,
        $lte: dataAte
      }
    }

  }
  const graduacoes = await db.findGraduacao("aluno", filtroDataGraduacao);
  res.header('Access-Control-Allow-Origin', '*');
  res.json(graduacoes);
});


module.exports = router;
//app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`));
