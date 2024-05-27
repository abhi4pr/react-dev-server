import React from "react";
import FieldContainer from "../../FieldContainer";

const PointOfContact = ({ pocs, setPocs }) => {
  const handlePocChange = (index, key, value) => {
    const updatedPocs = pocs.map((poc, pocIndex) =>
      pocIndex === index ? { ...poc, [key]: value } : poc
    );
    setPocs(updatedPocs);
  };

  const handleDeletePoc = (index) => {
    const updatedPocs = [...pocs];
    updatedPocs.splice(index, 1);
    setPocs(updatedPocs);
  };

  function isValidContactNumber(number) {
    if (!number) return true;
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  }

  function isValidEmail(email) {
    if (!email) return true;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  return (
    <>
      {pocs.map((poc, index) => (
        <div className="card">
          <div className="card-header">
            <h4>Point of Contact ({index + 1})</h4>
            <button
              className="btn cmnbtn btn-danger"
              onClick={() => handleDeletePoc(index)}
            >
              Delete
            </button>
          </div>
          <div className="card-body">
            <div key={index} className="row poc-container">
              <FieldContainer
                label="Contact Name"
                fieldGrid={4}
                value={poc.contact_name}
                onChange={(e) =>
                  handlePocChange(index, "contact_name", e.target.value)
                }
                placeholder="Enter contact name"
                required
              />
              <div className="col-4">
                <FieldContainer
                  label="Contact Number"
                  type="number"
                  fieldGrid={12}
                  value={poc.contact_no}
                  onChange={(e) =>
                    handlePocChange(index, "contact_no", e.target.value)
                  }
                  placeholder="Enter contact number"
                  required
                />
                {!isValidContactNumber(poc.contact_no) && (
                  <div className="form-error">
                    Please Enter Valid Contact Number
                  </div>
                )}
              </div>
              <div className="col-4">
                <FieldContainer
                  label="Alternative Contact Number"
                  type="number"
                  fieldGrid={12}
                  value={poc.alternative_contact_no}
                  onChange={(e) =>
                    handlePocChange(
                      index,
                      "alternative_contact_no",
                      e.target.value
                    )
                  }
                  placeholder="Enter alternative contact number"
                />
                {!isValidContactNumber(poc.alternative_contact_no) && (
                  <div className="form-error">
                    Please Enter Valid Contact Number
                  </div>
                )}
              </div>
              <div className="col-4">
                <FieldContainer
                  label="Email"
                  type="email"
                  fieldGrid={4}
                  value={poc.email}
                  onChange={(e) =>
                    handlePocChange(index, "email", e.target.value)
                  }
                  placeholder="Enter email"
                  required
                />
                {!isValidEmail(poc.email) && (
                  <div className="form-error">Please Enter Valid Email</div>
                )}
              </div>
              <FieldContainer
                label="Department"
                fieldGrid={4}
                value={poc.department}
                onChange={(e) =>
                  handlePocChange(index, "department", e.target.value)
                }
                placeholder="Enter department"
              />
              <FieldContainer
                label="Designation"
                fieldGrid={4}
                value={poc.designation}
                onChange={(e) =>
                  handlePocChange(index, "designation", e.target.value)
                }
                placeholder="Enter designation"
              />
              <FieldContainer
                label="Description"
                fieldGrid={4}
                value={poc.description}
                onChange={(e) =>
                  handlePocChange(index, "description", e.target.value)
                }
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PointOfContact;
