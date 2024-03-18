import { Link } from "react-router-dom";

export default function OperationContents() {
  return (
    <>
      <div className="card body-padding">
        <div className="header">
          <div className="h3">Masters</div>
        </div>
        <div className="card-body">
          <div className="card-header"> Contents</div>
          <div className="card-body row">
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/overview/service">
                <div
                  className="card hover body-padding"
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    Service Master
                  </div>
                </div>
              </Link>
            </div>{" "}
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/contenttype">
                <div
                  className="card hover body-padding"
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    Content Type Master
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/campaigncommitment">
                <div
                  className="card hover body-padding"
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    Campaign Master
                  </div>
                </div>
              </Link>
            </div>
            
          </div>

        </div>
      </div>
    </>
  );
}
