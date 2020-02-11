const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const saltRounds = 10;
router.post("/register", async (req, res) => {
  // verificaçao
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email ja existe");
  //HASH PASSWORD
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // criar novo usuario
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});
//Login
router.post("/login", async (req, res) => {
  //
  //validaçao do usuario

  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if the user is already in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email ou senha estao errados");
  //validaçao login
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("senha errada");

  //criando o token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);

  res.send("login realizado com sucesso");
});
module.exports = router;
