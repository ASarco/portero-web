import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { db } from "../firebase";
import { toast } from "react-toastify";

function FormUnits(props) {
  const initialStateValues = {
    name: "",
    phone: "",
    porteroId: "",
    levelId: "",
  };

  const [values, setValues] = useState(initialStateValues);

  useEffect(() => {
    if (props.currentId === "") {
      setValues({ ...initialStateValues });
    } else {
      getUnitById(props.porteroId, props.levelId, props.currentId);
    }
  }, [props.currentId]);

  const getUnitById = async (porteroId, levelId, currentId) => {
    const doc = await db
      .collection("portero")
      .doc(porteroId)
      .collection("levels")
      .doc(levelId)
      .collection("units")
      .doc(currentId)
      .get();
    setValues({ ...doc.data() });
  };

  const handleInputChangeName = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
      porteroId: props.porteroId,
      levelId: props.levelId,
    });
  };

  const handleInputChangePhone = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrEdit(values);
    setValues({ ...initialStateValues });
  };

  const addOrEdit = async (unitObject) => {
    try {
      if (props.currentId === "") {
        await db
          .collection("portero")
          .doc(props.porteroId)
          .collection("levels")
          .doc(props.levelId)
          .collection("units")
          .doc()
          .set(unitObject);
        toast("Unidad agregada correctamente", {
          type: "success",
          autoClose: 2000,
        });
      } else {
        await db
          .collection("portero")
          .doc(props.porteroId)
          .collection("levels")
          .doc(props.levelId)
          .collection("units")
          .doc(props.currentId)
          .update(unitObject);
        toast("Unidad actualizada correctamente", {
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
            placeholder="Nombre unidad"
            onChange={handleInputChangeName}
            value={values.name}
          />
        </div>
        <div className="form-group input-group">
          <div className="input-group-text bg-light">
            <i className="material-icons">create</i>
          </div>
          <input
            type="text"
            className="form-control"
            name="phone"
            placeholder="Telefono unidad"
            onChange={handleInputChangePhone}
            value={values.phone}
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

export default FormUnits;
