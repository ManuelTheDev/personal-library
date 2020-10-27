import React, { useReducer, useEffect } from "react";
import ArtReducer from "./artReducer";
import ArtContext from "./artContext";
import axios from "axios";


import Swal from "sweetalert2";

const ArtState = (props) => {
  const initialState = {
    isAuthenticated: null,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(ArtReducer, initialState);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch({
        type: USER_LOADED,
        payload: user,
      });
    }
    //eslint-disable-next-line
  }, []);

  const login = async (formData) => {
    console.log("Login usuario", formData);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //const res = await axios.post('http://52.4.175.1:5000/api/user/login', formData, config);
    const res = await axios.post(
      "http://127.0.0.1:5000/api/user/login",
      formData,
      config
    );
    console.log("Respuesta API", res.data);

    console.log("code = ", res.data.code);

    if (res.data.code >= 200 && res.data.code < 300) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.body,
      });
    } else {
      console.log("Login failed");
      dispatch({
        type: LOGIN_FAIL,
        payload: "Login fallido",
      });
      console.log("mensaje", res.data.message);

      Swal.fire({
        title: "Error",
        text: "El usuario o contraseña son incorrectos",
        icon: "error",
      });
    }
  };

  const logout = () => dispatch({ type: LOGOUT });

  const register = async (formData) => {
    console.log("Registrar usuario", formData);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    /* const res = await axios.post(
        "http://52.4.175.1:5000/api/user/create",
        formData,
        config
      ); */
    const res = await axios.post(
      "http://127.0.0.1:5000/api/user/create",
      formData,
      config
    );
    console.log("Register success");

    if (res.data.code >= 200 && res.data.code < 300) {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      Swal.fire({
        title: "Éxito",
        text: "Se registró correctamente al usuario",
        icon: "success",
      });
    } else {
      console.log("Register failed");
      dispatch({
        type: REGISTER_FAIL,
        payload: "Registro fallido",
      });
      if (res.data.message === "Username or email are being used") {
        Swal.fire({
          title: "Error",
          text: "El usuario o correo electrónico están en uso. Elija otro",
          icon: "error",
        });
      }
    }
  };

  return (
    <ArtContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {props.children}
    </ArtContext.Provider>
  );
};

export default ArtState;
