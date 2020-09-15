import React, { useEffect, useState } from "react";
import FormUnits from "./FormUnits";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { db } from "../firebase";

function Units(props) {
  const [units, setUnits] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [query, setQuery] = useState("");
  const [portero, setPortero] = useState([]);
  const [level, setLevel] = useState([]);

  const porteroId = props.match.params.porteroId;
  const levelId = props.match.params.levelId;

  useEffect(() => {
    getUnits(levelId);
  }, [levelId]);

  const getUnits = (levelId) => {
    db.collection("portero")
      .doc(porteroId)
      .collection("levels")
      .doc(levelId)
      .collection("units")
      .onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setUnits(docs);
      });

    db.collection("portero")
      .doc(porteroId)
      .get()
      .then((doc) => setPortero(doc.data()));

    db.collection("portero")
      .doc(porteroId)
      .collection("levels")
      .doc(levelId)
      .get()
      .then((doc) => setLevel(doc.data()));
  };

  const onDeleteLink = async (porteroId, levelId, currentId) => {
    if (window.confirm("Estás seguro de querer eliminar esta unidad?")) {
      await db
        .collection("portero")
        .doc(porteroId)
        .collection("levels")
        .doc(levelId)
        .collection("units")
        .doc(currentId)
        .delete();
      toast("Unidad eliminada", {
        type: "error",
        autoClose: 2000,
      });
    }
  };

  const addOrEdit = async (unitObject) => {
    try {
      if (currentId === "") {
        await db
          .collection("portero")
          .doc(porteroId)
          .collection("levels")
          .doc(levelId)
          .collection("units")
          .doc()
          .set(unitObject);
        toast("Level agregado correctamente", {
          type: "success",
          autoClose: 2000,
        });
      } else {
        await db
          .collection("portero")
          .doc(porteroId)
          .collection("levels")
          .doc(levelId)
          .collection("units")
          .doc(currentId)
          .update(unitObject);
        toast("Level actualizado correctamente perri", {
          type: "info",
          autoClose: 2000,
        });
        setCurrentId("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row-fluid">
        <div className="input-group md-form form-sm form-2 pl-0">
          <input
            className="form-control my-0 py-1 amber-border"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="input-group-append">
            <span className="input-group-text lighten-3" id="basic-text1">
              <i className="fas fa-search text-grey" aria-hidden="true"/>
            </span>
          </div>
        </div>

        <div className="col-12 px-0 py-2">
          <FormUnits
            {...{
              addOrEdit,
              currentId,
              setCurrentId,
              units,
              porteroId,
              levelId,
              toast,
            }}
          />
        </div>
      </div>
      <div className="row-fluid">
        <div className="col-12 px-0 py-2">
          <h4>
            {portero.name} <span className="mr-2 ml-2">/</span> {level.name}
          </h4>
          {units
            .filter((item) =>
              item.name.toUpperCase().includes(query.toUpperCase())
            )
            .map((unit) => (
              <div className="card mb-1" key={unit.id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{unit.name}</h4>
                      <h5>Teléfono: {unit.phoneNumber}</h5>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <i
                        className="fas fa-times"
                        onClick={() =>
                          onDeleteLink(porteroId, levelId, unit.id)
                        }
                      />
                      <i
                        className="far fa-edit"
                        onClick={() => setCurrentId(unit.id)}
                      />
                    </div>
                  </div>
                  <Link to={`/portero/level/${unit.id}`}> Ver detalles</Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Units;
