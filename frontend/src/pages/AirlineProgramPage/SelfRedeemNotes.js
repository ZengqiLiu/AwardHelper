import React from "react";
import { parseLinks } from "../../utils/contentParser";

function SelfRedeemNotes({ programDetails }) {
    if (!programDetails) {
        return <p>Loading...</p>;
    }
    const notes = programDetails.selfRedeemNotes;

    if (!notes || notes.length === 0) {
        return;
    }
    
    return (
        <div className="self-redeem-notes">
            <h4>Notes:</h4>
            {parseLinks(notes)}
        </div>
    );
}   
    
export default SelfRedeemNotes;