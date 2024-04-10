const express = require("express");
const database = require("../models/db");
const routerCarta = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({
  dest: "upload/",
});

//buscar por categoria
routerCarta.get("/menu", async (req, res) => {
  const category = req.query.category;
  const conection = await database.getConnection();
  if (!category) {
    try {
      const result = await conection.query("SELECT * FROM menu; ");
      return res.status(200).json(result);
    } catch (error) {
      console.log(`error en la consulta`, error);
      await conection.end();
      res.status(500).json({ error: error });
    }
  }
  try {
    const result = await conection.query(
      "SELECT * FROM menu where category = ?; ",
      [category]
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(`error en la consulta`, error);
    await conection.end();
    res.status(500).json({ error: error });
  }
});
routerCarta.get("/menu/:serch", async (req, res) => {
  try {
    const conection = await database.getConnection();
    const serch = req.params.serch;
    const result = await conection.query("SELECT * FROM menu; ");
    const resultSerch = result.filter((item) =>
      item.title.toLowerCase().includes(serch.toLowerCase())
    );
    res.status(200).json(resultSerch);
  } catch (error) {
    console.log(`error en la consulta`, error);
    await conection.end();
    res.status(500).json({ error: error });
  }
});
routerCarta.post("/menu", upload.single("imageUpLoading"), async (req, res) => {
  const conection = await database.getConnection();
  const origianlNameee = saveiamgeFuncion(req.file);
  const url_imagen = `http://localhost:3001/${origianlNameee}`;
  const itemid = new Date().getTime();
  let { title, price, category } = req.body;
  try {
    console.log("req.body.extra:", req.body.extra);
    const menuItems = JSON.parse(req.body.extra);
    console.log("menuItems:", menuItems);;

    await conection.query(
      `INSERT INTO menu (  title, price, url_imagen,category,itemid ) VALUES (?,?,?,?,?);`,
      [title, price, url_imagen, category, itemid]
    );
    try {
      for (let i = 0; i < menuItems.length; i++) {
        console.log("menuItem[i]:", menuItems[i]);
        let { title, price } = menuItems[i];
        await conection.query(
          `INSERT INTO extraProducto (  title, price ,usuario ) VALUES (?,?,?);`,
          [title, price, itemid]
        );
      }
      res.status(200).json({ message: "salio bien extraProducto y menu" });
    } catch (error) {
      console.error("Error en la consulta:", error);
      res.status(500).json({ error: "Error en la consulta extraProducto" });
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en la consulta" });
  }
});
function saveiamgeFuncion(file) {
  const fechaActualEnMilisegundos = new Date().getTime();
  const nobrecompleto = `${fechaActualEnMilisegundos}${file.originalname}`;
  const newPath = `./upload/${nobrecompleto}`;
  console.log(newPath);
  fs.renameSync(file.path, newPath);
  let origianlNameee = nobrecompleto;
  return origianlNameee;
}
routerCarta.put("/menu/:id", async (req, res) => {
  const conection = await database.getConnection();
  const id = req.params.id;
  let { title, price, url_imagen, category } = req.body;
  console.log(id);
  try {
    //`INSERT INTO menu (  title, price, url_imagen,category ) VALUES (?,?,?,?);`
    await conection.query(
      `UPDATE menu
      SET title = ?, price = ?, url_imagen = ?, category = ?
      WHERE id = ?`,
      [title, price, url_imagen, category, id]
    );
    res.status(200).json({ message: "salio bien" });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en la consulta" });
  }
});
routerCarta.get("/menuporid/:id", async (req, res) => {
  const conection = await database.getConnection();
  const id = req.params.id;
  console.log(id);
  try {
    data = await conection.query(
      `SELECT * FROM menu
        WHERE id = ?;`,
      [id]
    );
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en la consulta" });
  }
});
routerCarta.delete("/menu/:id", async (req, res) => {
  const conection = await database.getConnection();
  const id = req.params.id;
  let { title, price, url_imagen } = req.body;
  console.log(id);
  try {
    await conection.query(
      `DELETE FROM menu
        WHERE id = ?;`,
      [id]
    );
    res.status(200).json({ message: "salio bien" });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en la consulta" });
  }
});
module.exports = routerCarta;
