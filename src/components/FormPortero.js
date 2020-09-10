import React, { useState, useEffect } from "react";

import { db } from "../firebase";

function FormPortero(props) {
  const initialStateValues = {
    name: "",
  };
  const [values, setValues] = useState(initialStateValues);

  useEffect(() => {
    if (props.currentId === "") {
      setValues({ ...initialStateValues });
    } else {
      getPorteroById(props.currentId);
    }
  }, [props.currentId]);

  const getPorteroById = async (id) => {
    const doc = await db.collection("porteros").doc(id).get();
    setValues({ ...doc.data() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addOrEdit(values);
    setValues({ ...initialStateValues });
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <form className="card card-body" onSubmit={handleSubmit}>
      <div className="form-group input-group">
        <div className="input-group-text bg-light">
          <i className="material-icons">create</i>
        </div>
        <input
          type="text"
          className="form-control"
          name="name"
          placeholder="Nombre portero"
          onChange={handleInputChange}
          value={values.name}
        />
      </div>

      <button className="btn btn-primary btn-block cursor-pointer">
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
  );
}

export default FormPortero;
