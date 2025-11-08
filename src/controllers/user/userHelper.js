const knexConnect = require("../../../knexConnection");

const checkUser = async (user_id) => {
    try {

        let checkidexist = await knexConnect("users")
            .select()
            .where({
                "user_id": user_id
            });

        if (checkidexist.length > 0) {
            return {
                status: true,
                data: checkidexist[0]
            };
        } else {
            return {
                status: false,
                data: null,
                message: "User ID does not exist"
            };
        }

    } catch (error) {

        return {
            status: false,
            message: "Error Occured",
            data: error.message
        };
    }
}


const checkUserById = async (id) => {
    try {

        let checkidexist = await knexConnect("users")
            .select()
            .where({
                "id": id
            });

        if (checkidexist.length > 0) {
            return {
                status: true,
                data: checkidexist[0]
            };
        } else {
            return {
                status: false,
                data: null,
                message: "User ID does not exist"
            };
        }

    } catch (error) {

        return {
            status: false,
            message: "Error Occured",
            data: error.message
        };
    }
}

const insertUser = async (data) => {
    try {

        let insertdata = await knexConnect("users")
            .insert(data);

        return {
            status: true,
            data: insertdata[0]
        };

    } catch (error) {
        return {
            status: false,
            message: "Error Occured",
            data: error.message
        };

    }
}


const updateUserr = async (data, id) => {
    try {

        await knexConnect("users")
            .update(data).where({ id });

        return {
            status: true,
            message: "Update successful",
        };

    } catch (error) {
        return {
            status: false,
            message: "Error Occured",
            data: error.message
        };

    }
}

const toggleActiveStatuss = async (id) => {
    try {

        const user = await knexConnect("users").where({ id }).first();

        // console.log(user)

        if (!user) {
            return {
                "status": false,
                "message": "User not found"
            }
        }

        // ✅ Toggle status
        const newStatus = !user.is_active;

        await knexConnect("users")
            .where({ id })
            .update({
                is_active: newStatus,
                updated_at: knexConnect.fn.now()
            });

        return {
            status: true,
            message: `User ${newStatus ? "Activated" : "Deactivated"} sucessfully.  `
        }


    } catch (error) {
        return {
            status: false,
            message: "Error Occured",
            data: error.message
        };

    }
}


const saveRefreshToken = async (data) => {
    try {

        await knexConnect("refresh").insert(data);

        return { status: true, message: "Refresh token saved successfully." }

    } catch (error) {
        return { status: false, message: error.message }
    }
}

const checkRefresh = async (token) => {
    try {

        let checktoken = await knexConnect("refresh")
            .select()
            .where({
                "refresh_token": token
            });

        if (checktoken.length > 0) {
            return {
                status: true,
                data: checktoken[0]
            };
        } else {
            return {
                status: false,
                data: null,
                message: "Token does not exist"
            };
        }

    } catch (error) {

        return {
            status: false,
            message: "Error Occured",
            data: error.message
        };
    }
}


const deleteRefresh = async (token) => {
    try {

        await knexConnect("refresh")
            .where({ "refresh_token": token })
            .del();

        return { status: true, message: "Refresh token deleted successfully." }

    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = { checkUser, insertUser, updateUserr, toggleActiveStatuss, checkUserById, saveRefreshToken, checkRefresh, deleteRefresh }