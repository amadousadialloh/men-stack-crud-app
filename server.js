const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Car = require("./models/carModel");
const methodOverride = require("method-override");
dotenv.config();
const server = express();
const PORT = 4000;

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("connected"));
server.use(methodOverride("_method"));
server.use(express.urlencoded({ extended: false }));
server.post("/cars", async (req, res) => {
  await Car.create(req.body);
  res.redirect("/carsPage");
});
server.get("/carsPage/:carId", async (req, res) => {
  const carDetails = await Car.findById(req.params.carId);
  res.render("carDetails.ejs", {
    car: carDetails,
  });
});
server.get("/cars/:id/edit", async (req, res) => {
  const car = await Car.findById(req.params.id);
  res.render("editPage.ejs", { car: car });
});

server.delete("/cars/:carId", async (req, res) => {
  await Car.findByIdAndDelete(req.params.carId);
  res.redirect("/carsPage");
});

server.put("/cars/:carId", async (req, res) => {
  await Car.findByIdAndUpdate(req.params.carId, req.body, {
    new: true,
  });
  res.redirect("/carsPage");
});

server.get("/add/new", async (req, res) => {
  res.render("addCarPage.ejs");
});

server.get("/carsPage", async (req, res) => {
  const getCars = await Car.find();
  res.render("carsPage.ejs", {
    carsCollection: getCars,
  });
});
server.get("/", (req, res) => {
  res.render("homePage.ejs");
});

server.listen(PORT);
