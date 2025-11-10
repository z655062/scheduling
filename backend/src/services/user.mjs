import db from "../../models/index.js";
const { User } = db;

class UserService {
    // ----------------------------------------------------
    // R: 查詢所有使用者 (GET /)
    // ----------------------------------------------------
    static async getAllUsers() {
        const users = await User.findAll({
            attributes: ["id", "username", "is_active", "role", "createdAt", "password"],
            order: [["createdAt", "DESC"]]
        });

        return users.map(user => user.toJSON());
    }

    // ----------------------------------------------------
    // R: 查詢單一使用者 (GET /:id)
    // ----------------------------------------------------
    static async getUserById(id) {
        const user = await User.findByPk(id);
        if (!user) {
            return null;
        }
        return user.toJSON();
    }

    // ----------------------------------------------------
    // C: 創建使用者 (POST /)
    // ----------------------------------------------------
    static async createUser(data) {
        const newUser = await User.create(data);
        return newUser.toJSON();
    }

    // ----------------------------------------------------
    // U: 更新使用者 (PUT /:id)
    // ----------------------------------------------------
    static async updateUser(id, data) {
        // const [updatedRowsCount] = await User.update(
        //     data,
        //     {
        //         where: { id: id },
        //         returning: true
        //     }
        // );

        // if (updatedRowsCount === 0) {
        //     return null;
        // }

        // const updatedUserInstance = await User.findByPk(id);
        // return updatedUserInstance ? updatedUserInstance.toJSON() : null;
        const user = await User.findByPk(id);

        if (!user) {
            return null;
        }

        user.set(data);
        await user.save();

        return user.toJSON();
    }

    // ----------------------------------------------------
    // D: 刪除使用者 (DELETE /:id)
    // ----------------------------------------------------
    static async deleteUser(id) {
        // 回傳被刪除的筆數
        const deletedRowCount = await User.destroy({
            where: { id: id }
        });
        return deletedRowCount;
    }
}

export default UserService;