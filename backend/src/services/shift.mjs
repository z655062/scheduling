import db from "../../models/index.js";
const { User, ShiftRange } = db;

class ShiftService {
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
    // C: 創建排班需求 (POST /)
    // ----------------------------------------------------
    static async createShiftRequirement(data) {
        const newShiftRequirement = await ShiftRange.create(data);
        return newShiftRequirement.toJSON();
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

    // ----------------------------------------------------
    // D: 刪除使用者 (DELETE /:id)
    // ----------------------------------------------------
    static async findOrCreateOauthUser(data) {
        const { id, provider, displayName } = data;
        const user = await User.findOne({ where: { oauth_id: id, oauth_type: provider } });

        if (user !== null) {
            return user;
        }
        else {
            const userData = {
                username: displayName,
                oauth_id: id,
                oauth_type: provider,
                type: "normal",
                is_active: true
            }
            const newUser = await await User.create(userData);
            return newUser
        }
    }


    // ----------------------------------------------------
    // R: 查詢所有排班需求 (GET /)
    // ----------------------------------------------------
    static async getAllShiftRanges() {
        const ranges = await ShiftRange.findAll({
            attributes: ["id", "name", "start_date", "end_date", "is_published"],
            order: [["createdAt", "DESC"]]
        });

        return ranges.map(range => range.toJSON());
    }

    // ----------------------------------------------------
    // R: 查詢單一排班需求 (GET /:id)
    // ----------------------------------------------------
    static async getShiftRangeById(id) {
        const shiftRange = await ShiftRange.findByPk(id);
        if (!shiftRange) {
            return null;
        }
        return shiftRange.toJSON();
    }


    // ----------------------------------------------------
    // C: 創建排班需求 (POST /)
    // ----------------------------------------------------
    static async createShiftRange(data) {
        const newShiftRequirement = await ShiftRange.create(data);
        return newShiftRequirement.toJSON();
    }
}

export default ShiftService;