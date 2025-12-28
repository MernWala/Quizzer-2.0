import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/slice/client/auth";

export const useAuthCheck = () => {
  const [auth, setAuth] = useState({ loading: true, isAuthenticated: false });
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND}/api/admin/check-is-admin`, {
        withCredentials: true,
      })
      .then((data) => {
        setAuth({
          loading: false,
          isAuthenticated: data?.data?.isAuthenticated ?? false,
          role: data?.data?.user?.role,
        });
        dispatch(
          setUserDetails({
            user: data?.data?.user,
            role: data?.data?.user?.role,
            isAuthenticated: data?.data?.isAuthenticated
          })
        );
      })
      .catch((error) => {
        console.error(error);
        setAuth({
          loading: false,
          isAuthenticated: error?.data?.isAuthenticated ?? false,
          role: null,
        });
      });
  }, []);

  return auth;
};
