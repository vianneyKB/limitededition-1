
import React from "react";
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

//  creating private routing function and adding components
export default function PrivateRoute({ component: Component, ...rest }) 
{
  const { currentUser } = useAuth ()

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Navigate to="/login" />
      }}
    ></Route>
  )
}