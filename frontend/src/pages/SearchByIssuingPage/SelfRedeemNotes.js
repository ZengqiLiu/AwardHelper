import React from "react";
import List from "../../components/List";

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
            <List items={notes} />
        </div>
    );
}   
    
export default SelfRedeemNotes;