import React, {useEffect, useState} from "react";
import FormPortero from "./FormPortero";
import {toast, ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";

import {db} from "../firebase";
import Header from "./Header";

function Porteros() {
    const [porteros, setPorteros] = useState([]);
    const [currentId, setCurrentId] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        getPorteros();
    }, []);

    const getPorteros = () => {
        db.collection("portero").onSnapshot((querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({...doc.data(), id: doc.id});
            });
            setPorteros(docs);
        });
    };

    const onDeleteLink = async (id) => {
        if (window.confirm("Estás seguro de querer eliminar este portero?")) {
            await db.collection("portero").doc(id).delete();
            toast("Portero eliminado", {
                type: "error",
                autoClose: 2000,
            });
        }
    };

    const addOrEdit = async (porteroObject) => {
        try {
            if (currentId === "") {
                await db.collection("portero").doc().set(porteroObject);
                toast("Portero agregado correctamente", {
                    type: "success",
                    autoClose: 2000,
                });
            } else {
                await db.collection("portero").doc(currentId).update(porteroObject);
                toast("Portero actualizado correctamente", {
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
        <>
            <div className="container">
                <div className="row-fluid">
                    <Header/>
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
                        <FormPortero
                            {...{addOrEdit, currentId, setCurrentId, porteros}}
                        />
                    </div>
                </div>
                <div className="row-fluid">
                    <div className="col-12 px-0 py-2">
                        {porteros
                            .filter((item) =>
                                item.name.toUpperCase().includes(query.toUpperCase())
                            )
                            .map((portero) => (
                                <div className="card mb-1" key={portero.id}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h4>{portero.name}</h4>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <i
                                                    className="fas fa-times"
                                                    onClick={() => onDeleteLink(portero.id)}
                                                />
                                                <i
                                                    className="far fa-edit"
                                                    onClick={() => setCurrentId(portero.id)}
                                                />
                                            </div>
                                        </div>
                                        <Link to={`/portero/${portero.id}`}> Ver detalles</Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
}

export default Porteros;
