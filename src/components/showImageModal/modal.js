import React from "react";

import './modal.css';

function ImageModal(props) {

    let cbCloseModal = () => {
        props.close();
    }

    return (
        <>
            <div id="myModal" className="modal">
                <span className="close" onClick={cbCloseModal}>&times;</span>
                <img className="modal-content" id="img01" src={props.src} alt='Image'/>
            </div>
        </>
    )
}

export default ImageModal;