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
const resultsRouter = require("./src/routers/results.router.js");
const groupsRouter = require("./src/routers/players.router");
const uiRouter = require("./src/routers/ui.router.js");

const { prisma } = require("./prisma/prisma.js");

app.use("/auth", authRouter);
app.use('/schedule', scheduleRouter)
app.use('/leagues', leaguesRouter)
app.use('/results', resultsRouter)
app.use('/groups', groupsRouter)
app.use('/ui', uiRouter)

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

const initPopup = async () => {

  const isPopupFound = await prisma.popup.findMany()

  if (isPopupFound.length > 0) {
    return
  } else {
    await prisma.popup.create({
      data: {
        popupImage: "TopspinÇankaya.png",
        headerEnglish: "Expansion and Innovation:",
        headerTurkish: "Genişleme ve Yenilik:",
        text: {
          createMany: {
            data: [
              {
                englishTranslation: "To accommodate our growing community and enhance player development, Topspin Academy is thrilled to announce the expansion of its facilities with [Describe the expansion or addition]. This will provide even more opportunities for players to train and compete at the highest level.",
                turkishTranslation: "Büyüyen topluluğumuza uyum sağlamak ve oyuncu gelişimini artırmak için Topspin Akademisi, [Genişletmeyi veya eklemeyi açıklayın] ile tesislerinin genişletildiğini duyurmaktan heyecan duyuyor. Bu, oyuncuların en üst düzeyde antrenman yapmaları ve rekabet etmeleri için daha fazla fırsat sağlayacaktır."
              }, {
                englishTranslation: "Stay tuned for more exciting news and updates from Topspin Tennis Academy!",
                turkishTranslation: "Topspin Tenis Akademisi'nden daha heyecan verici haberler ve güncellemeler için bizi takip etmeye devam edin!"
              }
            ]
          }
        }
      }
    })
  }

}

createAdmin()
initPopup()