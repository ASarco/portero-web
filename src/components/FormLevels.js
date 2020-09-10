import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { db } from "../firebase";
import { toast } from "react-toastify";

function FormPortero(props) {
  const initialStateValues = {
    name: "",
    porteroId: "",
  };

  const [values, setValues] = useState(initialStateValues);

  useEffect(() => {
    if (props.currentId === "") {
      setValues({ ...initialStateValues });
    } else {
      getLevelById(props.porteroId, props.currentId);
    }
  }, [props.currentId]);

  const getLevelById = async (porteroId, currentId) => {
    const doc = await db
      .collection("porteros")
      .doc(porteroId)
      .collection("levels")
      .doc(currentId)
      .get();
    setValues({ ...doc.data() });
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
      porteroId: props.porteroId,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrEdit(values);
    setValues({ ...initialStateValues });
  };

  const addOrEdit = async (levelObject) => {
    try {
      if (props.currentId === "") {
        await db
          .collection("porteros")
          .doc(props.porteroId)
          .collection("levels")
          .doc()
          .set(levelObject);
        toast("Level agregado correctamente", {
          type: "success",
          autoClose: 2000,
        });
      } else {
        await db
          .collection("porteros")
          .doc(props.porteroId)
          .collection("levels")
          .doc(props.currentId)
          .update(levelObject);
        toast("Level actualizado correctamente perri", {
          type: "info",
          autoClose: 2000,
        });
        props.setCurrentId("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form className="card card-body" onSubmit={handleSubmit}>
        <div className="form-group input-group">
          <div className="input-group-text bg-light">
            <i className="material-icons">create</i>
          </div>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Nombre level"
            onChange={handleInputChange}
            value={values.name}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block cursor-pointer"
        >
          {props.currentId === "" ? "Agregar" : "Actualizar"}
        </button>

        {props.currentId && (
          <button
            className="btn btn-danger btn-block cursor-pointer"
            onClick={() => props.setCurrentId("")}
          >
            Cancelar
          </button>
        )}
      </form>
      <ToastContainer />
    </>
  );
}

export default FormPortero;
