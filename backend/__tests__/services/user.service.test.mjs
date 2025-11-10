import UserService from "../../src/services/user.mjs";
import db from "../../models/index.js";
const { User } = db;


// 輔助函式：創建一個模擬的 Sequelize Model 實例，包含 .toJSON() 方法
const mockUserInstance = (data) => ({
    ...data,
    // 模擬 Sequelize 實例的 .toJSON() 方法，回傳純粹的資料物件
    toJSON: () => data,
});

// 模擬使用者資料
const mockUserData = {
    id: 1,
    username: "test_user",
    is_active: true,
    role: "normal",
    createdAt: new Date().toISOString()
};

const mockUserList = [
    mockUserInstance(mockUserData),
    mockUserInstance({ ...mockUserData, id: 2, username: "admin_user", role: "admin" }),
];

describe("UserService 單元測試", () => {

    // Mock 儲存容器
    let findAllSpy, findByPkSpy, createSpy, updateSpy, destroySpy;

    // 隔離資料庫
    beforeAll(() => {
        findAllSpy = jest.spyOn(User, "findAll").mockImplementation(() => { });
        findByPkSpy = jest.spyOn(User, "findByPk").mockImplementation(() => { });
        createSpy = jest.spyOn(User, "create").mockImplementation(() => { });
        updateSpy = jest.spyOn(User, "update").mockImplementation(() => { });
        destroySpy = jest.spyOn(User, "destroy").mockImplementation(() => { });
    });

    // 每次測試後清除 Mock 呼叫紀錄
    afterEach(() => {
        jest.clearAllMocks();
    });

    //#region 查詢所有使用者 (getAllUsers)
    describe("getAllUsers", () => {
        it("應成功呼叫 findAll 並回傳使用者資料陣列", async () => {
            // 設定 Mock 行為：成功回傳模擬的使用者 Model 實例陣列
            findAllSpy.mockResolvedValue(mockUserList);

            const result = await UserService.getAllUsers();

            // 🎯 測項 1 (行為驗證): 驗證 Model.findAll 被呼叫一次
            expect(findAllSpy).toHaveBeenCalledTimes(1);
            // 🎯 測項 2 (內容驗證): 驗證回傳的資料是純粹的 JSON 物件，且長度正確
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(mockUserData);
            // 🎯 測項 3 (行為驗證): 驗證 Model.findAll 被傳入正確的查詢參數 (attributes, order)
            expect(findAllSpy).toHaveBeenCalledWith(expect.objectContaining({
                attributes: expect.any(Array),
                order: [["createdAt", "DESC"]]
            }));
        });
    });
    //#endregion

    //#region 查詢單一使用者 (getUserById)
    describe("getUserById", () => {
        it("當 ID 存在時，應回傳使用者資料物件", async () => {
            findByPkSpy.mockResolvedValue(mockUserInstance(mockUserData));

            const result = await UserService.getUserById(1);

            // 🎯 測項 1 (狀態驗證): 應回傳正確的使用者名稱
            expect(result.username).toBe("test_user");
            // 🎯 測項 2 (行為驗證): 應呼叫 findByPk 且傳入正確的 ID
            expect(findByPkSpy).toHaveBeenCalledWith(1);
        });

        it("當 ID 不存在時，應回傳 null", async () => {
            findByPkSpy.mockResolvedValue(null);

            const result = await UserService.getUserById(999);

            // 🎯 測項 (狀態驗證): 應回傳 null
            expect(result).toBeNull();
        });
    });
    //#endregion

    //#region 創建使用者 (createUser)
    describe("createUser", () => {
        const createPayload = { username: "new_one", role: "normal" };

        it("應成功呼叫 create 並回傳新建的使用者資料", async () => {
            const mockNewUser = mockUserInstance({ id: 3, ...createPayload });
            createSpy.mockResolvedValue(mockNewUser);

            const result = await UserService.createUser(createPayload);

            // 🎯 測項 1 (行為驗證): 驗證 Model.create 被呼叫且參數正確
            expect(createSpy).toHaveBeenCalledWith(createPayload);
            // 🎯 測項 2 (狀態驗證): 回傳資料應包含 ID
            expect(result).toEqual({ id: 3, ...createPayload });
        });

        it("應在 Model 驗證失敗時，將 Sequelize ValidationError 向上拋出", async () => {
            const validationError = new Error("Username cannot be null");
            validationError.name = "SequelizeValidationError";
            createSpy.mockRejectedValue(validationError);

            // 這裡我們預期 Service 應該直接將這個錯誤拋出
            await expect(UserService.createUser({})).rejects.toThrow("Username cannot be null");

            // 🎯 測項 (行為驗證): 驗證 Model.create 確實被呼叫
            expect(createSpy).toHaveBeenCalledTimes(1);
        });
    });
    //#endregion

    //#region 更新使用者 (updateUser)
    describe("updateUser", () => {
        const updateData = { username: "updated_name", role: "supervisor" };

        it("應成功更新使用者並回傳更新後的資料", async () => {
            // 1. 模擬 Model.update 成功更新 1 筆
            updateSpy.mockResolvedValue([1]);
            // 2. 模擬 Model.findByPk 找到更新後的使用者
            const updatedUser = mockUserInstance({ ...mockUserData, ...updateData });
            findByPkSpy.mockResolvedValue(updatedUser);

            const result = await UserService.updateUser(1, updateData);

            // 🎯 測項 1 (行為驗證): 驗證 Model.update 被呼叫且參數正確
            expect(updateSpy).toHaveBeenCalledWith(updateData, expect.objectContaining({ where: { id: 1 } }));
            // 🎯 測項 2 (行為驗證): 驗證 Model.findByPk 被呼叫一次
            expect(findByPkSpy).toHaveBeenCalledTimes(1);
            // 🎯 測項 3 (狀態驗證): 回傳資料應包含更新後的內容
            expect(result.username).toBe("updated_name");
        });

        it("當找不到使用者或沒有資料更新時，應回傳 null", async () => {
            updateSpy.mockResolvedValue([0]); // 模擬 Model.update 更新 0 筆

            const result = await UserService.updateUser(999, updateData);

            // 🎯 測項 1 (狀態驗證): 應回傳 null
            expect(result).toBeNull();
            // 🎯 測項 2 (行為驗證): 當更新筆數為 0 時，不應呼叫 findByPk
            expect(findByPkSpy).not.toHaveBeenCalled();
        });
    });
    //#endregion

    //#region 刪除使用者 (deleteUser)
    describe("deleteUser", () => {
        it("應成功呼叫 destroy 並回傳刪除筆數 (1)", async () => {
            destroySpy.mockResolvedValue(1);

            const result = await UserService.deleteUser(1);

            // 🎯 測項 1 (狀態驗證): 應回傳筆數 1
            expect(result).toBe(1);
            // 🎯 測項 2 (行為驗證): 驗證 Model.destroy 被呼叫且傳入正確條件
            expect(destroySpy).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it("當找不到使用者時，應回傳刪除筆數 (0)", async () => {
            destroySpy.mockResolvedValue(0);

            const result = await UserService.deleteUser(999);

            // 🎯 測項 (狀態驗證): 應回傳筆數 0
            expect(result).toBe(0);
        });
    });
    //#endregion

    // 恢復所有原始函式
    afterAll(() => {
        jest.restoreAllMocks();
    });
});