const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "signo",
  password: "ds564",
  port: 7007,
});

function calcularIdadeSigno(data_aniversario) {
  const dataNasc = new Date(data_aniversario);
  const dataAtual = new Date();

  let idade = dataAtual.getFullYear() - dataNasc.getFullYear();
  const m = dataAtual.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && dataAtual.getDate() < dataNasc.getDate())) {
    idade--;
  }

  let signo = "";
  const dia = dataNasc.getDate();
  const mes = dataNasc.getMonth() + 1;

  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
    return "Aquário♒";
  } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
    return "Peixes♓";
  } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
    return "Áries♈";
  } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
    return "Touro♉";
  } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
    return "Gêmeos♊";
  } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
    return "Câncer♋";
  } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
    return "Leão♌";
  } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
    return "Virgem♍";
  } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
    return "Libra♎";
  } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
    return "Escorpião♏";
  } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
    return "Sagitário♐";
  } else {
    return "Capricórnio♑"; // Caso padrão para os demais dias de dezembro e janeiro
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("A Rota esta funcionando!");
});

app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM usuarios");
    res.json({
      total: resultado.rowCount,
      usuarios: resultado.rows,
    });
  } catch (error) {
    console.error("Erro ao exibir todos usuarios", error);
    res.status(500).json({ message: "Erro ao exibir todos usuarios" });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { idade, signo } = calcularIdadeSigno(req.body.data_aniversario);
    const { nome, sobrenome, data_aniversario, email } = req.body;
    await pool.query(
      "INSERT INTO usuarios (nome, sobrenome, data_aniversario, email, idade, signo ) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, sobrenome, data_aniversario, email, idade, signo]
    );
    res.status(201).send({ message: "Usuario inserido com sucesso!" });
  } catch (error) {
    console.error("Erro ao inserir usuario", error);
    res.status(500).json({ message: "Erro ao inserir usuario", error });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.status(200).send({ message: "Usuario deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar usuario", error);
    res.status(500).json({ message: "Erro ao deletar usuario" });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const { idade, signo } = calcularIdadeSigno(req.body.data_aniversario);
    const { id } = req.params;
    const { nome, sobrenome, data_aniversario, email } = req.body;
    await pool.query(
      "UPDATE usuarios SET nome = $1, sobrenome = $2, data_aniversario = $3, email = $4  WHERE id = $3",
      [nome, sobrenome, data_aniversario, email, idade, signo, id]
    );
    res.status(200).send({ message: "Usuario atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuario", error);
    res.status(500).json({ message: "Erro ao atualizar usuario" });
  }
});

app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    if (resultado.rowCount === 0) {
      return res.status(404).send({ message: "Id não encontrado!" });
    } else {
      res.json({
        usuario: resultado.rows[0],
      });
    }
  } catch (error) {
    console.error("Erro ao exibir usuario pelo id", error);
    res.status(500).json({ message: "Erro ao exibir usuario pelo id" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}🚀`);
});
