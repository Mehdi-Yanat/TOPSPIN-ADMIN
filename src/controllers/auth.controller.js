const { default: validator } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { TOKEN_SECRET, SMTP_USER } = process.env;
const { prisma } = require("../../prisma/prisma");
const path = require("path");
const { generateVerificationCode } = require("../utils/generator");
const { readHTMLFile } = require("../utils/htmlFileFunction");
const transporter = require("../utils/nodemailer");
const handlebars = require("handlebars");

exports.login = async (req, res) => {
    try {
        const { email, password, verificationCode } = req.body;

        if ((!email || !password || !verificationCode)) {
            throw new Error("Please check the information entered!");
        }

        if (!validator.isEmail(email)) {
            throw new Error("Email address Invalid !");
        }

        let user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            throw new Error("User not existing!");
        }

        const verificationCodeFound = await prisma.verification_codes.findFirst({
            where: { AND: { email, code: verificationCode } },
        });

        if (!verificationCodeFound) {
            throw new Error("Invalid verification code!");
        }

        const isExpired = moment().isAfter(
            moment(verificationCodeFound.expiration)
        );

        if (isExpired) {
            await prisma.verification_codes.delete({
                where: { id: verificationCodeFound.id },
            });
            throw new Error("Verification code expired!");
        }

        let isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new Error("Incorrect credentials!");
        }

        delete user.password;
        delete user.tokens;

        const token = jwt.sign({ userId: user.id }, TOKEN_SECRET);

        await prisma.users.update({
            where: { id: user.id },
            data: {
                tokens: [token],
                lastLogin: new Date(),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Connected successfully!",
            token,
            user,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.sendVerificationCode = async (req, res) => {
    try {
        let adminsEmail = await prisma.users.findMany();
        adminsEmail = adminsEmail.map((el) => el.email);

        const { email } = req.body;
        const generatedCode = generateVerificationCode();

        if (!validator.isEmail(email)) {
            throw new Error("Please make sure to put a valid email");
        }

        if (!adminsEmail.includes(email)) {
            throw new Error("Your email is not an admin email");
        }

        let verificationCodeExists = await prisma.verification_codes.findFirst({
            where: { email },
        });

        if (verificationCodeExists) {
            await prisma.verification_codes.update({
                where: { email },
                data: {
                    code: generatedCode,
                    expiration: moment().add(1, "hours").toDate(),
                },
            });
        } else {
            await prisma.verification_codes.create({
                data: {
                    code: generatedCode,
                    email,
                    expiration: moment().add(1, "hours").toDate(),
                },
            });
        }

        const dirHtml = path.join(
            __dirname,
            "../emails/verificationCodeEmail.html"
        );


        readHTMLFile(dirHtml, async (err, html) => {
            if (err) {
                throw new Error(err);
            }
            let template = handlebars.compile(html);
            let replacements = {
                verificationCode: generatedCode,
            };
            const htmlContent = template(replacements);

            const info = await transporter.sendMail({
                from: SMTP_USER, // sender address
                to: email, // list of receivers
                subject: "Topspin admin verification code!", // Subject line
                text: "Topspin admin verification code!", // plain text body
                html: htmlContent, // html body
            });

            return res.status(201).json({
                success: true,
                message: "Verification code sent!",
                info
            });
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.checkToken = async (req, res) => {
    try {
        if (req.user) {
            await prisma.users.update({
                where: { id: req.user.id },
                data: { lastLogin: new Date() },
            });

            return res.status(200).json({
                success: true,
                message: "",
                user: req.user,
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        await prisma.users.update({
            where: { id: req.user.id },
            data: { tokens: [] },
        });

        return res.status(200).json({
            success: true,
            message: "You are now logged out!",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.update = async (req, res) => {
    try {

        const { password, email, mobile, firstName, lastName } = req.body;

        const admin = await prisma.users.findUnique({
            where: {
                id: req.user.id
            }
        })



        await prisma.users.update({
            where: {
                id: admin?.id,
            }, data: {
                password: password === admin?.password ? admin?.password : await bcrypt.hash(password, 10),
                email,
                mobile,
                firstName,
                lastName
            }
        })

        return res.status(200).json({
            success: true,
            message: "Admin was updated successfully!",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.addAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        const emailExist = await prisma.users.findFirst({
            where: {
                email
            }
        })

        if (emailExist) {
            throw new Error('Email already exists!')
        }

        const hash = await bcrypt.hash(password, 10)

        await prisma.users.create({
            data: {
                email,
                password: hash,
                roles: ['admin']
            }
        })

        return res.status(200).json({
            success: true,
            message: "Admin was added successfully!",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.adminLists = async (req, res) => {
    try {

        const lists = await prisma.users.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                lastLogin: true,
                createdAt: true
            }
        })

        return res.status(200).json({
            success: true,
            message: "",
            lists
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new Error("You must provide id")
        }

        const adminNotFound = await prisma.users.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!adminNotFound) {
            throw new Error("Admin not found to delete")
        }

        await prisma.users.delete({
            where: {
                id: parseInt(id)
            }
        })

        return res.status(200).json({
            success: true,
            message: "Admin was deleted successfully!",
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};