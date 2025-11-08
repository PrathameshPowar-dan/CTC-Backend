const argon2d = require("argon2");
const { notFound, conflict, badRequest, internal } = require("../../utils/errors");
const { success } = require("../../utils/response");
const { checkUser, insertUser, updateUserr, toggleActiveStatuss, saveRefreshToken, checkRefresh, deleteRefresh } = require("./userHelper");
const knexConnect = require("../../../knexConnection");
const { generateRefreshToken, generateAccessToken } = require("../../helpers/token");
const moment = require("moment-timezone");
const jwt = require('jsonwebtoken');


const addUser = async (req, res, next) => {
  let {
    name, user_id, password, email, phone
  } = req.body;


  name = name ? name.trim() : null;
  user_id = user_id ? user_id.trim() : null;
  email = email ? email.trim() : null;
  phone = phone ? phone.trim() : null;


  if (!name || !user_id || !password) {
    return next(badRequest("Name, User Id and Password are required."));
  }

  const hashedpassword = await argon2d.hash(password);

  try {

    let checkidexist = await checkUser(user_id);

    if (checkidexist.status && checkidexist.data) {
      return next(conflict(checkidexist?.message)); // e.g. "User ID already exists"
    }

    let insertresp = await insertUser({
      "user_id": user_id,
      "name": name,
      "password": hashedpassword,
      "email": email,
      "phone": phone
    })

    if (insertresp.status) {
      return success(res, "User registered successfully.", 201, { "id": insertresp.data });
    }
    else {
      return next(internal(insertresp?.message));
    }

  } catch (error) {

    next(internal(error.message));

  }

}

const updateUser = async (req, res, next) => {
  try {

    let {
      name, email, phone, id
    } = req.body;

    if (!id) {
      return next(badRequest("ID is required."));
    }

    name = name ? name.trim() : null;

    if (!name) {
      return next(badRequest("Name is required."));
    }

    email = email ? email.trim() : null;
    phone = phone ? phone.trim() : null;

    let updatedata = {
      "name": name,
      "email": email,
      "phone": phone
    }

    let updateresp = await updateUserr(updatedata, id)

    if (updateresp.status) {
      return success(res, "User updated successfully.", 200, { "id": id });
    }
    else {
      return next(internal(updateresp?.message));
    }

  } catch (error) {
    next(internal(error.message));
  }
}

const loginUser = async (req, res, next) => {
  try {

    let { user_id, password } = req.body;

    if (!user_id || !password) {
      return next(badRequest("User ID and Password are required."));
    }

    let checkidexist = await checkUser(user_id);

    if (!(checkidexist.status && checkidexist.data)) {
      return next(notFound(checkidexist?.message)); // e.g. "User ID does not exist"
    }

    if (!checkidexist.data.is_active) {
      return next(badRequest("User is not active. Please contact admin."));
    }

    const isPasswordValid = await argon2d.verify(checkidexist.data.password, password);

    if (!isPasswordValid) {
      return next(badRequest("Invalid Password."));
    }

    // If you want to exclude the password from the response
    const { password: _, ...userWithoutPassword } = checkidexist.data;

    // Generate tokens or perform other login-related tasks here
    const cookieExpireTime = process.env.COOKIE_EXPIRE_TIME;
    const refreshToken = generateRefreshToken({ "id": userWithoutPassword.id, user_id });
    const accessToken = generateAccessToken({ "id": userWithoutPassword.id, user_id });

    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const expiryAt = moment().add(cookieExpireTime, 'hours').format('YYYY-MM-DD HH:mm:ss');

    let insertrefresh = await saveRefreshToken({
      "user_id": user_id,
      "refresh_token": refreshToken,
      "created_at": createdAt,
      "expiry_at": expiryAt
    })

    if (!insertrefresh.status) {
      return next(internal(insertrefresh?.message));
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict', // Adjust based on your requirements
      maxAge: cookieExpireTime * 60 * 60 * 1000 // Convert hours to milliseconds
    });

    return success(res, "Login successful.", 200, { user: userWithoutPassword, accessToken, refreshToken });

  } catch (error) {
    next(internal(error.message));
  }
}

const updatePassword = async (req, res, next) => {
  try {

    let {
      password, id
    } = req.body;

    if (!id || !password) {
      return next(badRequest("ID and Password are required."));
    }

    const hashedpassword = await argon2d.hash(password);

    let updatedata = {
      "password": hashedpassword
    }

    let updateresp = await updateUserr(updatedata, id)

    if (updateresp.status) {
      return success(res, "Password updated successfully.", 200, { "id": id });
    }
    else {
      return next(internal(updateresp?.message));
    }

  } catch (error) {
    next(internal(error.message));
  }
}

const toggleActiveStatus = async (req, res, next) => {
  try {

    let { id } = req.params;

    if (!id) {
      return next(badRequest("ID is required."));
    }

    let toggleresp = await toggleActiveStatuss(id)

    if (toggleresp.status) {
      return success(res, toggleresp.message, 200, { "id": id });
    }
    else {
      return next(internal(toggleresp?.message));
    }

  } catch (error) {
    next(internal(error.message));
  }
}

const getAllUsers = async (req, res, next) => {
  try {

    let { id, active } = req.query;

    // ✅ Start query builder
    let query = knexConnect("users").select(
      "id",
      "user_id",
      "name",
      "email",
      "phone",
      "is_active",
      "created_at"
    );

    if (id) {
      if (isNaN(id)) return next(badRequest("Invalid ID format"));
      query = query.where("id", id);
    }

    if (active) {
      if (active !== "Y" && active !== "N") {
        return next(badRequest("Invalid 'active' value. Use 'Y' or 'N'."));
      }
      const status = active === "Y";
      query = query.where("is_active", status);
    }

    // ✅ Execute query
    const users = await query;

    return success(
      res,
      users.length ? "Users fetched successfully." : "No users found.",
      200,
      { count: users.length, users }
    );


  } catch (error) {

    next(internal(error.message));

  }
}

const getAccessToken = async (req, res, next) => {
  try {

    // let cookies =  req.cookies;
    let cookies = { "refreshToken": null };

    if (!cookies?.refreshToken) {
      console.log("first", JSON.stringify(cookies))

      if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
          cookies.refreshToken = authHeader.split(" ")[1];
        }
        else {
          return next(badRequest("Refresh Token is required."));
        }
      }
      else {
        return next(badRequest("Refresh Token is required."));
      }


    }

    if (!cookies.refreshToken) {
      return next(badRequest("Refresh Token is required."));
    }
    else {
      const refreshToken = cookies.refreshToken;
      const findRefresh = await checkRefresh(refreshToken);

      if (!findRefresh.status) {
        return next(notFound(findRefresh?.message || "Refresh Token not found."));
      }

      else if (findRefresh.data) {

        jwt.verify(
          refreshToken,
          process.env.REFRESH_PRIVATE_KEY,
          async (err, decoded) => {
            if (err) {
              await deleteRefresh(refreshToken);
              res.cookie('refreshToken', '', { maxAge: 1 }); // Clear cookie
              return next(badRequest("Invalid or Expired Refresh Token. Please login again."));
            }
            else {
              const check = await checkUser(decoded.user_id);

              if (!check.status) {
                return next(notFound(check?.message || "User not found."));
              }

              else if (check.status) {
                const user_id = decoded.user_id;
                let senddata = check.data;
                delete senddata.password;
                delete senddata.otp;
                delete senddata.otp_generated_time;
                delete senddata.is_active;

                const accessToken = generateAccessToken({ "id": senddata.id, "user_id": senddata.user_id });
                return success(res, "New Token Generated Successfully", 200, { user: senddata, accessToken });
                // return res.status(200).json({ status: true, user: senddata, accessToken: accessToken, message: "New Token Generated Successfully" });
              }
            }
          }
        );
      }
    }


  } catch (error) {
    return next(internal(error.message));
  }
}

module.exports = { addUser, updateUser, updatePassword, toggleActiveStatus, getAllUsers, loginUser, getAccessToken }