require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

const authRouter = require("./src/routers/auth.router");
const scheduleRouter = require("./src/routers/matchSchedule.router.js");
const leaguesRouter = require("./src/routers/leagues.router.js");

const { prisma } = require("./prisma/prisma.js");

app.use("/auth", authRouter);
app.use('/schedule', scheduleRouter)
app.use('/leagues', leaguesRouter)

const bcrypt = require("bcrypt");

app.listen(4500, () => {
  console.log("API is running on port 4500");
});

const createAdmin = async () => {
  const isAdminFound = await prisma.users.findMany({
    where: {
      email: {
        in: [process.env.EMAIL_ADMIN],
      },
    },
  });

  const hashedPassword = await bcrypt.hash(process.env.PASSWORD_ADMIN, 10);

  if (!isAdminFound.length) {
    await prisma.users.createMany({
      data: [
        {
          lastName: "admin",
          firstName: "admin",
          email: process.env.EMAIL_ADMIN,
          password: hashedPassword,
          roles: ["admin"],
        },
      ],
    });
  }
  return;
};

createAdmin()