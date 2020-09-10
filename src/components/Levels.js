import React, { useEffect, useState } from "react";
import FormLevels from "./FormLevels";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { db } from "../firebase";

function Levels(props) {
  const [levels, setLevels] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [query, setQuery] = useState("");
  const [portero, setPortero] = useState({});

  const porteroId = props.match.params.id;

  useEffect(() => {
    getLevels(porteroId);
  }, [porteroId]);

  const getLevels = (porteroId) => {
    db.collection("portero")
      .doc(porteroId)
      .collection("levels")
      .onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setLevels(docs);
      });

    db.collection("portero")
      .doc(porteroId)
      .get()
      .then((doc) => setPortero(doc.data()));
  };

  const onDeleteLink = async (porteroId, currentId) => {
    if (window.confirm("Estás seguro de querer eliminar este level?")) {
      await db
        .collection("portero")
        .doc(porteroId)
        .collection("levels")
        .doc(currentId)
        .delete();
      toast("Level eliminado", {
        type: "error",
        autoClose: 2000,
      });
    }
  };

  const addOrEdit = async (levelObject) => {
    try {
      if (currentId === "") {
        await db
          .collection("portero")
          .doc(porteroId)
          .collection("levels")
          .doc()
          .set(levelObject);
        toast("Level agregado correctamente", {
          type: "success",
          autoClose: 2000,
        });
      } else {
        await db
          .collection("portero")
          .doc(porteroId)
          .collection("levels")
          .doc(currentId)
          .update(levelObject);
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
              <i className="fas fa-search text-grey" aria-hidden="true"></i>
            </span>
          </div>
        </div>

        <div className="col-12 px-0 py-2">
          <FormLevels
            {...{
              addOrEdit,
              currentId,
              setCurrentId,
              levels,
              porteroId,
              toast,
            }}
          />
        </div>
      </div>
      <div className="row-fluid">
        <div className="col-12 px-0 py-2">
          <h4>{portero.name}</h4>
          {levels
            .filter((item) =>
              item.name.toUpperCase().includes(query.toUpperCase())
            )
            .map((level) => (
              <div className="card mb-1" key={level.id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h4>{level.name}</h4>
                    <div className="d-flex justify-content-center align-items-center">
                      <i
                        className="fas fa-times"
                        onClick={() => onDeleteLink(porteroId, level.id)}
                      ></i>
                      <i
                        className="far fa-edit"
                        onClick={() => setCurrentId(level.id)}
                      ></i>
                    </div>
                  </div>
                  <Link to={`/portero/${porteroId}/level/${level.id}`}>
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Levels;
