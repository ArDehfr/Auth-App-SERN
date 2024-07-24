import Users from "../models/UserModel.js"
import argon2 from "argon2"

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getUserId = async (req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;
    if(password !== confirmPassword) return res.status(400).json({msg: "Password doesn't match"});
    try {
        const hashedPassword = await argon2.hash(password);
        await Users.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        res.status(201).json({ msg: "User created successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const hashedPassword = password ? await argon2.hash(password) : user.password;

        await Users.update({
            name: name || user.name,
            email: email || user.email,
            password: hashedPassword,
            role: role || user.role
        }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!user) return res.status(404).json({ msg: "User not found" });

        await Users.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
