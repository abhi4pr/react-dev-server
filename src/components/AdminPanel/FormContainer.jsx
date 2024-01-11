import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

const FormContainer = ({
  mainTitle,
  title,
  link,
  buttonAccess,
  newbutton,
  newbuttonRouting,
  newbuttonName,
  children,
  handleSubmit,
  submitButton = true,
  addNewButtonName,
  accordionButtons = [],
  activeAccordionIndex,
  onAccordionButtonClick,
  mainTitleRequired = true,
  loading=false
}) => {
  return (
    <>
      {mainTitleRequired && (
        <div className="form-heading">
          <div className="form_heading_title">
            <h2>{mainTitle}</h2>
          </div>
          {link && buttonAccess && (
            <div className="form_heading_action d-flex ">
              <Link to={link}>
                <button
                  title={"Add New " + mainTitle}
                  className={`btn btn-primary ${
                    addNewButtonName && "text_button"
                  }`}
                >
                  {addNewButtonName ? addNewButtonName : <FaUserPlus />}
                </button>
              </Link>
              {link && newbutton && (
                <Link to={newbuttonRouting}>
                  <button
                    title={"Add " + mainTitle}
                    className={`btn btn-success ml-2 ${
                      newbuttonName && "text_button"
                    }`}
                  >
                    {newbuttonName ? newbuttonName : <FaUserPlus />}
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {!link && (
        <div className="card shadow mb24">
          <div className="card-header d-flex flex-row align-items-center justify-content-between">
            <div className="card_header_title tabbtn_header">
              <div className="btn-group">
                {accordionButtons.length === 0 && <h2>{title}</h2>}
                {accordionButtons.map((buttonName, index) => (
                  <button
                    key={index}
                    className={
                      activeAccordionIndex === index
                        ? `btn btn-primary`
                        : "btn btn-outline-primary"
                    }
                    onClick={() => onAccordionButtonClick(index)}
                  >
                    {buttonName}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="thm_form">
              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="row">{children}</div>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    {accordionButtons.length == 0 && submitButton && (
                      <button
                        className="btn btn btn-primary"
                        style={{ marginRight: "5px" }}
                        type="submit"
                      >
                        Submit
                      </button>
                    )}

                    {activeAccordionIndex === accordionButtons.length - 1 &&
                      submitButton && (
                        <button
                          className={`btn btn ${loading?"btn-danger":"btn-success"}`}
                          style={{ marginRight: "5px" }}
                          type="submit"
                          disabled={loading}
                        >
                          {loading?"Submiting":"Submit"}
                        </button>
                      )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormContainer;
