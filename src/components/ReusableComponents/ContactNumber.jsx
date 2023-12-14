import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const ContactNumber = ({
  label,
  parentComponentContact,
  setParentComponentContact,
}) => {
  const [contact, setContact] = useState(parentComponentContact || "");
  const [isValidcontact, setIsValidContact] = useState(false);
  const [isContactTouched, setIsContactTouched] = useState(false);

  useEffect(() => {
    setContact(parentComponentContact || "");
  }, [parentComponentContact]);

  function validateContact(newContact) {
    return /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact);
  }

  function handleContactChange(event) {
    const newContact = event.target.value;
    setContact(newContact);
    setIsValidContact(newContact ? validateContact(newContact) : false);
    setParentComponentContact(newContact);
  }

  function handleContactBlur() {
    setIsContactTouched(true);
    setIsValidContact(contact ? validateContact(contact) : false);
  }

  return (
    <>
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        type="text"
        value={contact}
        onChange={handleContactChange}
        onBlur={handleContactBlur}
      />
      {(isContactTouched || contact?.length >= 10) && !isValidcontact && (
        <p className="validation_message error">*Please enter valid number</p>
      )}
    </>
  );
};

export default ContactNumber;
