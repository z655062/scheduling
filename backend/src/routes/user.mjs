import express from "express";
import db from "../../models/index.js";
const { User } = db;
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'is_active', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            users: users.map(user => user.toJSON())
        });

    } catch (error) {
        console.error('查詢所有使用者時發生錯誤:', error);
        return res.status(500).json({
            error: '無法查詢所有使用者',
            details: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: '找不到該使用者' });
        }

        return res.status(200).json({ user: user.toJSON() });
    } catch (error) {
        console.error('READ 錯誤:', error);
        return res.status(500).json({ error: '無法讀取使用者' });
    }
});

router.post('/', async (req, res) => {
    const { username, is_active, role } = req.body;

    try {
        const newUser = await User.create({
            username: username,
            is_active: is_active,
            role: role,
        });

        res.status(200).json(newUser.toJSON());
    } catch (error) {
        console.error('Error creating user:', error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.body;

        const [updatedRowsCount] = await User.update(
            { username, role },
            {
                where: { id: id },
                returning: true
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: '找不到或沒有資料更新' });
        }

        const updatedUser = await User.findByPk(id);

        return res.status(200).json({
            message: '使用者更新成功',
            user: updatedUser.toJSON()
        });

    } catch (error) {
        console.error('UPDATE 錯誤:', error);
        return res.status(500).json({ error: '無法更新使用者' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRowCount = await User.destroy({
            where: { id: id }
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: '找不到該使用者，刪除失敗' });
        }

        return res.status(204).json({ message: '使用者刪除成功' }); // 204 No Content

    } catch (error) {
        console.error('DELETE 錯誤:', error);
        return res.status(500).json({ error: '無法刪除使用者' });
    }
});

// module.exports = router;
export default router;